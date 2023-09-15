<template>
    <div class="layerSeries-box">

        <!-- 打开面板 -->
        <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{$t('global.mapDataUrl')}}</span>
            <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                    <n-input class="add-input-border" style="width: 2.2rem" v-model:value="state.dataUrl" type="text"
                        :placeholder="$t('global.inputServerUrl')" />
                </template>
                {{ state.dataUrlTip }}
            </n-tooltip>
        </div>
        <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{$t('global.datasetName')}}</span>
            <n-input class="add-input-border" style="width: 2.2rem" v-model:value="state.datasetName" type="text"
                :placeholder="$t('global.inputSourceName')" />
        </div>

        <div class=" oprationBtn">
            <n-button type="info" color="#3499E5" text-color="#fff" :loading="state.isloading_table" @click="startQuery"
                style="margin-right: 0.1rem">{{$t('global.attributeList')}}</n-button>
            <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t('global.clear')
            }}</n-button>
        </div>

        <!-- 表格 - 操作面板 -->
        <div id="queryTable" v-if="state.showQueryTable">
            <!-- 表头 -->
            <div class="tableHeader">
                <div class="item tableInfo">{{ state.datasetName }}{{$t('global.listTotal_s')}}&nbsp;{{ tableCount }}&nbsp;{{$t('global.listTotal_e')}}</div>

                <!-- 过滤框 -->
                <div class="item search">
                    <n-input-group>
                        <n-input class="add-input-border" style=" margin-bottom: 0.1rem;width: 1.8rem"
                            :placeholder="state.queryPlaceHolder" v-model:value="state.sqlString"
                            :disabled="state.selectFiled === 'chooseFeild'">
                        </n-input>
                        <n-popover placement="bottom" trigger="click" style="max-height: 240px" scrollable>
                            <template #trigger>
                                <n-tooltip placement="top-end" trigger="hover">
                                    <template #trigger>
                                        <n-button type="tertiary">{{ state.selectFiled == 'chooseFeild' ? state.chooseField : state.selectFiled}}</n-button>
                                    </template>
                                    {{$t('global.chooseFieldTip')}}
                                </n-tooltip>
                            </template>
                            <n-radio-group v-model:value="state.selectFiled" name="radiogroup">
                                <n-space vertical>
                                    <n-radio v-for="song in columns" :key="song.title" :value="song.title">
                                        {{ song.title }}
                                    </n-radio>
                                </n-space>
                            </n-radio-group>
                        </n-popover>
                        <n-button :loading="state.isloading" @click="search"
                            :disabled="state.selectFiled === 'chooseFeild'">{{$t('global.filter')}}</n-button>
                    </n-input-group>
                </div>

                <!-- 操作按钮 -->
                <div class="items">
                    <div class="icon-list-box" style="width: 2.2rem;">
                        <!-- 字段筛选 -->
                        
                        <span class="icon-span-three">
                            <n-tooltip placement="top-end" trigger="hover">
                                <template #trigger>
                                    <i class="iconfont iconSize iconshpchaxun"
                                        @click="openMydata"></i>
                                </template>
                                {{$t('global.shpQueryTip')}}
                            </n-tooltip>
                        </span>
                        <span class="icon-span-three">
                            <n-tooltip placement="top-end" trigger="hover">
                                <template #trigger>
                                    <i class="iconfont iconSize icondianxuan" @click="clickQuery"></i>
                                </template>
                                {{$t('global.clickQuery')}}
                            </n-tooltip>
                        </span>
                        <span class="icon-span-three">
                            <n-tooltip placement="top-end" trigger="hover">
                                <template #trigger>
                                    <i class="iconfont iconSize iconshanchu" @click="clearEntity"></i>
                                </template>
                                {{$t('global.clearEntityTip')}}
                            </n-tooltip>
                        </span>
                        <span class="icon-span-three">
                            <n-tooltip placement="top-end" trigger="hover">
                                <template #trigger>
                                    <i class="iconfont iconSize iconshuaxin" @click="queryAll"></i>
                                </template>
                                {{$t('global.refreshData')}}
                            </n-tooltip>
                        </span>
                        <span class="icon-span-three">
                            <n-tooltip placement="top-end" trigger="hover">
                                <template #trigger>
                                    <i class="iconfont iconSize iconguanbi" @click="state.showQueryTable = false"></i>
                                </template>
                                {{$t('global.close')}}
                            </n-tooltip>
                        </span>
                    </div>
                </div>
            </div>

            <!--表格数据 -->
            <n-data-table size="small" :columns="columns" :data="state.tableData" flex-height class="flex-1-hidden"
                v-model:checked-row-keys="state.checkedRowKeys" :scroll-x="columns.length * 110" />
            <!-- 页码控制器 -->
            <div class="pagination">
                <div></div>
                <n-pagination :item-count="state.itemCount" :page-sizes="[10, 20, 30, 40]" :page="state.page"
                    :page-size="state.pageSize" @update:page="onPageChange" @update:page-size="onUpdatePageSize" />
            </div>

            <!-- show-size-picker -->
            <!-- :pagination="pagination"  -->
            <!-- :row-class-name="rowClassName" -->
            <!-- @update:checked-row-keys="handleCheck" -->
            <!-- v-model:checked-row-keys="state.checkedRowKeys"  -->
        </div>

        <!-- 我的数据面板 -->
        <div v-if="state.myDataPanleShow">
            <!-- <myDataPanel v-model:queryInfo="queryInfo"></myDataPanel> -->
            <n-modal v-model:show="state.myDataPanleShow">
                <n-card style="width: 600px" title="My Data" :bordered="false" size="huge" role="dialog" aria-modal="true">
                    <div id="myDataTable">
                        <n-data-table size="small" :columns="state.columns_mydata" :data="state.portalServiceList_mydata" :pagination="pagination_mydata"
                            flex-height class="flex-1-hidden" v-model:checked-row-keys="state.checkedRowKeys_mydata" />
                    </div>
                    <div :class="{oprationBtn_noloading:!state.isloading_mydata,oprationBtn_loading:state.isloading_mydata}">
                        <n-button type="info" color="#3499E5" text-color="#fff" :loading="state.isloading_mydata" @click="addShp_mydata"
                            style="margin-right: 0.1rem">{{$t('global.sure')}}</n-button>
                        <n-button class="btn-secondary" @click="cancle_mydata" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t('global.cancle')
                        }}</n-button>
                    </div>
                </n-card>
            </n-modal>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref,reactive, onBeforeUnmount, watch, computed } from "vue";
