define([],function(){
	var SORT_NUM = 1;
	var Config = {
			TitleKeyMap : {
				'text' : '矢量（全国省份）',
				'Line' : '矢量（全国省份）',
				'专题图' : '矢量（全国省份）',
				'Tree@新CBD' : 'CBD',
				'Ground_2@新CBD' : 'CBD',
				'Ground_1@新CBD' : 'CBD',
				'Building@新CBD' : 'CBD',
				'Ground@OlympicGreen' : '奥林匹克公园',
				'Billboard@OlympicGreen' : '奥林匹克公园',
				'Building@OlympicGreen' : '奥林匹克公园',
				'Tree@OlympicGreen' : '奥林匹克公园',
				'Waters@OlympicGreen' : '鸟巢',
				'jinjiang' : '晋江',
				'all' : '点云',
				'srsb' : '萨尔茨堡',
				'T8H_NoLod' : 'BIM(8号楼)',
				'srsb_etc' : '萨尔茨堡（android）',
				'srsb_pvr' : '萨尔茨堡（IOS）',
				'image' : '珠峰影像',
				'info' : '珠峰地形',
				'canbarra' : '堪培拉',
				'sci_park' : '香港科技园',
				'NewConfig' : '耶路撒冷',
				'siguniang' : '四姑娘山',
				'zf_pc' : '珠峰',
				'zf_ios' : '珠峰(IOS)',
				'zf_android' : '珠峰(Android)',
				'CBD_ALL' : 'CBD',
				'鸟巢五期' : '鸟巢',
				'jinshanling_pvr' : '金山岭',
				'水面@vector' : '萨尔茨堡',
				'萨尔茨堡_居民区' : '萨尔茨堡_圣安德烈教堂',
				'萨尔茨堡_学校' : '萨尔茨堡_莱希勒公园'
			},
			NameKeyMap : {
				'text' : '矢量（全国省份名字）',
				'Line' : '矢量（全国省份边界）',
				'专题图' : '矢量（全国省份区域）',
				'Tree@新CBD' : 'CBD(树木)',
				'Ground_2@新CBD' : 'CBD(地面2)',
				'Ground_1@新CBD' : 'CBD(地面1)',
				'Building@新CBD' : 'CBD(建筑)',
				'shuimian@新CBD' : 'CBD(水面)',
				'Ground@OlympicGreen' : '奥林匹克公园（地面）',
				'Billboard@OlympicGreen' : '奥林匹克公园（人）',
				'Building@OlympicGreen' : '奥林匹克公园（建筑物）',
				'Tree@OlympicGreen' : '奥林匹克公园（树木）',
				'Waters@OlympicGreen' : '鸟巢(水面)',
				'jinjiang' : '晋江',
				'all' : '点云',
				'srsb' : '萨尔茨堡',
				'T8H_NoLod' : 'BIM(8号楼)',
				'srsb_etc' : '萨尔茨堡（android）',
				'srsb_pvr' : '萨尔茨堡（IOS）',
				'image' : '珠峰影像',
				'info' : '珠峰地形',
				'canbarra' : '堪培拉',
				'sci_park' : '香港科技园',
				'NewConfig' : '耶路撒冷',
				'siguniang' : '四姑娘山',
				'zf_pc' : '珠峰',
				'zf_ios' : '珠峰(IOS)',
				'zf_android' : '珠峰(Android)',
				'CBD_ALL' : 'CBD',
				'鸟巢五期' : '鸟巢',
				'jinshanling_pvr' : '金山岭',
				'水面@vector' : '萨尔茨堡(水面)',
				'萨尔茨堡_居民区' : '萨尔茨堡_圣安德烈教堂',
				'萨尔茨堡_学校' : '萨尔茨堡_莱希勒公园'
			},
			ignore3DServices : {
				'3D-ChinaProvinces/rest' : true,
				'3D-Pipe3D/rest' : true,
				'3D-osgb/rest' : true,
				'3D-sample/rest' : true,
				'3D-zhufeng/rest' : true,
				'3D-S3MData/rest' : true,
				'3D-jinjiang/rest' : true,
				'3D-saercibao_dantihua_etc/rest' : true,
				'3D-Demo1/rest' : true,
				'3D-SiChuan/rest' : true,
				'3D-CBD_ALL/rest' : true,
				'3D-CBD/rest' : true,
				'3D-WebGLOlympicGreen/rest' : true,
				'3D-zf_tin_image_z/rest' : true,
				'3D-zhufeng/rest' : true,
                '3D-yanmofenxi/rest' : true,
                '3D-HuanJingJianCe/rest' : true,
                '3D-saercibao_dantihua_etc/rest' : true,
                '3D-saercibao_dantihua_pvr/rest' : true,
                '3D-saercibao_dantihua_pvr2/rest'  : true,
                '3D-test/rest' : true,
                '3D-stk_terrain/rest' : true,
                '3D-CBD/rest' : true
			},
			mobileIgnoreServices : {
				'3D-compress/rest' : true,
				'3D-canbarra/rest' : true,
				'3D-zf_pc/rest' : true
			},
			pcIgnoreServices : {
			},
			NOT : {
				'3D-srsb_etc/rest' : true,
				'3D-zf_android/rest' : true,
				'3D-srsb_pvr/rest' : true,
				'3D-zf_ios/rest' : true
			},
			ETC : {
				'3D-srsb_etc/rest' : true,
				'3D-zf_android/rest' : true,
				'3D-srsb/rest' : true
			},
			PVR : {
				'3D-srsb_pvr/rest' : true,
				'3D-zf_ios/rest' : true,
				'3D-srsb/rest' : true
			},
			SORT_RULE : {
				'萨尔茨堡_火车站' : SORT_NUM++,
				'萨尔茨堡_学校' : SORT_NUM++,
				'萨尔茨堡_居民区' : SORT_NUM++,
				'萨尔茨堡_足球场' : SORT_NUM++,
				'堪培拉_雷吉斯酒店' : SORT_NUM++,
				'堪培拉_国际会议中心' : SORT_NUM++,
				'堪培拉_克莱门斯街' : SORT_NUM++,
				'堪培拉_国会大厦' : SORT_NUM++,
				'Waters@OlympicGreen' : SORT_NUM++,
				'Tree@新CBD' : SORT_NUM++,
				'scipark' : SORT_NUM++,
				'srsb' : SORT_NUM++,
				'siguniang' : SORT_NUM++,
				'T8H_NoLod' : SORT_NUM++,
				'all' : SORT_NUM++,
				'水面@vector' : SORT_NUM++,
				'srsb_etc' : SORT_NUM++,
				'srsb_pvr' : SORT_NUM++
			},
			CAMERA_PARAM : {
				//香港科技园
				'sci_park' : {
					//Cartesian3 : {x : -2419369.6792697683 ,y : 5379978.187041689,z : 2417696.1157676256},
					Cartesian3 : {x: -2418588.062646316, y: 5377063.3568493, z: 2433772.4351331233},
					heading : 4.096567733318604,
					pitch:	 -0.4460113363586009,
					roll:	 1.4628298572461063e-12
				},
				//萨尔茨堡
				'srsb' : {
					//Cartesian3 : {x : 4180954.5891797305 ,y : 968557.1382991979,z : 4703248.613417386},
					Cartesian3 : {x: 4176126.452230629, y: 967046.2637712209, z: 4725835.5998172425},
					heading : 0.4262141860354083,
					pitch:	 -0.5681805539745808,
					roll:	 0.0016427639143330452
				},
				//萨尔茨堡(水面)
				'水面@vector' : {
					Cartesian3 : {x: 4176126.452230629, y: 967046.2637712209, z: 4725835.5998172425},
					heading : 0.4262141860354083,
					pitch:	 -0.5681805539745808,
					roll:	 0.0016427639143330452
				},
				//萨尔茨堡(ETC)
				'srsb_etc' : {
					Cartesian3 : {x: 4176126.452230629, y: 967046.2637712209, z: 4725835.5998172425},
					heading : 0.4262141860354083,
					pitch:	 -0.5681805539745808,
					roll:	 0.0016427639143330452
				},
				//萨尔茨堡(pvr)
				'srsb_pvr' : {
					Cartesian3 : {x: 4176126.452230629, y: 967046.2637712209, z: 4725835.5998172425},
					heading : 0.4262141860354083,
					pitch:	 -0.5681805539745808,
					roll:	 0.0016427639143330452
				},
				//鸟巢
				'鸟巢五期' : {
					//Cartesian3 : {x : -2175569.386789459 ,y : 4383585.396721729,z : 4077036.9295460964},
					Cartesian3 : {x: -2172984.9307288, y: 4375472.621715639, z: 4101745.414909702},
					heading : 3.937424496472802,
					pitch:	 -0.3057539771604527,
					roll: 6.283185307179508
				},
				//鸟巢(水面)
				'Waters@OlympicGreen' : {
					Cartesian3 : {x: -2172984.9307288, y: 4375472.621715639, z: 4101745.414909702},
					heading : 3.937424496472802,
					pitch:	 -0.3057539771604527,
					roll: 6.283185307179508
				},
				//CBD
				'CBD_ALL' : {
					Cartesian3 : {x : -2182429.699763085 ,y : 4386918.919955989,z : 4069992.320381068},
					heading : 0.2166238198765047,
					pitch:	 -0.24120620140647842,
					roll:	 0.0007317747020580967
				},
				//四姑娘山
				'siguniang' : {
					//Cartesian3 : {x : -1225686.562964169 ,y : 5367543.24550225,z : 3236365.1885518613},
					Cartesian3 : {x: -1228710.3487959448, y: 5406670.566586403, z: 3237799.2723682635},
					heading : 0.1468889081739011,
					pitch:	 -0.49474458513326436,
					roll:	 0.00044780564094182296
				},
				//堪培拉
				'canbarra' : {
					//Cartesian3 : {x : -4472300.319182013 ,y : 2674538.734087207,z : -3666745.21609297},
					Cartesian3 : {x: -4465322.878531479, y: 2674714.902593311, z: -3692279.762115207},
					heading : 0.5787717132958408,
					pitch:	 -0.41108917771977116,
					roll:	 2.5757174171303632e-14
				},
				//耶路撒冷
				'NewConfig' : {
					//Cartesian3 : {x : 4433485.716964715 ,y : 3131450.5078776213,z : 3339861.830419633},
					Cartesian3 : {x: 4430321.022537678, y: 3128374.624125989, z: 3358624.1086377273},
					heading : 0.40809398077464465,
					pitch:	 -0.32787266678475047,
					roll:	0.0012597644114666906
				},
				//点云
				'all' : {
					Cartesian3 : {x : -2108798.002867941 ,y : 6019480.504550814,z : 44700.842716371706},
					heading : 5.991951726241681,
					pitch:	 -0.3351374215115477,
					roll:	 6.2831709464466385
				},
				//CBD 树木
				'Tree@新CBD' : {
					//Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					Cartesian3 : {x : -2180073.6897648075,y : 4382305.16446403,z : 4090449.572538479},
					heading : 6.254707877912284,
					pitch : -0.27904074877433827,
					roll : 6.283087659878788
				},
				//CBD 地面
				'Ground_1@新CBD' : {
					//Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					Cartesian3 : {x : -2180073.6897648075,y : 4382305.16446403,z : 4090449.572538479},
					heading : 6.254707877912284,
					pitch : -0.27904074877433827,
					roll : 6.283087659878788
				},
				//CBD 地面
				'Ground_2@新CBD' : {
					//Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					Cartesian3 : {x : -2180073.6897648075,y : 4382305.16446403,z : 4090449.572538479},
					heading : 6.254707877912284,
                    pitch : -0.27904074877433827,
                    roll : 6.283087659878788
				},
				//CBD 建筑
				'Building@新CBD' : {
					//Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					Cartesian3 : {x : -2180073.6897648075,y : 4382305.16446403,z : 4090449.572538479},
					heading : 6.254707877912284,
					pitch : -0.27904074877433827,
					roll : 6.283087659878788
				},
				//CBD 水面
				'shuimian@新CBD' : {
					//Cartesian3 : {x : -2182693.927688742,y : 4387331.351556517,z : 4069461.345961679},
					Cartesian3 : {x : -2180073.6897648075,y : 4382305.16446403,z : 4090449.572538479},
					heading : 6.254707877912284,
					pitch : -0.27904074877433827,
					roll : 6.283087659878788
				},
				//金山岭
				'jinshanling_pvr' : {
					//Cartesian3 : {x : -2215478.4573752377,y : 4307079.474024054,z : 4137530.591334239},
					Cartesian3 : {x: -2213067.320271011, y: 4301552.025029091, z: 4158958.279463142},
                    heading : 6.088241651577615,
                    pitch : -0.3216968167576464,
                    roll : 6.282506861457678
				},
				'萨尔茨堡_足球场' : {
					//Cartesian3 : {x : 4180278.2148029194,y :967993.6502662017,z : 4703813.6935041845},圆球后坐标修改
					Cartesian3 : {x: 4172771.2267405745, y: 966301.2221602887, z: 4726734.903955387},
					heading : 6.148279429990531,
                    pitch : -0.38124172398953027,
                    roll : 6.282700345041999
				},
				'萨尔茨堡_学校' : {
					//Cartesian3 : {x : 4180901.0771870865,y :969263.9831018472,z : 4703066.826860772},圆球后坐标修改
					Cartesian3 : {x: 4173475.3930925997, y: 967620.4165230972, z: 4725955.210028133},
					heading : 6.1265700927648,
                    pitch : -0.41524530730936937,
                    roll : 6.282614801131622
				},
				'萨尔茨堡_居民区' : {
					//Cartesian3 : {x : 4181402.0475378884,y : 968794.1079814215,z : 4702723.118253315},
					Cartesian3 : {x: 4173913.7276362535, y: 967116.1328631315, z: 4725599.490255995},
					heading : 6.126468022766805,
                    pitch : -0.415343250137852,
                    roll : 6.2826147717335274
				},
				'萨尔茨堡_火车站' : {
					//Cartesian3 : {x : 4180777.7742772927,y : 969006.6357376062,z : 4703351.892056749},圆球后坐标修改
					Cartesian3 : {x : 4173526.479883316, y: 967043.7562815553, z: 4726028.128308516},
					heading : 6.1264329968301485,
                    pitch : -0.41524530730934983,
                    roll : 6.282614801131622
				},
				'堪培拉_国会大厦' : {
					//Cartesian3 : {x : -4472548.54454082,y : 2674432.6112516825,z : -3666400.432541532},
					Cartesian3 : {x : -4468098.752049304,y : 2670991.2071199003,z:-3686948.6984779797},
					heading :4.954434118083149,
                    pitch : -0.43487926026850054,
                    roll : 3.4156677486407716e-11
				},
				'堪培拉_国际会议中心' : {
					//Cartesian3 : {x : -4474484.9721811665,y : 2674131.6553716026,z : -3664258.2236266946},
					Cartesian3 : {x: -4469542.106631646, y: 2671076.451229256, z: -3684951.4176455135},
					heading : 5.840656689267002,
                    pitch : -0.37598642556500117,
                    roll : 6.283185307129266
				},
				'堪培拉_雷吉斯酒店' : {
					//Cartesian3 : {x : -4472708.283663221,y : 2673505.3594829114,z : -3666788.6338217887},
					Cartesian3 : {x: -4467746.0947478125, y: 2670491.3294802187, z: -3687389.876260711},
					heading : 4.954394268177333,
                    pitch : -0.4348375622665901,
                    roll : 3.4155789307988016e-11
				},
				'堪培拉_克莱门斯街' : {
					//Cartesian3 : {x : -4474324.849506137,y : 2674900.000487418,z : -3663942.8120619142},
					Cartesian3 : {x: -4469237.854653428, y: 2671878.4924117685, z: -3684731.7602585033},
					heading : 5.840750389681055,
                    pitch : -0.3762473023864379,
                    roll : 6.283185307129246
				}
			}
	};
	return Config;
});

















