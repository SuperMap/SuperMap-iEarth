
/* *
*公共服务场景图层配置
*/
export default  [
            {
                type: "REALSPACE",
                imgUrl: "imgs/webServeImg/鸟巢.png",
                name: "鸟巢",
                nameEN: "niaochao",
                state: 0,
                layers: [
                    { type: 'S3M', layerName: 'Road@鸟巢数据优化缓存', layerUrl: "http://www.supermapol.com/realspace/services/3D-niaochao-2/rest/realspace" },
                    { type: 'S3M', layerName: 'Building@鸟巢数据优化缓存', layerUrl: "http://www.supermapol.com/realspace/services/3D-niaochao-2/rest/realspace" },
                    { type: 'S3M', layerName: 'Waters_color@鸟巢数据优化缓存', layerUrl: "http://www.supermapol.com/realspace/services/3D-niaochao-2/rest/realspace" },
                    { type: 'S3M', layerName: 'Tree_Xiaopin@鸟巢数据优化缓存', layerUrl: "http://www.supermapol.com/realspace/services/3D-niaochao-2/rest/realspace" },
                    { type: 'S3M', layerName: 'Ground@鸟巢数据优化缓存', layerUrl: "http://www.supermapol.com/realspace/services/3D-niaochao-2/rest/realspace" },
                ],
            },

            {
                type: "REALSPACE",
                imgUrl: "imgs/webServeImg/四姑娘山.png",
                name: "地形影像",
                nameEN: "terrain image",
                state: 0,
                layers: [
                    { type: 'IMG', layerName: 'Image', layerUrl: "http://www.supermapol.com/realspace/services/3D-DiXingYingXiang/rest/realspace" },
                    { type: 'TERRAIN', layerName: 'dixing', layerUrl: "http://www.supermapol.com/realspace/services/3D-DiXingYingXiang/rest/realspace" },
                ]
            }

        ]
   