import { useLayerStore } from "@/store/layerStore";
import { useMessage } from "naive-ui";
// import ColumnSetting from './coms/column-setting.vue';
import { getRootUrl} from "@/tools/iportal/portalTools";
import { IportalStoreCreate } from "@/store/index";

const message = useMessage();

const IportalStore = IportalStoreCreate();
const layerStore = useLayerStore();

type StateType = {
    selectedIndex: number, //默认选择图层index
    dataUrl: string,
    datasetName: string,
    columns: any,
    tableData: any,
    checkedRowKeys: any,
    showQueryTable: boolean,
    page: number,
    pageSize: number,
    sqlString: string,
    selectFiled: string,
    queryPlaceHolder: string,
    itemCount: number,
    isFilter: boolean,
    myDataPanleShow: boolean,
    isClickQuery: boolean,
    isChangeDataSet: boolean,
    dataUrlTip: string,
    isloading: boolean,
    isloading_table: boolean,
    isProjection:boolean
    portalServiceList_mydata: any,
    columns_mydata: any,
    tableData_mydata: any,
    checkedRowKeys_mydata: any
    isMydate:boolean
    isloading_mydata:boolean,
    chooseField:string,
}

// 初始化数据
let state = reactive<StateType>({
    selectedIndex: 0, //默认选择图层index
    // dataUrl: 'https://iserver.supermap.io/iserver/services/data-world/rest/data',
    // datasetName: "World:Countries",
    // dataUrl: 'http://172.16.15.203:8090/iserver/services/data-China400/rest/data',
    // datasetName: "China:China",
    // dataUrl: "http://172.16.15.203:8090/iserver/services/data-80wtuban/rest/data",
    // datasetName: "DLTB80w:DLTB_1", // 80多万
    // dataUrl: "http://127.0.0.1:8090/iserver/services/data-mapqueryProjection/rest/data",
    // datasetName: "0830:NewDataset", 
    dataUrl: "",
    datasetName: "",

    // 表格 点选
    columns: [],
    tableData: [],
    checkedRowKeys: ["1"],
    showQueryTable: false,
    page: 1,
    pageSize: 10,
    sqlString: "",
    selectFiled: 'chooseFeild',
    queryPlaceHolder: GlobalLang.queryPlaceHolder,
    itemCount: 0,
    isFilter: false,
    myDataPanleShow: false,
    isClickQuery: false,
    isChangeDataSet: false,

    // 输入提示
    dataUrlTip: `http://<server>:<port>/iserver/services/{dataProvider}/rest/data`,
    isloading: false,
    isloading_table: false,
    isProjection:false,

    // 我的数据
    isMydate:false,
    portalServiceList_mydata: [],
    columns_mydata: [
        {
            type: 'selection',
            multiple: false,
            align: 'center',
            disabled: (rowdata) => {
                return rowdata.disabled ? true : false;
            }
        },
        {
            key: "fileName",
            title: GlobalLang.resouceName,
            align: 'center'
        },
        {
            key: "id",
            title: "ID",
            align: 'center',
        },
        {
            key: "type",
            title: GlobalLang.resouceType,
            align: 'center'
        },
        {
            key: "createTime",
            title: GlobalLang.createTime,
            align: 'center'
        }
    ],
    tableData_mydata: [],
    checkedRowKeys_mydata: ["1"],
    isloading_mydata:false,
    chooseField:GlobalLang.chooseField,
});

