import { isTemplateNode } from '@vue/compiler-core';
import { number } from 'echarts/core';
import { update } from 'lodash';
// import layerManagement from "@/tools/layerManagement";
import { defineStore } from 'pinia'


export const useLayerStore = defineStore({
	id: 'useLayerManageStore',
	state: (): any => ({
		configToken:{
			TiandituToken:'', // 天地图token
			BingMapKey:'' // 必应地图key
		},
		layerServiceData: {
			// 公共服务
			publicServiceList: [
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/CBD.jpg",
					// proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
					proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-0523/rest/realspace',
					name: "global.BeijingCBD",
					layers: [{ type: 'S3M', layerName: 'Building@CBD' }, { type: 'S3M', layerName: 'Tree@CBD' }, { type: 'S3M', layerName: 'Xiaopin@CBD' }, { type: 'S3M', layerName: 'Lake@CBD' }, { type: 'S3M', layerName: 'Ground@CBD' }, { type: 'S3M', layerName: 'Ground2@CBD' }, { type: 'S3M', layerName: 'Bridge@CBD' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/Sophia.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-suofeiya_church-2/rest/realspace",
					name: "global.SophiaChurch",
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/ZfTerranAndImagery.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
					name: "global.MountEverest",
					layers: [{ type: 'IMG', layerName: 'image' }, { type: 'TERRAIN', layerName: 'srtm_54_07%40zhufeng' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/BIM.jpg",
					// proxiedUrl: "http://www.supermapol.com/realspace/services/3D-wireFrame-2/rest/realspace",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-BIMbuilding-2/rest/realspace",
					name: "global.BIMBuilding",
					layers: [{ type: 'S3M', layerName: "BIMbuilding" }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/PointCloud.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-cloud-2/rest/realspace",
					name: "global.Pointcloud",
					layers: [{ type: 'S3M', layerName: 'POINTCLOUD23' }],
					chooseType: false
				},
				// {
				// 	type: "REALSPACE",
				// 	thumbnail: "./images/addData/Histogram.jpg",
				// 	proxiedUrl: " https://www.supermapol.com/realspace/services/3D-Histogram/rest/realspace",
				// 	name: "柱状图",
				// 	chooseType: false
				// },
				// {
				// 	type: "REALSPACE",
				// 	thumbnail: "./images/addData/Household.jpg",
				// 	// proxiedUrl: "https://www.supermapol.com/realspace/services/3D-QingXieSheYingMoXing/rest/realspace",
				// 	proxiedUrl: "http://www.supermapol.com/realspace/services/3D-FCFH_Shangdong-2/rest/realspace",
				// 	name: "倾斜影像",
				// 	layers: [{ type: 'S3M', layerName: 'qingxie' }],
				// 	chooseType: false
				// },

				// {
				//     "id": 9,
				//     "type": "SCP",
				//     "thumbnail": "./images/addData/Household.jpg",
				//     "proxiedUrl": "https://www.supermapol.com/realspace/services/3D-FCFH_Shangdong/rest/realspace/datas/config/config",
				//     "name": "倾斜分层分户",
				//     "state": 0
				// },


				{
					type: "MVT",
					thumbnail: "./images/addData/MVT.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE",
					name: "global.JingJinMVT",
					VectorTilesMapName: 'JingJinMVT',
					layers: [{ type: 'MVT', layerName: '京津地区MVT' }],
					chooseType: false
				},
				// {
				//     "id": 10,
				//     "type": "REALSPACE",
				//     "thumbnail": "./images/addData/VectorThematicMap.jpg",
				//     "proxiedUrl": "https://www.supermapol.com/realspace/services/3D-five-vector/rest/realspace",
				//     "name": "矢量专题图",
				//     "state": 0
				// },

				{
					type: "ThematicMap",
					thumbnail: "./images/addData/cqbm.jpg",
					// proxiedUrl: "https://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace/datas/CQmodel/config",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000-2/rest/realspace/datas/wireFrame/config",
					name: "global.ChongqingBaimo",
					S3MLayer: true,
					chooseType: false
				},
				// {
				// 	type: "ThematicMap",
				// 	thumbnail: "./images/addData/hbbm.jpg",
				// 	proxiedUrl: "https://www.supermapol.com/realspace/services/3D-XinBaiMo-2/rest/realspace/datas/%E4%B8%80%E8%88%AC%E5%AE%B6%E5%B1%8B/config",
				// 	name: "global.YokohamaBaimo",
				// 	S3MLayer: true,
				// 	chooseType: false
				// },
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/Petroleum.jpg",
					// proxiedUrl: "http://www.supermapol.com/realspace/services/3D-BianDianZhan0614/rest/realspace", // old 太慢了
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-0725RVM/rest/realspace",
					name: "global.transformerStation",
					chooseType: false
				},
				// {
				// 	type: "REALSPACE",
				// 	thumbnail: "./images/addData/CBD.jpg",
				// 	proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
				// 	// proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-0523/rest/realspace',
				// 	name: "global.originCBD",
				// 	layers: [{ type: 'S3M', layerName: 'Building@CBD' }, { type: 'S3M', layerName: 'Tree@CBD' }, { type: 'S3M', layerName: 'Xiaopin@CBD' }, { type: 'S3M', layerName: 'Lake@CBD' }, { type: 'S3M', layerName: 'Ground@CBD' }, { type: 'S3M', layerName: 'Ground2@CBD' }, { type: 'S3M', layerName: 'Bridge@CBD' }],
				// 	chooseType: false
				// },
			],
			// 在线底图服务
			onlineBaseLayerList: [{
				url: './images/baseMap/baseImage.jpg',
				name: "global.LocalImage",
				thumbnail: './images/baseMap/locate.png',
				title: '本地图片',
				type: 'LocalImage',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 0
			},
			{
				url: '//dev.virtualearth.net/',
				name: "global.BingMap",
				thumbnail: './images/baseMap/BingMap.png',
				title: '必应底图',
				type: 'BingMap',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 1
			},
			{
				url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
				name: "global.TIANDITU",
				thumbnail: './images/baseMap/tianditu.png',
				title: '天地图',
				type: 'TIANDITU',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 2
			},
			// {
			// 	url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			// 	name: "global.OSM",
			// 	thumbnail: './images/baseMap/OSM.png',
			// 	title: 'OSM底图',
			// 	type: 'OSM',
			// 	imgsrc: '@/../static/css/cross.png',
			// 	subdomains: ["a", "b", "c", "d"],
			// 	chooseType: false,
			// 	isMultipleChoose: false,
			// 	index: 3
			// },
			{
				name: "global.GRIDIMAGERY",
				thumbnail: './images/baseMap/grad.png',
				title: '经纬底图',
				type: 'GRIDIMAGERY',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 4
			},
			{
				url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
				name: "global.japanStand",
				thumbnail: './images/baseMap/standard_jp.png',
				title: '日本地理院标准地图',
				type: 'UrlTemplateImageryProvider',
				type_ja:'japanStand',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 5
			},
			{
				url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
				name: "global.japanPale",
				thumbnail: './images/baseMap/tinge_jp.png',
				title: '日本地理院淡色地图',
				type: 'UrlTemplateImageryProvider',
				type_ja:'japanPale',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 6
			},
			// {
			// 	url: 'https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
			// 	name: "global.japanBlank",
			// 	thumbnail: './images/baseMap/grad.png',
			// 	title: '日本地理院白色地图',
			// 	type: 'UrlTemplateImageryProvider',
			// 	type_ja:'japanBlank',
			// 	imgsrc: '@/../static/css/cross.png',
			// 	chooseType: false,
			// 	isMultipleChoose: false,
			// 	index: 7
			// },
			{
				url: 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
				name: "global.japanImage",
				thumbnail: './images/baseMap/image_jp.png',
				title: '日本地理院影像图',
				type: 'UrlTemplateImageryProvider',
				type_ja:'japanImage',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 8
			}
			],
			// 在线地形
			onlineTerrainLayerList: [
				{
					proxiedUrl: 'https://maptiles.supermapol.com/iserver/services/3D-local3DCache-GlobalTIN30M/rest/realspace/datas/Global_TIN_30M',
					name: '超图在线地形',
					thumbnail: './images/terrainLayers/SuperMapOnline.png',
					title: "global.SuperMapOnlineTerrain",
					type: 'supermapOnlineTerrain',
					chooseType: false,
				},
				{
					proxiedUrl: '',
					name: '天地图地形',
					thumbnail: './images/terrainLayers/tianditu_terrain.png',
					title: "global.TiandituTerrain",
					type: 'tianDiTuTerrain',
					chooseType: false
				},
				{
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
					name: 'STK地形',
					thumbnail: './images/terrainLayers/STK_terrain.png',
					title: "global.STKTerrain",
					type: 'STKTerrain',
					chooseType: false
				}

			]
		},
		layerTreeData: [
			{
				key: "1",
				label: GlobalLang.s3mLayer,
				children: []
			},
			{
				key: "2",
				label: GlobalLang.imgLayer,
				children: []
			},
			{
				key: "3",
				label: GlobalLang.mvtLayer,
				children: []
			},
			{
				key: "4",
				label: GlobalLang.terrainLayer,
				children: []
			},
		],
		MVTLayerNameList: [], // 用来存储添加到场景中MVT图层的名称，在删除MVT图层时会用到
		SelectedOptions: { // 用来存储已添加到场景中的服务（名称）
			publicService: [],
			baseMap: [],
			onlineTerrain: [],
		},
		skyBoxShow: false,
		layerChangeCount: 0,
		s3mLayerSelectIndex: 0,
		layerQueryOptions: [],
		mapQueryOptions: [],
		mediaFeildOptions:{
			"img":{},
			"video":{}
		},
		sceneAttrState: {
			earthShow: true, //地球显隐
			shadow: true, //场景阴影
			sunShow: false, //太阳
			depthInspection: true,//深度检测
			atomsphereRender: true, //大气渲染
			fogEffect: false, //雾化效果
			cloudLayer: true,//云层
			skyBoxShow: false,//天空盒
			timeAxis: false,//时间轴
			displayFrame: false,//显示帧率

			showUnderground: false,// 显示地下
			surfaceTransparency: 1,//地表透明度
			
			brightness: 1,// 亮度
			contrast: 1,// 对比度
			hue: 0,// 色调
			saturation: 1,// 饱和度
		},
		particleOptions:{ //粒子特效保存
			fire:null,
			water:null,
			fireWork:null,
		},
		layerStyleOptions:{}, // 图层风格保存
		isDisplayBubble:false, // 是否显示弹窗
		wmtsLayerOption:{}
	}),
	getters: {
	},
	actions: {
		// 更新图层
		updateLayer(option: any) {
			switch (option.type) {
				case "s3m":
					this.layerTreeData[0].children = [];
					viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: string) => {
						this.layerTreeData[0].children.push({
							label: S3Mlayer.name,
							key: "1-" + String(index),
							type: "s3m",
							children: undefined,
							isShow: true
						});
						S3Mlayer.visible = true;
					});
					break;
				case "imagery":
					this.layerTreeData[1].children = [];
					viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
						let imageryLayerName = this.getImageryLayerName(imageryLayer);
						if (imageryLayerName === 'Unnamed') return;
						let flag = this.checkImageryRepeat(imageryLayerName);
						if (!flag) {
							this.layerTreeData[1].children.push({
								label: imageryLayerName,
								key: "2-" + String(index),
								type: "imagery",
								children: undefined,
								isShow: true
							});
							imageryLayer.show = true;
						}
					})
					break;
				case "mvt":
					this.layerTreeData[2].children = [];
					viewer.scene._vectorTileMaps._layerQueue.forEach((MVTlayer: any, index: string) => {
						this.layerTreeData[2].children.push({
							label: MVTlayer.name,
							key: '3-' + String(index),
							type: 'mvt',
							children: undefined,
							isShow: true
						});
						MVTlayer.show = true;
					});
					break;
				case "terrain":
					this.layerTreeData[3].children = [];
					// 地形只加一个
					if (viewer.terrainProvider.name) {
						this.layerTreeData[3].children.push({
							label: option.label,
							key: "4-0",
							type: "terrain",
							children: undefined,
							isShow: true
						});
					}
					break;
				default:
					break;
			}
			this.layerChangeCount++;

			// 专门处理地形
			let terrainLayerName = viewer.terrainProvider.name
			if (!terrainLayerName || ['超图在线地形', '天地图地形', 'STK地形'].indexOf(terrainLayerName) === -1) {
				this.layerServiceData.onlineTerrainLayerList.forEach((item: any) => {
					item.chooseType = false;
				});
			}
		},
		// 刷新图层
		refreshLayerTree() {
			this.layerTreeData = [
				{
					key: "1",
					label: GlobalLang.s3mLayer,
					children: []
				},
				{
					key: "2",
					label: GlobalLang.imgLayer,
					children: []
				},
				{
					key: "3",
					label: GlobalLang.mvtLayer,
					children: []
				},
				{
					key: "4",
					label: GlobalLang.terrainLayer,
					children: []
				},
			];

			// 刷新S3M图层
			viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: string) => {
				this.layerTreeData[0].children.push({
					label: S3Mlayer.name,
					key: "1-" + String(index),
					type: "s3m",
					children: undefined,
					isShow: true
				});
			});

			// 专门处理阴影
			if (this.sceneAttrState.shadow === true) {

				window.viewer.shadows = true;
				// UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
				window.viewer.pcss = true;
				window.viewer.shadowQuality = 0;
				//设置阴影的出现距离
				window.viewer.scene.shadowMap.maximumDistance = 2000;
				//设置阴影的浓度，值越高，阴影越淡
				window.viewer.shadowMap.darkness = 0.4
				//默认值是0.1，值越小越清晰
				window.viewer.shadowMap.penumbraRatio = 0.1

				let layers = window.viewer.scene.layers.layerQueue;
				for (var i = 0; i < layers.length; i++) {
					// 设置图层的阴影模式
					layers[i].shadowType = 2;
				}
			}

			// 刷新影像图层
			viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
				let imageryLayerName = this.getImageryLayerName(imageryLayer);
				if (imageryLayerName === 'Unnamed') return;
				this.layerTreeData[1].children.push({
					label: imageryLayerName,
					key: "2-" + String(index),
					type: "imagery",
					children: undefined,
					isShow: true
				});
			})

			// 刷新mvt图层
			viewer.scene._vectorTileMaps._layerQueue.forEach((MVTlayer: any, index: string) => {
				this.layerTreeData[2].children.push({
					label: MVTlayer.name,
					key: '3-' + String(index),
					type: 'mvt',
					children: undefined,
					isShow: true
				})
			});

			// 刷新地形图层
			let terrainLayerName = this.getTerrainLayerName();
			if (terrainLayerName != 'invisible') {
				this.layerTreeData[3].children.push({
					label: terrainLayerName,
					key: "4-0",
					type: "terrain",
					children: undefined,
					isShow: true
				});
			}
		},
		// 删除图层
		removeLayer(option: any) {
			switch (option.type) {
				case "s3m":
					this.layerTreeData[0].children.map((S3Mlayer: any, index: string) => {
						if (S3Mlayer.key == option.key) {
							this.layerTreeData[0].children.splice(index, 1);
							this.removePublicService(option.label);
						}
					})
					this.updateLayer({ type: "s3m" });
					break;
				case "imagery":
					this.layerTreeData[1].children.map((S3Mlayer: any, index: string) => {
						if (S3Mlayer.key == option.key) {
							let item = this.layerServiceData.onlineBaseLayerList.find((item: any) => item.title === option.label);
							if (item) {
								item.chooseType = false;
								let key = item.name;
								let delIndex = this.SelectedOptions.baseMap.indexOf(key);
								if (delIndex != -1) this.SelectedOptions.baseMap.splice(delIndex, 1);
							}
							this.layerTreeData[1].children.splice(index, 1);
						}
					})
					this.updateLayer({ type: "imagery" });
					break;
				case "mvt":
					this.layerTreeData[2].children.map((S3Mlayer: any, index: string) => {
						if (S3Mlayer.key == option.key) {
							this.layerTreeData[2].children.splice(index, 1);
							this.removePublicService(option.label);
						}
					})
					this.updateLayer({ type: "mvt" });
					break;
				case "terrain":
					this.layerTreeData[3].children = [];
					let item = this.layerServiceData.onlineTerrainLayerList.find((item: any) => item.title === option.label);
					if (item) item.chooseType = false;
					let index = this.SelectedOptions.onlineTerrain.indexOf(option.label);
					this.SelectedOptions.onlineTerrain.splice(index, 1);
					this.updateLayer({ type: "terrain" });
					break;
				default:
					break;
			}

			// this.updateLayer({ type: "refresh" });
		},
		// 专门用来处理公共服务场景项目的删除选中
		removePublicService(layerName: string) {
			let item: any;
			switch (layerName) {
				case "Config":
					item = this.layerServiceData.publicServiceList[1];
					break;
				case "BIMbuilding":
					item = this.layerServiceData.publicServiceList[3];
					break;
				case "POINTCLOUD23":
					item = this.layerServiceData.publicServiceList[4];
					break;
				case "JingJinMVT":
					item = this.layerServiceData.publicServiceList[5];
					break;
				case "重庆白模":
					item = this.layerServiceData.publicServiceList[6];
					break;
				case "横滨白模":
					item = this.layerServiceData.publicServiceList[7];
					break;
				default:
					break;
			}
			if (item) {
				item.chooseType = false;
				let delIndex = this.SelectedOptions.publicService.indexOf(item.name);
				if (delIndex != -1) this.SelectedOptions.publicService.splice(delIndex, 1);
			}

		},
		// 显隐图层
		isShowLayer(option: any) {
			switch (option.type) {
				case "s3m":
					this.layerTreeData[0].children.map((S3Mlayer: any, index: string) => {
						if (S3Mlayer.key == option.key) {
							S3Mlayer.isShow = !S3Mlayer.isShow;
						}
					})
					break;
				case "imagery":
					this.layerTreeData[1].children.map((imagerlayer: any, index: string) => {
						if (imagerlayer.key == option.key) {
							imagerlayer.isShow = !imagerlayer.isShow;
						}
					})
					break;
				case "mvt":
					this.layerTreeData[2].children.map((mvtlayer: any, index: string) => {
						if (mvtlayer.key == option.key) {
							mvtlayer.isShow = !mvtlayer.isShow;
						}
					})
					break;
				case "terrain":
					this.layerTreeData[3].children.map((terrainlayer: any, index: string) => {
						if (terrainlayer.key == option.key) {
							terrainlayer.isShow = !terrainlayer.isShow;
						}
					})
					break;
				default:
					break;
			}
		},
		//检查影像图层是否重复添加
		checkImageryRepeat(name: string) {
			let item = this.layerTreeData[1].children.find((item: any) => item.label === name);
			// if(item){
			// 	return true;
			// }else{
			// 	return false;
			// }

			return item ? true : false;
		},

		// 传入影像图层，获取并返回他在项目中的名称
		getImageryLayerName(imageryLayer: any) {
			let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;

			if (!imageUrl) return GlobalLang.lnglatMap;

			if (imageUrl.indexOf("earth-skin.jpg") != -1) {
				return GlobalLang.defaultImage;
			}

			// 项目底图
			let targetItem = this.layerServiceData.onlineBaseLayerList.find((item: any) => item.url === imageUrl)
			if (targetItem) {
				if(targetItem.type_ja){
					return GlobalLang[targetItem.type_ja];
				}else{
					return GlobalLang[targetItem.type];
				}
			} 

			if (imageUrl && imageUrl.indexOf("realspace/datas/") != -1) {
				let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
				return otherImageLayerName;
			}
		
			// 网络底图
			if (imageryLayer._imageryProvider.tablename) {
				let tableName = imageryLayer._imageryProvider.tablename;
				if (tableName.indexOf('http') === -1) {
					if (tableName.indexOf('%') != -1) {
						let newName = tableName.split('%')[0];
						return newName;
					}
					// 支持地图服务
					if(tableName.indexOf('/maps/') != -1) {
						let newName = tableName.split('/maps/')[1].replace('/', '');
						return newName;
					}
					return tableName;
				} else {
					return 'Unnamed';
				}
			}else {
				return 'Unnamed';
			}
		},
		// 获取地形图层名称
		getTerrainLayerName(): any {
			if (window.viewer.terrainProvider._baseUrl) {
				let baseUrl = window.viewer.terrainProvider._baseUrl
				if (baseUrl.indexOf('3D-stk_terrain') != -1) {
					return GlobalLang.stkTerrain;
				} else {
					if (baseUrl.indexOf('supermapol.com') != -1) {
						return baseUrl.split('realspace/services/')[1].split('/rest/realspace')[0];
					} else if (baseUrl.indexOf('iserver/services') != -1) {
						return baseUrl.split('iserver/services/')[1].split('/rest/realspace')[0];
					}
					else {
						// return '未命名地形';
						return 'invisible';
					}
				}
			} else if (window.viewer.terrainProvider._urls) {
				let url0 = window.viewer.terrainProvider._urls[0]
				if (url0.indexOf('supermapol.com') != -1) {
					return GlobalLang.superMapTerrain;
				} else {
					return GlobalLang.tiandituTerrain;; // viewer.terrainProvider._urls[0].indexOf('tianditu') 看情况在加
				}
			} else {
				// return '标准椭球'
				// return '无地形';
				return 'invisible';
			}
		},

		// 更新已勾选选项
		updateSelectedOption(selectedOption: any) {
			console.log("selectedOption:", selectedOption);
			this.SelectedOptions = selectedOption;
			let publicServiceList = this.layerServiceData.publicServiceList;
			let onlineBaseLayerList = this.layerServiceData.onlineBaseLayerList;
			let onlineTerrainLayerList = this.layerServiceData.onlineTerrainLayerList;

			// this.layerServiceData.publicService.map()
			for (let i = 0; i < publicServiceList.length; i++) {
				let item = publicServiceList[i];
				if (selectedOption.publicService.indexOf(item.name) != -1) {
					publicServiceList[i].chooseType = true;
				}
			}

			for (let i = 0; i < onlineBaseLayerList.length; i++) {
				let item = onlineBaseLayerList[i];
				if (selectedOption.baseMap.indexOf(item.name) != -1) {
					onlineBaseLayerList[i].chooseType = true;
				}
			}

			for (let i = 0; i < onlineTerrainLayerList.length; i++) {
				let item = onlineTerrainLayerList[i];
				if (selectedOption.onlineTerrain.indexOf(item.name) != -1) {
					onlineTerrainLayerList[i].chooseType = true;
				}
			}

			console.log(" this.layerServiceData:", this.layerServiceData);
		},

		// 设置当前场景属性
		setSceneAttr(sceneAttrState: any) {
			// console.log("content.layers.sceneAttrState:", sceneAttrState);
			for (let key in sceneAttrState) {
				this.sceneAttrSwitch(key,sceneAttrState[key]);
			}
		},

		sceneAttrSwitch(key: string, value: boolean|number) {
			switch (key) {
				case "atomsphereRender":
					window.viewer.scene.skyAtmosphere.show = value;
					break;
				case "depthInspection":
					window.viewer.scene.globe.depthTestAgainstTerrain = value;
					break;
				case "displayFrame":
					window.viewer.scene.debugShowFramesPerSecond = value;
					break;
				case "earthShow":
					window.viewer.scene.globe.show = value;
					break;
				case "fogEffect":
					window.viewer.scene.fog.enabled = value;
					break;
				case "shadow":
					if (value) {
						window.viewer.shadows = true;
						// UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
						window.viewer.pcss = true;
						window.viewer.shadowQuality = 0;
						//设置阴影的出现距离
						window.viewer.scene.shadowMap.maximumDistance = 2000;
						//设置阴影的浓度，值越高，阴影越淡
						window.viewer.shadowMap.darkness = 0.4
						//默认值是0.1，值越小越清晰
						window.viewer.shadowMap.penumbraRatio = 0.1
					} else {
						window.viewer.shadows = false;
					}
					break;
				case "sunShow":
					window.viewer.scene.globe.enableLighting = value;
					break;
				case "timeAxis":
					let timeline = document.getElementsByClassName(
						"supermap3d-viewer-timelineContainer"
					)[0] as HTMLElement;
					if (value) {
						timeline.style.visibility = "visible";
						timeline.style['z-index'] = 99999999999;
					} else {
						timeline.style.visibility = "hidden";
					}
					break;
				case "brightness":
					window.viewer.scene.colorCorrection.show = true; // 场景颜色开关打开
					window.viewer.scene.colorCorrection.brightness = value;
					break;
				case "contrast":
					window.viewer.scene.colorCorrection.show = true; 
					window.viewer.scene.colorCorrection.contrast = value;
					break;
				case "hue":
					window.viewer.scene.colorCorrection.show = true; 
					window.viewer.scene.colorCorrection.hue = value;
					break;
				case "saturation":
					window.viewer.scene.colorCorrection.show = true; 
					window.viewer.scene.colorCorrection.saturation = value;
					break;
				case "surfaceTransparency":
					window.viewer.scene.globe.globeAlpha = value;
					break;
			};
		},

		// 设置场景特效 - 粒子系统
		setParticle(particleOptions) {
			if (particleOptions['fire'] != null) {
				let fireOption = particleOptions['fire'];
				this.addParticleFile(fireOption,'fire');
			}
			if (particleOptions['water'] != null) {
				let waterOption = particleOptions['water'];
				this.addParticleFile(waterOption,'water');
			}
			if (particleOptions['fireWork'] != null) {
				let fireWorkOption = particleOptions['fireWork'];
				this.addFireWork(fireWorkOption);
			}
		},
		// 添加场景中已保存的粒子
		addParticleFile(options:any,type:string) {
			let modelMatrix_fire = new SuperMap3D.Matrix4();
			SuperMap3D.Transforms.eastNorthUpToFixedFrame(options.particlePosition, undefined, modelMatrix_fire);
			this.loadParticleFile(options.particleUrl, modelMatrix_fire,type,options.particleAttr);
		},
		// 加载粒子文件
		loadParticleFile(url:string,modelMatrix:any,type:string, option?:any) {
			let particle: any = {};
			let scene = window.viewer.scene;
			SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
				particle = particleSystem;
				particle.modelMatrix = modelMatrix;
				// 设置参数
				if (option) {
					for (let key in option) {
						switch (key) {
							case "emitRate":
							  particle['emitRate'] = Number(option[key]);
							  break;
							case "minLifeTime":
							  particle['minLifeTime'] = Number(option[key]);
							  break;
							case "maxLifeTime":
							  particle['maxLifeTime'] = Number(option[key]);
							  break;
							case "minEmitPower":
							  particle['minEmitPower'] = Number(option[key]);
							  break;
							case "maxEmitPower":
							  particle['maxEmitPower'] = Number(option[key]);
							  break;
							case "minSize":
							  particle['minSize'] = Number(option[key]);
							  break;
							case "maxSize":
							  particle['maxSize'] = Number(option[key]);
							  break;
							case "minScaleX":
							  particle['minScaleX'] = Number(option[key]);
							  break;
							case "minScaleY":
							  particle['minScaleY'] = Number(option[key]);
							  break;
							case "maxScaleX":
							  particle['maxScaleX'] = Number(option[key]);
							  break;
							case "maxScaleY":
							  particle['maxScaleY'] = Number(option[key]);
							  break;
							case "gravity":
							  particle.gravity= new SuperMap3D.Cartesian3(0, 0, Number(option[key]));
							  break;
							case "emitType":
								switch (option[key]) {
									case "Cone":
										particle.createConeEmitter(1.0, 1.05);
										break;
									case "Sphere":
										particle.createSphereEmitter(1.0);
										break;
									case "Box":
										let direction1 = new SuperMap3D.Cartesian3(-1, 1, 1);
										let direction2 = new SuperMap3D.Cartesian3(1, 1, -1);
										let minBox = new SuperMap3D.Cartesian3(-10, 0, -10);
										let maxBox = new SuperMap3D.Cartesian3(10, 0, 10);
									  	particle.createBoxEmitter(direction1, direction2, minBox, maxBox);
									  	break;
								}
							  break;
							default:
							  break;
						  }
					}
				}

				window.EarthGlobal[type] = particle;
			});

		},
		// 添加烟花
		addFireWork(fireWorkOption){
			let modelMatrix = new SuperMap3D.Matrix4();
			let clickHandle, setIntervalList:any[] = [],particleSystemList:any[] = [];
			let scene = window.viewer.scene;
			scene.skyAtmosphere = new SuperMap3D.SkyAtmosphere();
			scene.globe.show = false
			scene.skyAtmosphere.show = false; //关闭大气
			
			let sparkOneUrl = './Resource/particle/babylon/sparkGravityOne.json';
			let sparkTwoUrl = './Resource/particle/babylon/sparkGravityTwo.json';
			let sparkThreeUrl = './Resource/particle/babylon/sparkGravityThree.json';
			let sparkFourUrl = './Resource/particle/babylon/sparkGravityFour.json';
			
			let numberOfSparks = 8;
			let xMin = -2100.0;
			let xMax = 300.0;
			let yMin = 0.0;
			let yMax = 2000.0;
			let zMin = 150.0;
			let zMax = 550.0;
			// 创建烟花
			let sparkInterval = (xMax - xMin) / numberOfSparks;
			
			function createSpark() {
			  for (let i = 0; i < numberOfSparks; ++i) {
				let x = SuperMap3D.Math.randomBetween(xMin + i * sparkInterval, xMin + (i + 1) * sparkInterval);
				let y = SuperMap3D.Math.randomBetween(yMin, yMax);
				let z = SuperMap3D.Math.randomBetween(zMin, zMax);
				let offset = new SuperMap3D.Cartesian3(x, y, z);
				let url = '';
				if (i % 4 === 0)
				  url = sparkOneUrl;
				if (i % 4 === 1)
				  url = sparkTwoUrl;
				if (i % 4 === 2)
				  url = sparkThreeUrl;
				if (i % 4 === 3)
				  url = sparkFourUrl;
				SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
				  settingParticleSys(particleSystem, offset, i);
				});
			  }
			}
			
			// 设置当前粒子系统
			function settingParticleSys(particleSystem, offset, index) {
			
			  // 添加多个
			  particleSystem.modelMatrix = modelMatrix;
			  particleSystem.worldOffset.x = offset.x;
			  particleSystem.worldOffset.y = offset.y;
			  particleSystem.worldOffset.z = offset.z;
			  let setIntervalFlag = setInterval(() => {
				particleSystem.start();
			  }, 2000 + index * 50);
			  scene.primitives.add(particleSystem);
			  setIntervalList.push(setIntervalFlag);
			  
			  window.EarthGlobal["fireWork"] = setIntervalList; 
			}
			
			function addSpark(centerPosition){
			  SuperMap3D.Transforms.eastNorthUpToFixedFrame(centerPosition, undefined, modelMatrix);
			  createSpark();
			}

			addSpark(fireWorkOption.fireWorkPosition);
		},
		
		removeParticle(){
			if(window.EarthGlobal["fire"]){
				window.viewer.scene.primitives.remove(window.EarthGlobal["fire"]);
			}
			if(window.EarthGlobal["water"]){
				window.viewer.scene.primitives.remove(window.EarthGlobal["fire"]);
			}
		},

		// 设置保存的图层属性
		setLayerStyle(layerStyleOptions){
			console.log("layerStyleOptions:",layerStyleOptions);
			let keys = Object.keys(layerStyleOptions);
			for(let i=0;i<keys.length;i++){
				let layerName = keys[i];
				let layerStyleOption = layerStyleOptions[layerName];
				let currentLayer = window.viewer.scene.layers.find(layerName);
				if(!currentLayer) return;
				for (let key in layerStyleOption) {
					let lineColor = layerStyleOption["lineColor"];
					this.layerStyleSwitch(currentLayer,key,layerStyleOption[key],lineColor);
				}
			}
		},

		layerStyleSwitch(currentLayer:any, key: string, value: string|number,lineColor:string) {
			switch (key) {
				case "foreColor":
					currentLayer.style3D.fillForeColor = SuperMap3D.Color.fromCssColorString(value);
					break;
				case "lineColor":
					currentLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(value);
					break;
				case "selectedColor":
					currentLayer.selectedColor = SuperMap3D.Color.fromCssColorString(value);
					break;
				case "layerTrans":
					currentLayer.style3D.fillForeColor.alpha = Number(value);
					break;
				case "selectColorMode":
					currentLayer.selectColorType = value;
					break;
				case "bottomAltitude":
					currentLayer.style3D.bottomAltitude = Number(value);
					currentLayer.refresh();
					break;
				case "fillStyle":
					if (currentLayer) {
						switch (value) {
							case 0:
								currentLayer.style3D.fillStyle = SuperMap3D.FillStyle.Fill;
								break;
							case 1:
								currentLayer.style3D.fillStyle = SuperMap3D.FillStyle.WireFrame;
								currentLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(lineColor);
								break;
							case 2:
								currentLayer.style3D.fillStyle = SuperMap3D.FillStyle.Fill_And_WireFrame;
								currentLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(lineColor);
								break;
							default:
								break;
						}
						currentLayer.refresh();
					}
					break;
				default:
					break;
				}
		
		},

		// // 设置configtoken
		// setConfigToken(field:string,value:string){
		// }

		// 设置wmts服务
		setWmts(wmtsLayerOption){
			if(JSON.stringify(wmtsLayerOption) === '{}') return;
			let rectangle = wmtsLayerOption.rectangle;
			let wmtsLayer = viewer.imageryLayers.addImageryProvider(new SuperMap3D.WebMapTileServiceImageryProvider({
			  url: wmtsLayerOption.wmtsLayerUrl,
			  style: "default",
			  format: 'image/png',
			  layer: wmtsLayerOption.layerName,
			  tileMatrixSetID: wmtsLayerOption.tileMatrixSetID,
			  tilingScheme: new SuperMap3D.GeographicTilingScheme({
				rectangle: SuperMap3D.Rectangle.fromDegrees(rectangle[0], rectangle[1], rectangle[2], rectangle[3]),
				//ellipsoid: SuperMap3D.Ellipsoid.WGS84,
				//numberOfLevelZeroTilesX: 1,
				//numberOfLevelZeroTilesY: 1,
				scaleDenominators: wmtsLayerOption.scaleDenominatorsList,
				customDPI: new SuperMap3D.Cartesian2(90.7142857142857, 90.7142857142857),
			  }),
			}));
		
			// wmtsLayer.alpha = 0.5;
			viewer.flyTo(wmtsLayer);
		}
	}
})











