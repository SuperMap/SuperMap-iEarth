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
					proxiedUrl: 'http://www.supermapol.com/realspace/services/3D-0523/rest/realspace',
					name: "北京CBD",
					layers: [{ type: 'S3M', layerName: 'Building@CBD' }, { type: 'S3M', layerName: 'Tree@CBD' }, { type: 'S3M', layerName: 'Xiaopin@CBD' }, { type: 'S3M', layerName: 'Lake@CBD' }, { type: 'S3M', layerName: 'Ground@CBD' }, { type: 'S3M', layerName: 'Ground2@CBD' }, { type: 'S3M', layerName: 'Bridge@CBD' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/Sophia.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace",
					name: "索菲亚教堂",
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/ZfTerranAndImagery.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace",
					name: "珠峰地形影像",
					layers: [{ type: 'IMG', layerName: 'image' }, { type: 'TERRAIN', layerName: 'srtm_54_07%40zhufeng' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/BIM.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-wireFrame/rest/realspace",
					name: "BIM建筑",
					layers: [{ type: 'S3M', layerName: "wireFrame" }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/PointCloud.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-cloud/rest/realspace",
					name: "点云",
					layers: [{ type: 'S3M', layerName: 'POINTCLOUD23' }],
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/Histogram.jpg",
					proxiedUrl: " https://www.supermapol.com/realspace/services/3D-Histogram/rest/realspace",
					name: "柱状图",
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/Household.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-QingXieSheYingMoXing/rest/realspace",
					name: "倾斜影像",
					layers: [{ type: 'S3M', layerName: 'qingxie' }],
					chooseType: false
				},

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
					name: "京津地区MVT",
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
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-CQmodel_wireframe_2000/rest/realspace/datas/CQmodel/config",
					name: "重庆白模",
					S3MLayer: true,
					chooseType: false
				},
				{
					type: "ThematicMap",
					thumbnail: "./images/addData/hbbm.jpg",
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-XinBaiMo-2/rest/realspace/datas/%E4%B8%80%E8%88%AC%E5%AE%B6%E5%B1%8B/config",
					name: "横滨白模",
					S3MLayer: true,
					chooseType: false
				},
				{
					type: "REALSPACE",
					thumbnail: "./images/addData/BDZ.jpg",
					proxiedUrl: "http://www.supermapol.com/realspace/services/3D-BianDianZhan0614/rest/realspace",
					name: "变电站",
					chooseType: false
				},
			],
			// 在线底图服务
			onlineBaseLayerList: [{
				url: './images/baseLayers/baseImage.png',
				name: '本地图片',
				thumbnail: './images/baseLayers/image.jpg',
				title: '本地图片',
				type: 'IMAGE',
				imgsrc: '@/../static/css/cross.png',
				chooseType: false,
				isMultipleChoose: false,
				index: 0
			},
			{
				url: '//dev.virtualearth.net/',
				name: '必应底图',
				thumbnail: './images/baseLayers/BingMap.jpg',
				title: '必应底图',
				type: 'BINGMAP',
				imgsrc: '@/../static/css/cross.png',
				key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
				chooseType: false,
				isMultipleChoose: false,
				index: 1
			},
			{
				url: 'https://[subdomain].tianditu.gov.cn/img_w/wmts',
				name: '天地图',
				thumbnail: './images/baseLayers/tianditu.jpg',
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
				name: 'OSM底图',
				thumbnail: './images/baseLayers/OSM.jpg',
				title: 'OSM底图',
				type: 'OSM',
				imgsrc: '@/../static/css/cross.png',
				subdomains: ["a", "b", "c", "d"],
				chooseType: false,
				isMultipleChoose: false,
				index: 3
			},
			{
				name: '经纬底图',
				thumbnail: './images/baseLayers/grad.jpg',
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
					title: '超图在线地形',
					type: 'supermapOnlineTerrain',
					chooseType: false,
				},
				{
					proxiedUrl: '',
					name: '天地图地形',
					thumbnail: './images/terrainLayers/tianditu_terrain.png',
					title: '天地图地形',
					type: 'tianDiTuTerrain',
					chooseType: false
				},
				{
					proxiedUrl: "https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path",
					name: 'STK地形',
					thumbnail: './images/terrainLayers/STK_terrain.png',
					title: 'STK地形',
					type: 'STKTerrain',
					chooseType: false
				}

			]
		},
		layerTreeData: [
			{
				key: "1",
				label: "S3M图层",
				children: []
			},
			{
				key: "2",
				label: "影像图层",
				children: []
			},
			{
				key: "3",
				label: "MVT图层",
				children: []
			},
			{
				key: "4",
				label: "地形图层",
				children: []
			},
		],
		MVTLayerNameList: [], // 用来存储添加到场景中MVT图层的名称，在删除MVT图层时会用到
		SelectedOptions:{ // 用来存储已添加到场景中的服务（名称）
			publicService:[],
			baseMap:[],
			onlineTerrain:[],
		},
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
					});
					break;
				case "imagery":
					this.layerTreeData[1].children = [];
					viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
						let imageryLayerName = this.getImageryLayerName(imageryLayer);
						// console.log("imageryLayerName：",imageryLayerName);
						// console.log("this.layerTreeData[1].children",this.layerTreeData[1].children);
						let flag = this.checkImageryRepeat(imageryLayerName);
						console.log("flag-update",flag);
						if(!flag){
							this.layerTreeData[1].children.push({
								label: imageryLayerName,
								key: "2-" + String(index),
								type: "imagery",
								children: undefined,
								isShow: true
							});
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
						})
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
		},
		// 刷新图层
		refreshLayerTree(){
			this.layerTreeData = [
				{
					key: "1",
					label: "S3M图层",
					children: []
				},
				{
					key: "2",
					label: "影像图层",
					children: []
				},
				{
					key: "3",
					label: "MVT图层",
					children: []
				},
				{
					key: "4",
					label: "地形图层",
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
						}
					})
					this.updateLayer({ type: "s3m" });
					break;
				case "imagery":
					this.layerTreeData[1].children.map((S3Mlayer: any, index: string) => {

						if (S3Mlayer.key == option.key) {
							let item = this.layerServiceData.onlineBaseLayerList.find((item: any) => item.title === option.label);
							item.chooseType = false;
							this.layerTreeData[1].children.splice(index, 1);
						}
					})
					// console.log("option:",option);
					let delIndex = this.SelectedOptions.baseMap.indexOf(option.label);
					this.SelectedOptions.baseMap.splice(delIndex,1);
					// console.log("this.SelectedOptions:",this.SelectedOptions);
					this.updateLayer({ type: "imagery" });
					break;
				case "mvt":
					this.layerTreeData[2].children.map((S3Mlayer: any, index: string) => {
						if (S3Mlayer.key == option.key) {
							this.layerTreeData[2].children.splice(index, 1);
						}
					})
					// console.log("option:",option);
					this.updateLayer({ type: "mvt" });
					break;
				case "terrain":
					this.layerTreeData[3].children = [];
					// console.log("option：",option)
					let item = this.layerServiceData.onlineTerrainLayerList.find((item: any) => item.title === option.label);
					item.chooseType = false;
					let index = this.SelectedOptions.onlineTerrain.indexOf(option.label);
					this.SelectedOptions.onlineTerrain.splice(index,1);
					// console.log("this.SelectedOptions:",this.SelectedOptions);
					this.updateLayer({ type: "terrain" });
					break;
				default:
					break;
			}

			// this.updateLayer({ type: "refresh" });
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
			// let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;
			// // if (!imageUrl) return window.LangGlobal.global.lnglatMap;
			// if (imageUrl.indexOf("earth-skin.jpg") != -1) {
			// 	return "默认影像"
			// }
			// let targetItem = this.layerServiceData.onlineBaseLayerList.find((item: any) => item.url === imageUrl)
			// if (targetItem) {
			// 	return targetItem.name;
			// } else if (imageUrl) {
			// 	if (imageUrl.indexOf("realspace/datas/") != -1) {
			// 		let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
			// 		return otherImageLayerName;
			// 	} else {
			// 		// return window.LangGlobal.global.unnamedLayer;
			// 	}
			// } else {
			// 	// return window.LangGlobal.global.unnamedLayer;
			// }

			let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;

			if(!imageUrl) return '经纬底图';
		
			if(imageUrl.indexOf("earth-skin.jpg")!=-1){
				return '默认影像';
			}
		
			let targetItem = this.layerServiceData.onlineBaseLayerList.find((item: any) => item.url === imageUrl)
			if (targetItem) {
				return targetItem.name;
			}else if(imageUrl){
			//    let otherImageLayerName = imageUrl.split('realspace/services/')[1].split('/rest/realspace')[0]
		
				if(imageUrl.indexOf("realspace/datas/")!=-1){
					let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
					return otherImageLayerName;
				}else{
					return '未命名图层';
				}
			}else{
				return '未命名图层';
			}
		},
		// 获取地形图层名称
		getTerrainLayerName(): any {
			if (window.viewer.terrainProvider._baseUrl) {
				let baseUrl = window.viewer.terrainProvider._baseUrl
				if (baseUrl.indexOf('3D-stk_terrain') != -1) {
					return 'STK地形';
				} else {
					if (baseUrl.indexOf('supermapol.com') != -1) {
						return baseUrl.split('realspace/services/')[1].split('/rest/realspace')[0]
					} else {
						// return '未命名地形';
						return 'invisible';
					}
				}
			} else if (window.viewer.terrainProvider._urls) {
				let url0 = window.viewer.terrainProvider._urls[0]
				if (url0.indexOf('supermapol.com') != -1) {
					return 'SuperMapOnline 地形';
				} else {
					return '天地图地形'; // viewer.terrainProvider._urls[0].indexOf('tianditu') 看情况在加
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