let handler;
let targerMapLayer;

function init() {
    state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
    targerMapLayer = layerStore.layerTreeData[1].children[state.selectedIndex];
    // 获取图层绑定的数据源信息
    setQueryInfo();
}
init();

// 获取数据-第一页
function startQuery() {
    if (state.dataUrl == '' || state.datasetName == '') {
        message.error(GlobalLang.mapQueryTip);
        return;
    }

    if (state.tableData.length > 0 && !state.isChangeDataSet) {
        state.showQueryTable = true;
        return;
    }

    clear(false);
    state.selectFiled = 'chooseFeild';
    state.isloading_table = true;
    state.isFilter = false;
    state.isChangeDataSet = false;

    // // // state.isMydate = false;
    // if (state.isChangeDataSet) {
    //     state.tableData.length = 0;
    //     state.showQueryTable = false;
    // }


    // 查询数据
    queryAll();

    let item = layerStore.mapQueryOptions.filter(item => item.label == targerMapLayer.label);
    if (item.length === 0) {
        // 保存数据源信息
        let obj = {
            label: targerMapLayer.label,
            dataUrl: state.dataUrl,
            datasetName: state.datasetName
        }
        layerStore.mapQueryOptions.push(obj);
    }
}

// 刷新表格
function queryAll(){
    if(state.itemCount === 0){
        message.success(GlobalLang.queryWait);
    }else{
        message.success(GlobalLang.refreshData);
    }

    // 指定SQL查询服务参数
    let sqlParam = new L.supermap.GetFeaturesBySQLParameters({
        queryParameter: {
            // name: "Countries@World", // 非必选项
            attributeFilter: "SMID > 0"
        },
        fromIndex: 0,
        toIndex: 10, // 设置为10，加快查询速度
        datasetNames: [state.datasetName]
    });
    // 创建SQL查询实例
    new L.supermap.FeatureService(state.dataUrl).getFeaturesBySQL(sqlParam, function (serviceResult) {
        // 获取服务器返回的结果
        let result = serviceResult.result;
        console.log("result-all:", result);
        let features: any = result.features.features;
        state.itemCount = result.totalCount;
        let features_pageSize = features.slice(0, 10);
        state.isloading_table = false;
        updateTable(features_pageSize);

        let coordinate = features[0].geometry.coordinates[0][0];
        if(coordinate){
            if(coordinate instanceof Array){
                let coordinate_ = coordinate[0];
                if(Math.abs(coordinate_[0]) > 180){
                    state.isProjection = true;
                }else{
                    state.isProjection = false;
                }
            }else{
                if(Math.abs(coordinate[0]) > 180){
                    state.isProjection = true;
                }else{
                    state.isProjection = false;
                }
            }

        }
    });
}

