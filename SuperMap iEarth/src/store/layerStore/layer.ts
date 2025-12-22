import { defineStore } from 'pinia';
const layerServiceData = window.layerServiceData;
import { LayerEnum } from "@/enums/layerEnum";

export const useLayerStore = defineStore({
	id: 'useLayerManageStore',
	state: (): any => ({
		// 添加数据所用到的三类在线服务
		layerServiceData: layerServiceData,
		layerTreeData: [
			{
				key: "1",
				label: $t('s3mLayer'),
				type:'s3mRoot',
				children: []
			},
			{
				key: "2",
				label: $t('imgLayer'),
				type:'imgRoot',
				children: []
			},
			{
				key: "3",
				label: $t('mvtLayer'),
				type:'mvtRoot',
				children: []
			},
			{
				key: "4",
				label: $t('terrainLayer'),
				type:'tinRoot',
				children: []
			},
		]
	}),
	getters: {},
	actions: {
		// 更新图层
		updateLayer(option: any) {
			switch (option.type) {
				case "s3m":
					this.updateS3M();
					break;
				case "imagery":
					this.updateIMG();
					break;
				case "mvt":
					this.updateMVT();
					break;
				case "terrain":
					this.updateTIN();
					break;
				default:
					break;
			}
		},

		// 对S3M图层列表进行扁平化处理:方便遍历_layerQueue时做处理
		flattenS3MCollections(s3mOptionList){
			let s3mOptionList_flatten:any = [];
			// 校验当前s3m图层同时扁平化数组
			s3mOptionList.forEach((collection,index_c)=>{
				collection.parent = this.layerTreeData[0];
				if(collection.type == LayerEnum.Collection){
					collection.children.forEach((group,index_g)=>{
						group.parent = collection;
						if(group.type == LayerEnum.Group){
							group.children.forEach((child,index)=>{
								if(child.type == LayerEnum.S3M){
									let layerName = child.id;
									let layer = viewer.scene.layers.find(layerName);
									if(layer){
										child.parent = group; // 绑定父节点
										child.layer = layer;
										child.isShow = layer.visible || layer._visible;
										s3mOptionList_flatten.push(child);
									}else{
										// 当网络较慢时，图层未加载完成，此时打开图层树组件，再遍历时会出现删除option的情况，隐藏这里不做剔除，只做打印
										// group.splice(index,1); // 该item绑定的layer场景中已经找不到了，需要剔除
										console.log('该图层场景中未能找到:',child);
									}
								}
							})
						}else if(group.type == LayerEnum.S3M){
							let child = group;
							let layer = viewer.scene.layers.find(child.id);
							if(layer){
								child.parent = collection; // 绑定父节点
								child.layer = layer;
								child.isShow = layer.visible || layer._visible;
								s3mOptionList_flatten.push(child);
							}else{
								// s3mOptionList.splice(index_g,1); 
								console.log('该图层场景中未能找到:',child);
							}
						}
					})
				}else if(collection.type == LayerEnum.Group){
					let group = collection;
					group.children.forEach((child,index)=>{
						if(child.type == LayerEnum.S3M){
							let layer = viewer.scene.layers.find(child.id);
							if(layer){
								child.parent = group; // 绑定父节点
								child.layer = layer;
								child.isShow = layer.visible || layer._visible;
								s3mOptionList_flatten.push(child);
							}else{
								// group.splice(index,1); 
								console.log('该图层场景中未能找到:',child);
							}
						}
					})
				}else if(collection.type == LayerEnum.S3M){
					let child = collection;
					let layer = viewer.scene.layers.find(child.id);
					if(layer){
						child.layer = layer;
						child.isShow = layer.visible || layer._visible;
						s3mOptionList_flatten.push(child);
					}else{
						// s3mOptionList.splice(index_c,1); 
						console.log('该图层场景中未能找到:',child);
					}
				}
			})

			return s3mOptionList_flatten
		},

		updateS3M(){
			let s3mOptionList = this.layerTreeData[0].children;

			// 扁平化集合
			let s3mOptionList_flatten:any = this.flattenS3MCollections(s3mOptionList);
			// console.log("s3mOptionList_flatten:",s3mOptionList_flatten);
			
			for(let i=0; i<viewer.scene.layers._layerQueue.length; i++){
				let S3Mlayer = viewer.scene.layers._layerQueue[i];

				// 只对不存在于图层列表中的图层做处理
				let target = s3mOptionList_flatten.find(item => item.id == S3Mlayer.name);
				if(!target) {
					if(!S3Mlayer.customName) S3Mlayer.customName = S3Mlayer.name;
					let obj = {
						label: S3Mlayer.customName,
						id: S3Mlayer.name,
						key: "1-" + String(i),
						type: "s3m",
						children: undefined,
						isShow: S3Mlayer.visible || S3Mlayer._visible, // 图层列表的显隐图标与图层相绑定
						layer:S3Mlayer,
					};
					s3mOptionList.push(obj);
				}
			}

			// 重新计算索引key值,避免拖拽时出现问题
			s3mOptionList.forEach((collection,index_c)=>{
				collection.key = `1-${index_c}`;
				if(collection.children && collection.children.length>0){
					collection.children.forEach((group,index_g) => {
						group.key = `${collection.key}-${index_g}`;
						if(group.children && group.children.length>0){
							group.children.forEach((child,index) => {
								child.key = `${group.key}-${index}`;
							})
						}
					});
				}
			})

			// console.log("s3mOptionList:",s3mOptionList);

			window.layerTreeData = this.layerTreeData;
		},

		updateIMG() {
			this.layerTreeData[1].children = [];
			viewer.imageryLayers._layers.forEach((imageryLayer: any, index: string) => {
				let imageryLayerName = this.getImageryLayerName(imageryLayer);
				if (!imageryLayerName) return;
				if(!imageryLayer.customName) imageryLayer.customName = imageryLayerName;
				this.layerTreeData[1].children.unshift({
					label: imageryLayer.customName,
					id: imageryLayerName,
					key: "2-" + String(index),
					type: "imagery",
					children: undefined,
					isShow: imageryLayer.show || imageryLayer._show,
					layer: imageryLayer
				});
			})
		},

		updateMVT(){
			this.layerTreeData[2].children = [];

			// 基于mvtMap计算图层列表
			// viewer.scene._vectorTileMaps._layerQueue.forEach((MVTlayer: any, index: string) => {
			// 	if(!MVTlayer.customName) MVTlayer.customName = MVTlayer.name;
			// 	this.layerTreeData[2].children.push({
			// 		label: MVTlayer.customName,
			// 		id: MVTlayer.name,
			// 		key: '3-' + String(index),
			// 		type: 'mvt',
			// 		children: undefined,
			// 		isShow: MVTlayer.show || MVTlayer._show,
			// 		layer:MVTlayer
			// 	});
			// });

			// 基于mapboxStyle子图层计算图层列表
			const mvtMapFirst = viewer.scene._vectorTileMaps._layerQueue[0];
			if(mvtMapFirst && mvtMapFirst.mapboxStyle && mvtMapFirst.mapboxStyle.layers.length>0){ // MVT底层styleLayer共用,所以只需要第一个MVT图层即可获取所有的子图层
				mvtMapFirst.mapboxStyle.layers.forEach((styleLayer: any, index: string) => {
					if(styleLayer.source){
						if(!styleLayer.customName) styleLayer.customName = styleLayer.id;

						// 计算显隐
						const visibleValue = mvtMapFirst.getLayoutProperty(styleLayer.id, 'visibility');
						let mvtLayerVisible = visibleValue == "visible" ? true : false ; // 返回值：undefined visible none
						if(visibleValue == undefined) mvtLayerVisible = true; // 第一次获取值为undefined

						this.layerTreeData[2].children.push({
							label: styleLayer.customName,
							id: styleLayer.id,
							key: '3-' + String(index),
							type: 'mvt',
							children: undefined,
							isShow: mvtLayerVisible,
							layer: styleLayer,
							source: styleLayer.source,
						});
					}
				});
			}

		},

		updateTIN(){
			this.layerTreeData[3].children = [];
			let terrainLayerName = this.getTerrainLayerName();
			if (!terrainLayerName) return;
			if(!viewer.terrainProvider.customName) viewer.terrainProvider.customName = terrainLayerName;
			this.layerTreeData[3].children.push({
				label: viewer.terrainProvider.customName,
				id: terrainLayerName,
				key: "4-0",
				type: "terrain",
				children: undefined,
				isShow: (viewer.terrainProvider._baseUrl || viewer.terrainProvider._urls) ? true : false,
				layer: viewer.terrainProvider
			});
		},



		// 传入影像图层，获取并返回他在项目中的名称
		getImageryLayerName(imageryLayer: any) {
			// if(imageryLayer.name && (typeof imageryLayer.name === 'string') && imageryLayer.name.length>0) return imageryLayer.name;
			let imageryProvider = imageryLayer.imageryProvider || imageryLayer._imageryProvider;
			if (!imageryProvider) return;

			let imageUrl = imageryProvider.url || imageryProvider._url || imageryProvider._baseUrl || imageryProvider.tablename;

			if (imageUrl && imageUrl.indexOf("earth-skin2.jpg") != -1) {
				return $t('defaultImage');
			}

			// 项目底图
			let targetItem = this.layerServiceData.onlineBaseLayerList.find((item: any) => item.url === imageUrl)
			if (targetItem) {
				if (targetItem.name) {
					return $t(targetItem.name);
				} else {
					return $t(targetItem.type);
				}
			}

			// 基于imageryProvider类型计算影像图层名称
			if (imageryProvider instanceof SuperMap3D.SuperMapImageryProvider) {
				let imgLayerUrl = imageryProvider.url || imageryProvider._url || imageryProvider._baseUrl;
				if(imgLayerUrl.includes('/rest/')){
					let prefix = imgLayerUrl.split('/rest/')[0];
					return prefix.split('/').pop();
				}else if(imgLayerUrl.includes('/services/')){
					let suffix = imgLayerUrl.split('/services/')[1];
					return suffix.split('/')[0];
				}else{
					return imgLayerUrl;
				}
			} else if (imageryProvider instanceof SuperMap3D.CGCS2000MapServerImageryProvider) {
				let imgLayerUrl = imageryProvider._baseUrl || imageryProvider.url;
				if(imgLayerUrl.includes('/MapServer')){
					let prefix = imgLayerUrl.split('/MapServer')[0];
					if (prefix.includes('/')) {
						return prefix.split('/').pop();
					}
				}else{
					return imgLayerUrl;
				}
			} else if (imageryProvider instanceof SuperMap3D.BingMapsImageryProvider) {
				return $t('BingMap');
			} else if (imageryProvider instanceof SuperMap3D.TiandituImageryProvider) {
				return $t('TIANDITU');
			} else if (imageryProvider instanceof SuperMap3D.UrlTemplateImageryProvider) {
				let imgLayerUrl = imageryProvider.url || imageryProvider._url || imageryProvider.tablename;
				// 高德地图
				if(imgLayerUrl.includes('autonavi.com')) {
					return $t('gaodeMap');
				}
				return imgLayerUrl; // TODO:精细化处理
			} else if (imageryProvider instanceof SuperMap3D.SingleTileImageryProvider) {
				let imgLayerUrl = imageryProvider.url || imageryProvider._url;
				if(imgLayerUrl.includes('Assets/Textures/GlobalBkLayer.jpg')){
					return $t('defaultImage');
				}else if(imgLayerUrl.includes('baseImage.jpg')){
					return $t('LocalImage');
				}else{
					if(imgLayerUrl.includes('/')){
						return imgLayerUrl.split('/').pop();
					}else{
						return imgLayerUrl;
					}
				}
			} else if (imageryProvider instanceof SuperMap3D.TileCoordinatesImageryProvider) {
				return $t('lnglatMap')
			}

			if(window.iEarthConsole) console.log('未能通过imageryProvider类型计算出影像图层名称,使用之前的代码计算');

			if (!imageUrl) return $t('lnglatMap');

			if (imageUrl && imageUrl.indexOf("realspace/datas/") != -1) {
				let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
				return otherImageLayerName;
			}

			// 网络底图
			if (imageryLayer._imageryProvider.tablename) {
				let tableName = imageryLayer._imageryProvider.tablename;
				if (tableName.indexOf('http') === -1) {
					if (tableName.indexOf('/rest/maps/') != -1) {
						let name = tableName.split('/rest/maps/')[1];
						if (name.indexOf('%') != -1) {
							let str = decodeURIComponent(name);
							if (str.indexOf('@')) {
								let newName = str.split('@')[0];
								return newName;
							}
						} else {
							return name;
						}
					}
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
					return;
				}
			} else {
				return;
			}
		},

		// 获取地形图层名称
		getTerrainLayerName(): any {
			let terrainProvider = window.viewer.terrainProvider;

			// 基于terrainProvider类型计算地形图层名称
			if(terrainProvider instanceof SuperMap3D.SuperMapTerrainProvider){
				let terrainUrl = terrainProvider.baseUrl || terrainProvider._baseUrl;
				if(terrainUrl){
					if(terrainUrl.includes("3D-stk_terrain")){
						return $t("STKTerrain");
					}else if(terrainUrl.includes('/datas/')){
						return terrainUrl.split('/datas/').pop();
					}else if(terrainUrl.includes('/rest/')){
						let prefix = terrainUrl.split('/rest/')[0];
						return prefix.split('/').pop();
					}else if(terrainUrl.includes('/services/')){
						let suffix = terrainUrl.split('/services/')[1];
						return suffix.split('/')[0];
					}else{
						return terrainUrl;
					}
				}
			}else if(terrainProvider instanceof SuperMap3D.SCTTerrainProvider){
				if(terrainProvider._urls && terrainProvider._urls.length>0){
					const url = terrainProvider._urls[0];
					if(url && url.includes("3D-local3DCache-GlobalTIN30M")) {
						return $t("SuperMapOnlineTerrain");
					}
				}
			}

			if(window.iEarthConsole) console.log('未能通过terrainProvider类型计算出地形图层名称,使用之前的代码计算');

			if (terrainProvider._baseUrl) {
				let baseUrl = terrainProvider._baseUrl
				if (baseUrl.indexOf('3D-stk_terrain') != -1) {
					return $t('stkTerrain');
				} else {
					if (baseUrl.includes('info/data/path')) { // STK地形
						return baseUrl.split('/services/')[1].split('/rest/')[0];
					} else if (baseUrl.includes('/realspace/datas/')) { // 普通的TIN地形
						return baseUrl.split('/realspace/datas/')[1];
					} else if (baseUrl.indexOf('supermapol.com') != -1) { // 之前遗留的
						return baseUrl.split('realspace/services/')[1].split('/rest/realspace')[0];
					} else if (baseUrl.indexOf('iserver/services') != -1) { // 之前遗留的
						return baseUrl.split('iserver/services/')[1].split('/rest/realspace')[0];
					} else {
						return;
					}
				}
			} else if (terrainProvider._urls) {
				let url = terrainProvider._urls[0]
				if (url.indexOf('supermapol.com') != -1) {
					return $t('superMapTerrain');
				} else {
					return $t('tiandituTerrain');
				}
			} else {
				return;
			}
		}
	}
})