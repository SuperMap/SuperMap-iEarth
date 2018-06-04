define(function () {
    var SORT_NUM = 1;
    var Config = {
        TitleKeyMap: {
            'text': '矢量（全国省份）',
            'Line': '矢量（全国省份）',
            '专题图': '矢量（全国省份）',
            'Tree@新CBD': 'CBD',
            'Ground_2@新CBD': 'CBD',
            'Ground_1@新CBD': 'CBD',
            'Building@新CBD': 'CBD',
            'Ground@OlympicGreen': '奥林匹克公园',
            'Billboard@OlympicGreen': '奥林匹克公园',
            'Building@OlympicGreen': '奥林匹克公园',
            'Tree@OlympicGreen': '奥林匹克公园',
            'Waters@OlympicGreen': '鸟巢',
            'jinjiang': '晋江',
            'all': '点云',
            'srsb': '萨尔茨堡',
            'T8H_NoLod': 'BIM(8号楼)',
            'srsb_etc': '萨尔茨堡（android）',
            'srsb_pvr': '萨尔茨堡（IOS）',
            'image': '珠峰影像',
            'info': '珠峰地形',
            'canbarra': '堪培拉',
            'sci_park': '香港科技园',
            'NewConfig': '耶路撒冷',
            'siguniang': '四姑娘山',
            'zf_pc': '珠峰',
            'zf_ios': '珠峰(IOS)',
            'zf_android': '珠峰(Android)',
            'CBD_ALL': 'CBD',
            '鸟巢五期': '鸟巢',
            'jinshanling_pvr': '金山岭',
            '水面@vector': '萨尔茨堡',
            '萨尔茨堡_居民区': '萨尔茨堡_圣安德烈教堂',
            '萨尔茨堡_学校': '萨尔茨堡_莱希勒公园'
        },
        NameKeyMap: {
            'text': '矢量（全国省份名字）',
            'Line': '矢量（全国省份边界）',
            '专题图': '矢量（全国省份区域）',
            'Tree@新CBD': 'CBD(树木)',
            'Ground_2@新CBD': 'CBD(地面2)',
            'Ground_1@新CBD': 'CBD(地面1)',
            'Building@新CBD': 'CBD(建筑)',
            'shuimian@新CBD': 'CBD(水面)',
            'Ground@OlympicGreen': '奥林匹克公园（地面）',
            'Billboard@OlympicGreen': '奥林匹克公园（人）',
            'Building@OlympicGreen': '奥林匹克公园（建筑物）',
            'Tree@OlympicGreen': '奥林匹克公园（树木）',
            'Waters@OlympicGreen': '鸟巢(水面)',
            'jinjiang': '晋江',
            'all': '点云',
            'srsb': '萨尔茨堡',
            'T8H_NoLod': 'BIM(8号楼)',
            'srsb_etc': '萨尔茨堡（android）',
            'srsb_pvr': '萨尔茨堡（IOS）',
            'image': '珠峰影像',
            'info': '珠峰地形',
            'canbarra': '堪培拉',
            'sci_park': '香港科技园',
            'NewConfig': '耶路撒冷',
            'siguniang': '四姑娘山',
            'zf_pc': '珠峰',
            'zf_ios': '珠峰(IOS)',
            'zf_android': '珠峰(Android)',
            'CBD_ALL': 'CBD',
            '鸟巢五期': '鸟巢',
            'jinshanling_pvr': '金山岭',
            '水面@vector': '萨尔茨堡(水面)',
            '萨尔茨堡_居民区': '萨尔茨堡_圣安德烈教堂',
            '萨尔茨堡_学校': '萨尔茨堡_莱希勒公园'
        },
        ignore3DServices: {
            '3D-ChinaProvinces/rest': true,
            '3D-Pipe3D/rest': true,
            '3D-osgb/rest': true,
            '3D-sample/rest': true,
            '3D-zhufeng/rest': true,
            '3D-S3MData/rest': true,
            '3D-jinjiang/rest': true,
            '3D-saercibao_dantihua_etc/rest': true,
            '3D-Demo1/rest': true,
            '3D-SiChuan/rest': true,
            '3D-CBD_ALL/rest': true,
            '3D-CBD/rest': true,
            '3D-WebGLOlympicGreen/rest': true,
            '3D-zf_tin_image_z/rest': true,
            '3D-zhufeng/rest': true,
            '3D-yanmofenxi/rest': true,
            '3D-HuanJingJianCe/rest': true,
            '3D-saercibao_dantihua_etc/rest': true,
            '3D-saercibao_dantihua_pvr/rest': true,
            '3D-saercibao_dantihua_pvr2/rest': true,
            '3D-test/rest': true,
            '3D-stk_terrain/rest': true,
            '3D-CBD/rest': true
        },
        mobileIgnoreServices: {
            '3D-compress/rest': true,
            '3D-canbarra/rest': true,
            '3D-zf_pc/rest': true
        },
        pcIgnoreServices: {},
        NOT: {
            '3D-srsb_etc/rest': true,
            '3D-zf_android/rest': true,
            '3D-srsb_pvr/rest': true,
            '3D-zf_ios/rest': true
        },
        ETC: {
            '3D-srsb_etc/rest': true,
            '3D-zf_android/rest': true,
            '3D-srsb/rest': true
        },
        PVR: {
            '3D-srsb_pvr/rest': true,
            '3D-zf_ios/rest': true,
            '3D-srsb/rest': true
        },
        SORT_RULE: {
            '萨尔茨堡_火车站': SORT_NUM++,
            '萨尔茨堡_学校': SORT_NUM++,
            '萨尔茨堡_居民区': SORT_NUM++,
            '萨尔茨堡_足球场': SORT_NUM++,
            '堪培拉_雷吉斯酒店': SORT_NUM++,
            '堪培拉_国际会议中心': SORT_NUM++,
            '堪培拉_克莱门斯街': SORT_NUM++,
            '堪培拉_国会大厦': SORT_NUM++,
            'Waters@OlympicGreen': SORT_NUM++,
            'Tree@新CBD': SORT_NUM++,
            'scipark': SORT_NUM++,
            'srsb': SORT_NUM++,
            'siguniang': SORT_NUM++,
            'T8H_NoLod': SORT_NUM++,
            'all': SORT_NUM++,
            '水面@vector': SORT_NUM++,
            'srsb_etc': SORT_NUM++,
            'srsb_pvr': SORT_NUM++
        },
        CAMERA_PARAM: {
            '香港科技园': {
                Cartesian3: {x: -2418298.345419565, y: 5377152.887300253, z: 2433175.316684532},
                heading: 4.8176854271927825,
                pitch: -0.3323052296889355,
                roll: 1.48903112062726e-11
            },
            '萨尔茨堡火车站': {
                Cartesian3: {x: 4173301.2396020144, y: 965626.4033609143, z: 4727051.679426561},
                heading: 1.5705568624210677,
                pitch: -0.5949347781080299,
                roll: 2.72473599238765e-10
            },
            'BIM建筑': {
                Cartesian3: {x: -2180753.065987198, y: 4379023.266141494, z: 4092583.575045952},
                heading: 4.0392222751147955,
                pitch: 0.010279641987852584,
                roll: 1.240962888005015e-11
            },
            'CBD': {
                Cartesian3: {x: -2180311.9545472134, y: 4380935.491489179, z: 4091551.732735441},
                heading: 6.240726986091157,
                pitch: -0.4564392939641406,
                roll: 6.283185307179501
            },
            '点云': {
                Cartesian3: {x: -3726950.8178392285, y: 3087276.1287523108, z: 4154724.882310502},
                heading: 3.769049490696352,
                pitch: 0.014489436405058065,
                roll: 6.283185307179586
            },
            '索菲亚大教堂': {
                Cartesian3: {x: -2653941.18525584, y: 3571094.044656822, z: 4570248.642141195},
                heading: 1.473838220856936,
                pitch: -0.4737197136102882,
                roll: 6.252776074688882e-13
            },
            '鸟巢': {
                Cartesian3: {x: -2172727.1327970685, y: 4377625.782859447, z: 4098783.828534335},
                heading: 5.86627559202018,
                pitch: -0.2796122953540934,
                roll: 2.2601476246109087e-10
            },
            '矢量': {
                Cartesian3: {x: -2322604.3037671307, y: 5386285.275047991, z: 2505308.540418011},
                heading: 6.123346664257511,
                pitch: -0.42306371995295966,
                roll: 6.590283874174929e-13
            },
            '四川省地形影像': {
                Cartesian3: {x: -1174876.248090832, y: 5378654.138996054, z: 3297681.570615712},
                heading: 1.2875843902350947,
                pitch: -0.7122360770598006,
                roll: 5.341383335633054e-9
            },
            '管线': {
                Cartesian3: {x: -2654067.9175655306, y: 3570906.1751395953, z: 4570128.620535601},
                heading: 2.3342380872400197,
                pitch: -0.500867983323281,
                roll: 9.155165514584951e-11
            },
            '体数据': {
                Cartesian3: {x: -2598276.5264489097, y: 4230698.094577965, z: 4004349.9225157197},
                heading: 1.8453000000000017,
                pitch: -0.13449999999999784,
                roll: 6.2831853071795845
            }
        }
    };
    return Config;
});

