// 点选查询
function clickQuery() {
    if (state.isClickQuery) {
        if (handler) {
            handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)//移除事件
            handler.destroy();
            handler = null;
        }
        message.success(GlobalLang.clickQueryClose);
        state.isClickQuery = false;

        // 恢复鼠标样式
        window.viewer.enableCursorStyle = true;
        document.body.classList.remove('drawCur');
        return;
    }
    message.success(GlobalLang.clickQueryCloseTip);
    state.isClickQuery = true;

    // 修改鼠标样式
    window.viewer.enableCursorStyle = false;
    window.viewer._element.style.cursor = '';
    document.body.classList.add("drawCur");

    handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (event) {
        viewer.entities.removeAll();

        let position = viewer.scene.pickPosition(event.position);
        let position2 = CartesiantoDegrees(position);

        let point = L.marker([position2[1], position2[0]]); // SuperMap3D和leaflet这里对调了

        // 如果是投影坐标系对geometry进行坐标转换
        let geometry: any = undefined;
        if (state.isProjection) {
            geometry = L.supermap.Util.transform(point, L.CRS.EPSG4326, L.CRS.EPSG3857);
        } else {
            geometry = point;
        }
        let geometryParam = new L.supermap.GetFeaturesByGeometryParameters({
            datasetNames: [state.datasetName],
            geometry: geometry,
            spatialQueryMode: "INTERSECT"
        });

        new L.supermap
            .FeatureService(state.dataUrl)
            .getFeaturesByGeometry(geometryParam, function (serviceResult) {
                console.log("点选查询:", serviceResult);
                if (!serviceResult.result.features) return;
                let features = serviceResult.result?.features?.features;
                state.itemCount = 1;
                updateTable(features);
                addFeature(features[0]);
            });

    }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(e => {
        clickQuery();
    }, SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
}

//笛卡尔转经纬度
function CartesiantoDegrees(Cartesians) {
    let array = [].concat(Cartesians);
    let positions: any = [];
    for (let i = 0, len = array.length; i < len; i++) {
        let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
        let longitude = Number(SuperMap3D.Math.toDegrees(cartographic.longitude));
        let latitude = Number(SuperMap3D.Math.toDegrees(cartographic.latitude));
        let h = Number(cartographic.height);
        if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
            positions.push(longitude);
            positions.push(latitude);
            positions.push(h);
        }
    }
    return positions
};

// 获取已绑定的图层查询信息
function setQueryInfo() {
    if (layerStore.mapQueryOptions.length > 0) {
        let targetLayerLable = targerMapLayer.label;
        let targetItem = layerStore.mapQueryOptions.filter(item => item.label == targetLayerLable);
        if (targetItem.length > 0) {
            state.dataUrl = targetItem[0].dataUrl;
            state.datasetName = targetItem[0].datasetName;
        }
    }
}

// 清除
function clear(isClearInfo = true) {
    // 删除添加的geojson数据源
    for (let i = 0; i < geoJsonDataSourceList.length; i++) {
        let geoJsonDataSource = geoJsonDataSourceList[i];
        viewer.dataSources.remove(geoJsonDataSource);
    }
    geoJsonDataSourceList = [];
    state.showQueryTable = false;
    if (handler) {
        handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)//移除事件
        handler.destroy();
        handler = null;
    }
    if (isClearInfo) {
        state.dataUrl = '';
        state.datasetName = '';
    }
    state.columns = [];
    state.tableData = [];
    state.itemCount = 0;
    state.isloading = false;
    state.isloading_table = false;
    state.isloading_mydata = false;
    state.isProjection = false;
    state.sqlString = '';
    state.isMydate = false;

    columns.value.length = 0;
    columns.value.push({
        type: 'selection',
        multiple: false,
        align: 'center'
    });

    viewer.entities.removeAll();

    // 恢复鼠标样式
    window.viewer.enableCursorStyle = true;
    document.body.classList.remove('drawCur');

    // if(panelStore.queryData.length>0){
    //     viewer.dataSources.removeAll();
    // }
}

