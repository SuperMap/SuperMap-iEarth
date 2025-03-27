
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

        this.isDesplayPickedEntityInfo = parmas.isDesplayPickedEntityInfo === true ? true : false;
        this.scenePosition = undefined;
        this.container = document.getElementById("customBubbleContainer");
        this.title = document.getElementById("customBubbleTitle");
        this.content = document.getElementById("customBubbleContent");
        this.handler = new SuperMap3D.ScreenSpaceEventHandler(this.scene.canvas);

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
                            `<tr>${row.map(cell => `<td title=${cell}>${cell}</td>`).join('')}</tr>`
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
                a.textContent = config.text;
                a.target = '_blank';
                return a;
            }
        };
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
        this.scene.pickPositionAsync(e.position).then((position) => {
            if (position && position instanceof SuperMap3D.Cartesian3) {
                this.scenePosition = position;
            }
        })

        let pickedObject = this.scene.pick(e.position);
        console.log("自定义弹窗拾取对象:", pickedObject);
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

        this.title.textContent = config.title ?? '信息展示';
        this.content.innerHTML = '';

        config.content.forEach(item => {
            if(!item || !item.type || !item.data) return;
            const section = document.createElement('div');
            section.className = 'content-section';

            // 创建媒体内容
            const generatorFunc = this.contentGenerators[item.type];
            if(!generatorFunc) return;
            const contentDom = generatorFunc(item.data);
            if(!contentDom) return;
            section.appendChild(contentDom);

            // 创建媒体名称
            const itemName = item.name;
            if(item.type != 'table' && itemName && itemName!=''){
                const link = document.createElement('a');
                link.className = 'media-name';
                link.href = item.data;
                link.title = item.data;
                link.textContent = itemName;
                link.target = '_blank';
                section.appendChild(link);
            }

            this.content.appendChild(section);
        });

        this.show();
    }

    hidden() {
        if (this.container) this.container.style.display = 'none';
    }

    show() {
        if (this.container) this.container.style.display = 'flex';
    }


    handlerPickedEntity(entity){
        if(!(entity instanceof SuperMap3D.Entity)) return;

        let rowsContent = [];
        if(entity.name){
            rowsContent.push(['name',entity.name])
        }
        if(entity.description){
            let string = entity.description._value;
            let description = JSON.parse(string);
            if((description instanceof Array) && description.length>0){ 
                description.forEach(element=>{
                    if((element instanceof Array) && element.length>1){
                        rowsContent.push(element);
                    }
                })
            }
        }
        if(rowsContent.length == 0) return;

        this.open({
            title: `实体ID:${entity.id}`,
            content: [
              {
                type: 'table', data: {
                  headers: ['字段', '值'],
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
        if(this.computedBubblePositionBind) {
            this.scene.postRender.removeEventListener(this.computedBubblePositionBind);
            this.computedBubblePositionBind = null;
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
        `;
        document.head.appendChild(styleElement);
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
}

export default CustomBubble;