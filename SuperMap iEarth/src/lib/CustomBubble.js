
class CustomBubble {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.init(options);
    }

    init(parmas = {}) {
        this.styleElementID = 'bubbleStyleTemp';
        this.containerElementID = 'bubbleContainerTemp';
        this.addPreSetCSS();
        this.addPreSetHTML();

        // 弹窗面板的文字内容
        this.handlerTextContent();

        this.isDesplayPickedEntityInfo = parmas.isDesplayPickedEntityInfo === true ? true : false;
        this.scenePosition = undefined;
        this.container = document.getElementById("customBubbleContainer");
        this.title = document.getElementById("customBubbleTitle");
        this.content = document.getElementById("customBubbleContent");
        this.handler = new SuperMap3D.ScreenSpaceEventHandler(this.scene.canvas);

        this.fieldFilterOption = parmas.bubbleFields ?? []; // 属性表中用于过滤的字段
        this.config = null;

        // 内容生成器
        this.contentGenerators = {
            table: data => {
                const table = document.createElement('table');
                table.className = 'bubble-table';
                table.innerHTML = `
                    <thead>
                        <tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${data.rows.map(row =>
                    this.fieldFilterOption.includes(row[0]) ? `<tr>${row.map(cell => `<td title=${cell}>${cell}</td>`).join('')}</tr>` : undefined
                ).join('')}
                    </tbody>
                `;
                return table;
            },
            video: url => {
                const video = document.createElement('video');
                video.controls = true;
                video.src = url;
                video.className = 'media-container';
                return video;
            },
            pdf: url => {
                const object = document.createElement('object');
                object.data = url;
                object.type = 'application/pdf';
                object.className = 'pdf-viewer';
                return object;
            },
            image: url => {
                const img = new Image();
                img.src = url;
                img.className = 'media-container';
                return img;
            },
            link: config => {
                const a = document.createElement('a');
                a.href = config.url;
                a.textContent = config.text != '' ? config.text : config.url;
                a.target = '_blank';
                a.title =  `${this.textContent.document}:${config.url}`;
                return a;
            }
        };
    }

    handlerTextContent(){
        const $t = window.$t;
        this.textContent = {};
        this.textContent.document = $t ? $t("bubble_document") : "在浏览器新标签页中打开文档";
        this.textContent.link = $t ? $t("bubble_link") : "在浏览器新标签页中打开链接";
        this.textContent.title = $t ? $t("bubble_title")  : "信息展示";
        this.textContent.filter = $t ? $t("bubble_filter")  : "过滤";
        this.textContent.selectedField = $t ? $t("bubble_selectedField")  : "选中字段数";
        this.textContent.entityID = $t ? $t("bubble_entityID")  : "实体ID";
        this.textContent.field = $t ? $t("bubble_field") : "字段";
        this.textContent.value = $t ? $t("bubble_value")  : "值";
    }

    start() {
        this.computedBubblePositionBind = this.computedBubblePosition.bind(this);
        this.scene.postRender.addEventListener(this.computedBubblePositionBind);
        this.handler.setInputAction(this.getClickScenePosition.bind(this), SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

        // 绑定关闭事件 
        document.querySelector('.bubble-close').addEventListener('click', () => {
            this.hidden();
        });
    }

    // 获取场景中点击位置的笛卡尔坐标
    getClickScenePosition(e) {
        // 这个接口返回的position会存在Y轴偏移很大的问题
        // this.scene.pickPositionAsync(e.position).then((position) => {
        //     if (position && position instanceof SuperMap3D.Cartesian3) {
        //         this.scenePosition = position;
        //     }
        // })

        this.scenePosition = viewer.scene.pickPosition(e.position);

        let pickedObject = this.scene.pick(e.position);
        if (window.iEarthConsole) console.log("自定义弹窗拾取对象:", pickedObject);
        if (pickedObject && this.isDesplayPickedEntityInfo) {
            this.handlerPickedEntity(pickedObject.id);
        } else {
            this.hidden()
        }
    }

    // 实时计算弹窗位置
    computedBubblePosition() {
        if (this.scenePosition) {
            const windowPosition = new SuperMap3D.Cartesian2();
            SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(this.scene, this.scenePosition, windowPosition);

            if (windowPosition && windowPosition.y && windowPosition.x) {
                this.container.style.top = windowPosition.y - this.container.offsetHeight + "px";
                this.container.style.left = windowPosition.x + "px";
            }
        }
    }

    // 打开弹窗并根据config渲染内容
    open(config) {
        if (!config || !config.content) return;
        this.config = config;

        this.title.textContent = config.title ?? this.textContent.title;
        this.content.innerHTML = '';

        config.content.forEach(item => {
            if (!item || !item.type || !item.data) return;
            const section = document.createElement('div');
            section.className = 'content-section';

            // 表格字段过滤复选框
            if (item.type == 'table') {
                const filterContainer = this.handlerFieldFilter(item.data.rows);
                section.appendChild(filterContainer);
            }

            // 创建弹窗内容
            const generatorFunc = this.contentGenerators[item.type];
            if (!generatorFunc) return;
            const contentDom = generatorFunc(item.data);
            if (!contentDom) return;
            section.appendChild(contentDom);

            // 创建媒体名称超链接
            const itemName = item.name;
            if (item.type != 'table' && itemName && itemName != '') {
                const link = document.createElement('a');
                link.className = 'media-name';
                link.href = item.data;
                link.title = `${this.textContent.link}:${item.data}`;
                link.textContent = itemName;
                link.target = '_blank';
                section.appendChild(link);
            }

            this.content.appendChild(section);
            this.addEventListenerForFieldFilter.call(this); // DOM上绑定事件必须等其添加到document
        });

        this.show();
    }

    hidden() {
        if (this.container) this.container.style.display = 'none';
    }

    show() {
        if (this.container) this.container.style.display = 'flex';
    }

    handlerFieldFilter(options) {
        let contentString = "";
        let fields = [];
        options.forEach(item => {
            if (!item || item.length < 2) return;

            const key = item[0];
            const checkID = `checkbox-${key}`;
            const isChecked = this.fieldFilterOption.length > 0 ? this.fieldFilterOption.includes(key) : true;

            const checkString = `
                <div class="option-item">
                    <input type="checkbox" id="${checkID}" ${isChecked ? "checked" : ""} value="${key}">
                    <label title="${key}" for="${checkID}">${key}</label>
                </div>
            `;
            contentString += checkString;

            fields.push(key);
        })

        if (this.fieldFilterOption.length == 0) {
            this.fieldFilterOption = fields;
            if(window.iEarthBindData) window.iEarthBindData.bubbleFields = fields;
        }

        const htmlF = `
            <div class="dropdown">
                <button class="dropdown-btn">
                    <span>${this.textContent.filter}</span>
                    <span class="selected-count">${this.textContent.selectedField}:${this.fieldFilterOption.length}</span>
                    <span>▼</span>
                </button>
                <div class="dropdown-content">
                    ${contentString}
                </div>
            </div>
        `;
        const containerElement = document.createElement("div");
        containerElement.className = "bubble-dropdown-container";
        containerElement.innerHTML = htmlF;

        return containerElement;
    }
    addEventListenerForFieldFilter() {
        const dropdown = document.querySelector('.dropdown');
        const content = dropdown.querySelector('.dropdown-content');
        const selectedCount = dropdown.querySelector('.selected-count');

        // 切换下拉框显示状态 
        function btnClick(e) {
            e.stopPropagation();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
            if (content.style.display === 'none') {
                this.open(this.config); // 更新当前弹窗
            }
        }
        const btnClick_bind = btnClick.bind(this);
        this.container.addEventListener('click', btnClick_bind);

        // 复选框事件监听:获取选中值
        function updateSelection() {
            const selected = content.querySelectorAll('input:checked');
            const values = Array.from(selected).map(checkbox => checkbox.value);
            selectedCount.textContent = `选中字段数:${values.length}`;
            this.fieldFilterOption = values;
            if(window.iEarthBindData) window.iEarthBindData.bubbleFields = values;
        }
        const updateSelection_bind = updateSelection.bind(this);
        content.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelection_bind);
        });

        // 关闭下拉框（点击外部区域）
        document.addEventListener('click', function () {
            content.style.display = 'none';
        });

        // 阻止下拉内容点击冒泡 
        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }


    handlerPickedEntity(entity) {
        if (!(entity instanceof SuperMap3D.Entity)) return;

        let rowsContent = [];
        if (entity.name) {
            rowsContent.push(['name', entity.name])
        }
        if (entity.description) {
            let string = entity.description._value;
            let description = JSON.parse(string);
            if ((description instanceof Array) && description.length > 0) {
                description.forEach(element => {
                    if ((element instanceof Array) && element.length > 1) {
                        rowsContent.push(element);
                    }
                })
            }
        }
        if (rowsContent.length == 0) return;

        this.open({
            title: `${this.textContent.entityID}:${entity.id}`,
            content: [
                {
                    type: 'table', data: {
                        headers: [this.textContent.field, this.textContent.value],
                        rows: rowsContent
                    }
                }
            ]
        })
    }

    // 销毁:移除style标签和html结构
    destroy() {
        document.getElementById(this.styleElementID).remove();
        document.getElementById(this.containerElementID).remove();
        this.handler.destroy();
        this.container = null;
        this.handler = null;
        this.config = null;
        if (this.computedBubblePositionBind) {
            this.scene.postRender.removeEventListener(this.computedBubblePositionBind);
            this.computedBubblePositionBind = null;
        }
    }

    // 添加预设的HTML样式代码
    addPreSetHTML() {
        if (document.getElementById(this.containerElementID)) return; // 已经有相关的DOM，无需再次添加

        // 弹窗容器
        const htmlF = `
            <div id="customBubbleContainer" class="custom-bubble-container">
                <div class="bubble-wrapper">
                    <div class="bubble-header">
                        <span id="customBubbleTitle"></span>
                        <span class="bubble-close">&times;</span>
                    </div>
                    <div id="customBubbleContent" class="bubble-content">
                        <!-- 动态内容插入区域 -->
                    </div>
                </div>
            </div>
            `;
        const containerElement = document.createElement("div");
        containerElement.id = this.containerElementID;
        containerElement.innerHTML = htmlF;
        if (document.body) {
            document.body.appendChild(containerElement);
        } else {
            window.onload = () => document.body.appendChild(containerElement);
        }
    }

    // 添加预设的CSS样式代码
    addPreSetCSS() {
        if (document.getElementById(this.styleElementID)) return;

        const styleElement = document.createElement("style");
        styleElement.id = this.styleElementID;
        styleElement.textContent = `
            .custom-bubble-container {
                position: fixed;
                top: 150px;
                left: 20px;
                width: 260px;
                height: fit-content;
                display: none;
                justify-content: center;
                align-items: center;
            }

            .custom-bubble-container .bubble-wrapper {
                background: white;
                border-radius: 8px;
                width: 100%;
                max-width: 900px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }

            .custom-bubble-container .bubble-header {
                padding: 5px 10px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .custom-bubble-container #customBubbleTitle{
                font-size: 12px;
                font-weight: bold;
            }

            .custom-bubble-container .bubble-content {
                padding: 0px 6px;
                max-height: 30vh;
                overflow-y: auto;
            }

            /* 多媒体内容适配 */
            .custom-bubble-container .content-section {
                margin: 5px 0;
                border: 1px solid #eee;
                padding: 5px;
                border-radius: 4px;
            }

            .custom-bubble-container .media-container {
                width: 100%;
                margin: 2px;
            }

            .custom-bubble-container .pdf-viewer {
                width: 100%;
                height: 400px;
                border: none;
            }
            .custom-bubble-container .media-name {
                display: block;
                text-align:center;
            }

            .custom-bubble-container .bubble-table{
                width:100%;
            }

            .custom-bubble-container .bubble-table td, .custom-bubble-container .bubble-table th{
                font-size: 12px;    
                text-align: center;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* 自定义弹窗属性表字段复选框 */
            /* 下拉框容器 */
            .bubble-dropdown-container .dropdown {
                position: relative;
                width: 100%;
                font-family: Arial;
            }
    
            /* 触发按钮样式 */
            .bubble-dropdown-container .dropdown-btn {
                width: 100%;
                padding: 12px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                text-align: left;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
            }
    
            /* 下拉内容容器 */
            .bubble-dropdown-container .dropdown-content {
                display: none;
                position: absolute;
                width: 100%;
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid #ddd;
                background: white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 1;
            }
    
            /* 选项样式 */
            .bubble-dropdown-container .option-item {
                padding: 10px;
                display: flex;
                align-items: center;
                transition: background 0.3s;
            }
    
            .bubble-dropdown-container .option-item:hover {
                background: #f5f5f5;
            }
    
            /* 复选框样式 */
            .bubble-dropdown-container input[type="checkbox"] {
                margin-right: 10px;
            }
    
            /* 选中计数显示 */
            .bubble-dropdown-container .selected-count {
                color: #666;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

export default CustomBubble;