function clearEntity() {
    // 删除添加的geojson数据源
    for (let i = 0; i < geoJsonDataSourceList.length; i++) {
        let geoJsonDataSource = geoJsonDataSourceList[i];
        viewer.dataSources.remove(geoJsonDataSource);
    }
    geoJsonDataSourceList = [];
    viewer.entities.removeAll();
}

// 表格相关
// 更新表格
function updateTable(features: any[]) {
    // 初始化
    state.tableData = [];

    if (columns.value.length === 1) {
        if (features.length < 1) return;

        // 设置字段
        let keys = Object.keys(features[0].properties);
        keys.forEach((key: string) => {
            // if (['SMAREA', 'SMPERIMETER', 'SMGEOPARAM'].indexOf(key) == -1) {
            columns.value.push({
                key: key,
                title: key,
                // resizable: true, // 列宽可拖拽
                align: 'center',
                width: 100,
            },);
            // }
        })
    }

    // 设置数据
    let tableData: any = [];
    features.forEach((feature: any) => {
        feature.properties.key = feature.properties.SMID;
        tableData.push(feature.properties);
    })
    state.tableData = tableData;
    state.showQueryTable = true;
}

// 选中行查询
function handleCheck(rowKeys: any) {
    viewer.entities.removeAll();
    // 数据集ID查询服务参数
    let idsParam = new L.supermap.GetFeaturesByIDsParameters({
        IDs: rowKeys,
        datasetNames: [state.datasetName]
    });
    // 创建指定ID查询实例
    new L.supermap.FeatureService(state.dataUrl).getFeaturesByIDs(idsParam, function (serviceResult) {
        // 获取服务器返回的结果
        console.log("选中行查询结果:", serviceResult.result);
        let feature = serviceResult.result.features.features[0];
        addFeature(feature);
    });
}

// 通过GeoJsonDataSource.load直接添加feature
let geoJsonDataSourceList:any = [];
function addFeature(feature: any) {
    if (geoJsonDataSourceList.length > 0 && !state.isMydate) {
        let lastGeoJsonDataSource = geoJsonDataSourceList.pop();
        viewer.dataSources.remove(lastGeoJsonDataSource);
    }
    if(!feature) return;
    if(state.isProjection){
        // feature = GeoJsonProjectToLatLng(feature);  // 我自己实现的方法
        feature = L.supermap.Util.transform(feature, L.CRS.EPSG3857, L.CRS.EPSG4326); // supermap写的
        if(!feature) return;
    }
    let entityPromise = SuperMap3D.GeoJsonDataSource.load(feature);
    entityPromise.then(function (dataSource:any) {
        geoJsonDataSourceList.push(dataSource);
        viewer.dataSources.add(dataSource);
        let entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            entity.polygon.material = SuperMap3D.Color.BLUE.withAlpha(0); // 闪面
            entity.polygon.heightReference = SuperMap3D.HeightReference.CLAMP_TO_GROUND; // 贴地
        }
        viewer.zoomTo(entities[0]);
    }).otherwise(function (error) {
        window.alert(error);
    });
}

// 将feature投影坐标系转为经纬度形式
function GeoJsonProjectToLatLng(feature:any) {
    let leafletLayer = L.geoJSON(feature, {
        coordsToLatLng: function (coords:any) {
            return L.CRS.EPSG3857.unproject(L.point(coords[0], coords[1]));
        }
    });
    if (leafletLayer._layers) {
        let keys = Object.keys(leafletLayer._layers);
        let key = keys[0];
        let layerLatlngs:any;
        if (layerLatlngs = leafletLayer._layers[key]._latlngs) {
            layerLatlngs = leafletLayer._layers[key]._latlngs[0];
        } else {
            return undefined;
        }

        let allArray:any = []
        for (let i = 0; i < layerLatlngs.length; i++) {
            let layerLatlng = layerLatlngs[i];
            let array:any = []
            layerLatlng.forEach((element:any) => {
                array.push([element.lng, element.lat])
            });
            allArray.push(array);
        }
        feature.geometry.coordinates = [allArray];
    } else {
        return undefined;
    }

    return feature;
}


