import { isTemplateNode } from '@vue/compiler-core';
import { update } from 'lodash';
// import layerManagement from "@/tools/layerManagement";
import { defineStore } from 'pinia'


export const useLayerStore = defineStore({
	id: 'useLayerManageStore',
	state: (): any => ({
		layerServiceData: {
			// 公共服务
			publicServiceList: [
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/CBD.jpg",
					// proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
					proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-0523/rest/realspace',
					name: "global.BeijingCBD",
					layers: [{ type: 'S3M', layerName: 'Building@CBD' }, { type: 'S3M', layerName: 'Tree@CBD' }, { type: 'S3M', layerName: 'Xiaopin@CBD' }, { type: 'S3M', layerName: 'Lake@CBD' }, { type: 'S3M', layerName: 'Ground@CBD' }, { type: 'S3M', layerName: 'Ground2@CBD' }, { type: 'S3M', layerName: 'Bridge@CBD' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/Sophia.jpg",
					proxiedUrl: "http://www.supermapol.com/realspace/services/3D-suofeiya_church-2/rest/realspace",
					name: "global.SophiaChurch",
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/ZfTerranAndImagery.jpg",
					proxiedUrl: "http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
					name: "global.MountEverest",
					layers: [{ type: 'IMG', layerName: 'image' }, { type: 'TERRAIN', layerName: 'srtm_54_07%40zhufeng' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/BIM.jpg",
					// proxiedUrl: "http://www.supermapol.com/realspace/services/3D-wireFrame-2/rest/realspace",
					proxiedUrl: "http://www.supermapol.com/realspace/services/3D-BIMbuilding-2/rest/realspace",
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
					proxiedUrl: "http://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE",
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
					proxiedUrl: "http://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000-2/rest/realspace/datas/wireFrame/config",
					name: "global.ChongqingBaimo",
					S3MLayer: true,
					chooseType: false
				},
				{
					type: "ThematicMap",
					thumbnail: "./images/addData/hbbm.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-XinBaiMo-2/rest/realspace/datas/%E4%B8%80%E8%88%AC%E5%AE%B6%E5%B1%8B/config",
					name: "global.YokohamaBaimo",
					S3MLayer: true,
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/BDZ.jpg",
					proxiedUrl: "http://www.supermapol.com/realspace/services/3D-BianDianZhan0614/rest/realspace",
					name: "global.transformerStation",
					chooseType: false
				},
				// {
				// 	type: "REALSPACE",
				// 	thumbnail: "./images/addData/CBD.jpg",
				// 	proxiedUrl: 'https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace',
				// 	// proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-0523/rest/realspace',
				// 	name: "global.BeijingCBD",
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
				key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
				chooseType: false,
				isMultipleChoose: false,
				index: 1
			},
			{
				url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
				name: "global.TIANDITU",
				thumbnail: './images/baseMap/tianditu.png',
				token: '7933ae29d47bcf1440889ad983dbe0af',
				title: '天地图',
				type: 'TIANDITU',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 2
			},
			{
				url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
				name: "global.OSM",
				thumbnail: './images/baseMap/OSM.png',
				title: 'OSM底图',
				type: 'OSM',
				imgsrc: '@/../static/css/cross.png',
				subdomains: ["a", "b", "c", "d"],
				chooseType: false,
				isMultipleChoose: false,
				index: 3
			},
			{
				name: "global.GRIDIMAGERY",
				thumbnail: './images/baseMap/grad.png',
				title: '经纬底图',
				type: 'GRIDIMAGERY',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 4
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
		SelectedOptions:{ // 用来存储已添加到场景中的服务（名称）
			publicService:[],
			baseMap:[],
			onlineTerrain:[],
		},
		skyBoxShow:false,
		layerChangeCount:0,
		s3mLayerSelectIndex:0,
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
						// console.log("imageryLayerName：",imageryLayerName);
						// console.log("this.layerTreeData[1].children",this.layerTreeData[1].children);
						if(imageryLayerName === 'Unnamed') return;
						let flag = this.checkImageryRepeat(imageryLayerName);
						// console.log("flag-update",flag);
						if(!flag){
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
					if(viewer.terrainProvider.name){
						this.layerTreeData[3].children.push({
							label: option.label,
							key: "2-0",
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
			if(!terrainLayerName || ['超图在线地形','天地图地形','STK地形'].indexOf(terrainLayerName) === -1){
				this.layerServiceData.onlineTerrainLayerList.forEach((item:any) => {
					item.chooseType = false;
				});
			}
		},
		// 刷新图层
		refreshLayerTree(){
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

			// 刷新影像图层
			viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
				let imageryLayerName = this.getImageryLayerName(imageryLayer);
				if(imageryLayerName === 'Unnamed') return;
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
			if(terrainLayerName!='invisible'){
				this.layerTreeData[3].children.push({
					label: terrainLayerName,
					key: "2-0",
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
							if(item){
								item.chooseType = false;
								let key = item.name;
								let delIndex = this.SelectedOptions.baseMap.indexOf(key);
								if(delIndex != -1) this.SelectedOptions.baseMap.splice(delIndex,1);
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
					if(item) item.chooseType = false;
					let index = this.SelectedOptions.onlineTerrain.indexOf(option.label);
					this.SelectedOptions.onlineTerrain.splice(index,1);
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
		checkImageryRepeat(name:string){
			let item = this.layerTreeData[1].children.find((item: any) => item.label === name);
			// if(item){
			// 	return true;
			// }else{
			// 	return false;
			// }

			return item ? true :false;
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
				return GlobalLang[targetItem.type];
			} else if (imageUrl) {
				if (imageUrl.indexOf("realspace/datas/") != -1) {
					let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
					return otherImageLayerName;
				} else {
					return 'Unnamed';
				}
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
					if (tableName.indexOf('/maps/') != -1) {
						let newName = tableName.split('/maps/')[1].replace('/', '');
						return newName;
					}
					return tableName;
				} else {
					return 'Unnamed';
				}
			} else {
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
		updateSelectedOption(selectedOption:any){
			console.log("selectedOption:",selectedOption);
			this.SelectedOptions = selectedOption;
			let publicServiceList = this.layerServiceData.publicServiceList;
			let onlineBaseLayerList = this.layerServiceData.onlineBaseLayerList;
			let onlineTerrainLayerList = this.layerServiceData.onlineTerrainLayerList;

			// this.layerServiceData.publicService.map()
			for(let i=0;i<publicServiceList.length;i++){
				let item = publicServiceList[i];
				if(selectedOption.publicService.indexOf(item.name) != -1){
					publicServiceList[i].chooseType = true;
				}
			}

			for(let i=0;i<onlineBaseLayerList.length;i++){
				let item = onlineBaseLayerList[i];
				if(selectedOption.baseMap.indexOf(item.name) != -1){
					onlineBaseLayerList[i].chooseType = true;
				}
			}

			for(let i=0;i<onlineTerrainLayerList.length;i++){
				let item = onlineTerrainLayerList[i];
				if(selectedOption.onlineTerrain.indexOf(item.name) != -1){
					onlineTerrainLayerList[i].chooseType = true;
				}
			}

			console.log(" this.layerServiceData:", this.layerServiceData);
		}
	}

})