// 表格列
const columns: any = ref([
    {
        type: 'selection',
        multiple: false,
        align: 'center'
    }
]);

// sql模糊查找
function search() {
    message.success(GlobalLang.dataFiltering);
    state.isloading = true;
    state.page = 1;
    let sqlString = `${state.selectFiled} like '%${state.sqlString}%'`;
    console.log("sqlString:", sqlString);
    // 指定SQL查询服务参数
    let sqlParam = new L.supermap.GetFeaturesBySQLParameters({
        queryParameter: {
            // name: "Countries@World",
            attributeFilter: sqlString
        },
        fromIndex: 0,
        toIndex: 10,
        datasetNames: [state.datasetName]
    });
    // 创建SQL查询实例
    new L.supermap.FeatureService(state.dataUrl).getFeaturesBySQL(sqlParam, function (serviceResult) {
        // 获取服务器返回的结果
        let result = serviceResult.result;
        console.log("sqlQuery:", result);
        let features: any = result.features.features;
        let features_pageSize = features.slice(0, 10);
        state.itemCount = result.totalCount;
        state.isFilter = true;
        state.isloading = false
        updateTable(features_pageSize);
    });
}

// 分页查找
function getDataByPage(pageNum) {
    // 指定SQL查询服务参数
    let start = (pageNum - 1) * 10;
    let end = (pageNum - 1) * 10 + 10;
    let sqlString: string;
    if (state.isFilter) {
        sqlString = `${state.selectFiled} like '%${state.sqlString}%' limit ${(state.page - 1) * 10},10`
    } else {
        // sqlString = `SMID > ${start} and SMID <= ${end}`;
        sqlString = `SMID > 0 limit ${(pageNum - 1) * 10},10`;
    }

    console.log("分页-sqlString:", sqlString);
    let sqlParam = new L.supermap.GetFeaturesBySQLParameters({
        queryParameter: {
            // name: "Countries@World",
            attributeFilter: sqlString
        },
        fromIndex: 0,
        toIndex: 10,
        datasetNames: [state.datasetName]
    });
    // 创建SQL查询实例
    new L.supermap.FeatureService(state.dataUrl).getFeaturesBySQL(sqlParam, function (serviceResult) {
        // 获取服务器返回的结果
        let result = serviceResult.result;
        let features: any = result.features.features;
        console.log("分页-features:", features);
        updateTable(features);
    });
}

// 页码变化事件
function onPageChange(page: number) {
    state.page = page;
    getDataByPage(page);
}
// 页码尺寸变化
function onUpdatePageSize(pageSize: number) {
    state.pageSize = pageSize;
    state.page = 1;
}

let tableCount = computed(() => {
    return state.itemCount;
})

let queryInfo = computed(() => {
    let obj = {
        dataUrl: state.dataUrl,
        datasetName: state.datasetName
    }
    return obj;
})

// 我的数据
function openMydata(){
    init_mydata();
    state.myDataPanleShow = true;
    message.success(GlobalLang.getData);
    state.isMydate = true;
}

// 初始化并获取数据
function init_mydata() {
    //查询出portal中的服务列表（只查询出服务项）
    let myDataUrl =
        getRootUrl() +
        "web/datas.json?types=%5B%22JSON%22%2C%22EXCEL%22%2C%22CSV%22%2C%22GEOJSON%22%2C%22SHP%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&currentPage=1&pageSize=8";

    // http://localhost:8190/iportal/web/datas.json?types=%5B%22JSON%22%2C%22EXCEL%22%2C%22CSV%22%2C%22GEOJSON%22%2C%22SHP%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&currentPage=1&pageSize=8
    // http://localhost:8190/iportal/web/datas/632566313/content.json?&currentPage=1&pageSize=99999999
    console.log("myDataUrl-mine:", myDataUrl);

    window.axios
        .get(myDataUrl, { withCredentials: IportalStore.isPortal })
        .then(function (response) {
            console.log("response-myData:", response);
            let data = response.data.content;
            data.forEach(item => {
                let disabled = item.type != "SHP"; //是否禁用选择
                let name = item.fileName.split('.')[0];
                state.portalServiceList_mydata.push({
                    key: item.id,
                    fileName: name,
                    id: item.id,
                    type: item.type,
                    createTime: dateDiff(item.createTime),
                    disabled: disabled
                });
            });
            console.log(" state.portalServiceList：", state.portalServiceList_mydata);

        });


}


// 打开保存的服务
function addShp_mydata() {
    let selecteditems = state.portalServiceList_mydata.filter((item: any) => {
        return item.key === state.checkedRowKeys_mydata[0];
    })
    if (viewer) {
        selecteditems.forEach(item => {
            console.log("item-mydataSelect:", item);

            let resouceID = item.id;
            let resouceUrl = getRootUrl() + `web/datas/${resouceID}/content.json?&currentPage=1&pageSize=99999999`;
            console.log("resouceUrl:", resouceUrl);
            state.isloading_mydata = true;

            window.axios
                .get(resouceUrl, { withCredentials: IportalStore.isPortal })
                .then(function (responseData) {
                    state.isloading_mydata = false;
                    let contentShp = JSON.parse(responseData.data.content);
                    console.log("contentShp:", contentShp)

                    let firstFeature = contentShp.layers[0].features[0];
                    let polygonPositions: any = [];
                    let positions = firstFeature.geometry.coordinates[0][0];
                    positions.forEach((position: any) => {
                        polygonPositions.push(position[0]);
                        polygonPositions.push(position[1]);
                    })

                    let entity = viewer.entities.add({
                        polygon: {
                            hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(polygonPositions),
                            material: SuperMap3D.Color.BLUE,
                        },
                    })

                    viewer.zoomTo(entity);
                    state.myDataPanleShow = false;
                    let positions_reverse = positions.map(arr=>arr.reverse()); // 数组倒置，因为leaflet经纬度和xy相反
                    let polygon = L.polygon(positions_reverse, { color: 'red' }); 
                    let geometry_mydata: any = undefined;
                    if (state.isProjection) {
                        geometry_mydata = L.supermap.Util.transform(polygon, L.CRS.EPSG4326, L.CRS.EPSG3857);
                    } else {
                        geometry_mydata = polygon;
                    }
                    let geometryParam = new L.supermap.GetFeaturesByGeometryParameters({
                        datasetNames: [state.datasetName],
                        geometry: geometry_mydata,
                        spatialQueryMode: "INTERSECT"
                    });

                    new L.supermap
                        .FeatureService(state.dataUrl)
                        .getFeaturesByGeometry(geometryParam, function (serviceResult) {
                            console.log("指定数据几何查询:", serviceResult);
                            let features = serviceResult.result.features.features;
                            updateTable(features);
                            state.itemCount = features.length;
                            features.forEach((feature:any)=>{
                                addFeature(feature);
                            })
                     
                        });
                });
        });
    }
}

// 取消
function cancle_mydata() {
    state.checkedRowKeys_mydata = ["1"];
    state.myDataPanleShow =false;
    state.isloading_mydata = false;
}

// 表格相关
const pagination_mydata = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onChange: (page: number) => {
        pagination_mydata.page = page;
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination_mydata.pageSize = pageSize;
        pagination_mydata.page = 1;
    }
});

/** 时间倒序，多少小时之前
 * @param timestamp 时间毫秒数
 */
function dateDiff(timestamp) {
    // 补全为13位
    let arrTimestamp: any = (timestamp + "").split("");
    for (let start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = "0";
        }
    }
    timestamp = arrTimestamp.join("") * 1;
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return GlobalLang.recently;
    }
    // 计算差异时间的量级
    let monthC: any = diffValue / month;
    let weekC: any = diffValue / (7 * day);
    let dayC: any = diffValue / day;
    let hourC: any = diffValue / hour;
    let minC: any = diffValue / minute;

    // 数值补0方法
    let zero = function (value) {
        if (value < 10) {
            return "0" + value;
        }
        return value;
    };

    // 使用
    if (monthC > 4) {
        // 超过1年，直接显示年月日
        return (function () {
            let date = new Date(timestamp);
            return (
                date.getFullYear() +
                GlobalLang.yeear +
                zero(date.getMonth() + 1) +
                GlobalLang.month +
                zero(date.getDate()) +
                GlobalLang.day
            );
        })();
    } else if (monthC >= 1) {
        return parseInt(monthC) + GlobalLang.monthsAgo;
    } else if (weekC >= 1) {
        return parseInt(weekC) + GlobalLang.weeksAgo;
    } else if (dayC >= 1) {
        return parseInt(dayC) + GlobalLang.daysAgo;
    } else if (hourC >= 1) {
        return parseInt(hourC) + GlobalLang.hoursAgo;
    } else if (minC >= 1) {
        return parseInt(minC) + GlobalLang.minutesAgo;
    }
    return GlobalLang.secondsAgo;
}

watch(() => state.checkedRowKeys, (val) => {
    handleCheck(val);
})

watch(() => state.datasetName, (val) => {
    state.isChangeDataSet = true;
})


onBeforeUnmount(() => {
    clear(true);
});
</script>
  
<style lang="scss" scoped>
.layerSeries-box {
    width: 100%;
    height: 100%;
    padding: 0 0.12rem;
    box-sizing: border-box;
}

.oprationBtn {
    margin-left: 30%;
    display: flex;
    flex-wrap: wrap;
}
.oprationBtn_loading {
    margin-top:0.1rem;
    margin-left: 68%;
    display: flex;
    flex-wrap: wrap;
}
.oprationBtn_noloading {
    margin-top:0.1rem;
    margin-left: 69%;
    display: flex;
    flex-wrap: wrap;
}

#queryTable {
    position: fixed;
    bottom: 0rem;
    left: 5%;
    width: 90%;
    height: 3rem;
    z-index: 999999;
    background-color: rgb(29, 29, 17);
    opacity: 0.8;

    display: flex;
    flex-direction: column;
}

.tableInfo {
    text-align: center;
    margin-left: 0.2rem;
}

.tableHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 0.4rem;
    width: 100%;

    .items {
        // flex: 1;
        line-height: 0.35rem;
    }

    .search {
        margin-top: 0.1rem;
        margin-right: -4rem;
    }
}

#myDataTable {
    margin-right: 0.1rem;
    height: 230px;
    z-index: 999999;
    background-color: rgb(29, 29, 17);
    opacity: 0.5;

    display: flex;
    flex-direction: column;
    .flex-1-hidden {
    flex: 1 1 0% !important;
    overflow: hidden;
}
}



.opration {
    // display: flex;
    // justify-content: space-between;
    margin-top: 0.1rem;
    margin-left: 73%;
    // margin-left: 1.95rem;
    // margin-right: 0.1rem;
}

.tip{
    color:"#3499E5";
    background-color: null;
}

.pagination {
    display: flex;
    justify-content: space-between;
}

.flex-1-hidden {
    flex: 1 1 0% !important;
    overflow: hidden;
}

:deep(.too-old td) {
    color: rgba(255, 0, 0, 0.75) !important;
}

:deep(.age) {
    color: rgba(0, 128, 0, 0.75) !important;
}

:deep(.too-old .age) {
    color: rgba(0, 0, 128, 0.75) !important;
}

.icon-list-box {
    display: flex;
    // justify-content: center;
    // height: 0.32rem;
    width: 2.2rem;
    height: auto;
    margin-left: 0.4rem;
    // margin-left: 36%;
    // background: rgba(255, 255, 255, 0.04);
    // border: 0.01rem solid rgba(255, 255, 255, 0.15);
    // border-radius: 0.04rem;

    .icon-span {
        width: 20%;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }

    .icon-span-three {
        width: 25%;
        // display: flex;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }

    .selected-icon {
        color: #3499e5;
    }
}
</style>
  
  
  
  
  
  
  
