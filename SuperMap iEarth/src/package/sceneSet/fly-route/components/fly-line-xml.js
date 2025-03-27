/*
 * @Author: juzi.liu 
 * @Date: 2021-04-09 09:22:43 
 * @Last Modified by: juzi.liu
 * @Last Modified time: 2021-04-09 09:45:51
 */

class flylinexml {
    constructor() {
    }
    /**
     * 添加飞行的路线节点
     * @param {*} route ={idnex:0,speed:0, ~~~}
     */
    createXMLflyLine(route) {  
        let parser = new DOMParser()
        window.parser = parser
        let xmlDoc = parser.parseFromString("<cusxmlRoute></cusxmlRoute>", "text/xml")
        window.xmlDoc = xmlDoc
        let sceneRouteNode = this.createSceneRouteNode(xmlDoc)

        //创建路线
        let routeNode = this.createRouteNode(xmlDoc, route)
        let routeStyleNode = this.createRouteStyleNode(xmlDoc)
        routeNode.appendChild(routeStyleNode)
        //开始添加站点
        let _that = this;
        let stops = route.routeStops;
        if (stops.length < 2) {
            console.warn("节点数小于2")
            return
        }
        for (let index = 0; index < stops.length ; index++) {
            let stop = stops[index];
            let camerainfo = {
                longitude: stop.point[0],
                latitude: stop.point[1],
                altitude: stop.point[2],
                heading: stop.heading * (180 / Math.PI),
                tilt: stop.tilt * (180 / Math.PI)+ 90
            }
            
            let stopnode = _that.createStopNode(xmlDoc, camerainfo,stop, index)
            routeNode.appendChild(stopnode)

        }
        sceneRouteNode.appendChild(routeNode)
        xmlDoc.children[0].appendChild(sceneRouteNode)
        let flylinexml = xmlDoc.children[0].innerHTML
        return flylinexml

    }
    createSceneRouteNode(rootXmlDoc) {
        let sceneRouteNode = rootXmlDoc.createElement("SceneRoute")
        sceneRouteNode.setAttribute("xmlns", "http://www.supermap.com.cn/ugc60")
        return sceneRouteNode
    }

    createRouteNode(rootXmlDoc, route) {
        let routeNode = rootXmlDoc.createElement("route")
        let attrs = {
            name: route.routeName || "飞行路线" ,
            speed: route.speed || "200",
            lineType: "0",
            showroutestop: "False",
            showrouteline: "False",
            altitudefree: "False",
            headingfree: "False",
            tiltfree: "False",
            flycircle: "False",
            alongline: route.isAlongLine || "False",
            sceneMode: route.sceneMode || SuperMap3D.SceneMode.SCENE3D,
        }
        for (const key in attrs) {
            routeNode.setAttribute(key, attrs[key])
        }
        return routeNode
    }
    createRouteStyleNode(rootXmlDoc) {

        let routeStyleNode = rootXmlDoc.createElement("style")
        let geostyle3d = rootXmlDoc.createElement("geostyle3d")
        let linecolor = rootXmlDoc.createElement("linecolor")
        linecolor.textContent = "RGBA(147,112,219,255)"

        let linewidth = rootXmlDoc.createElement("linewidth")
        linewidth.textContent = 2
        let altitudeMode = rootXmlDoc.createElement("altitudeMode")
        altitudeMode.textContent = "Absolute"
        let bottomAltitude = rootXmlDoc.createElement("bottomAltitude")
        bottomAltitude.textContent = 0.00
        geostyle3d.appendChild(linecolor)
        geostyle3d.appendChild(linewidth)
        geostyle3d.appendChild(altitudeMode)
        geostyle3d.appendChild(bottomAltitude)

        routeStyleNode.appendChild(geostyle3d)
        return routeStyleNode

    }
    createStopNode(rootXmlDoc, camerainfo,stop,index) {
        let stopNode = rootXmlDoc.createElement("routestop");
        let name = stop.stopName || 'Stop' + ( index + 1)
        let attris = {
            name: name,
            speed: stop.speed,
            excluded: "False",
            viewType: "camera"
        }
        for (const key in attris) {
            stopNode.setAttribute(key, attris[key])
        }
        let cameranode = this.createStopCameraNode(rootXmlDoc, camerainfo)
        stopNode.appendChild(cameranode)
        let stylenode = this.createStopStyleNode(rootXmlDoc)
        stopNode.appendChild(stylenode)

        let settingnode = this.createStopSettingNode(rootXmlDoc,stop)
        stopNode.appendChild(settingnode)
        return stopNode

    }
    createStopCameraNode(rootXmlDoc, cameraObj) {
        let stopCameraNode = rootXmlDoc.createElement("camera")
        for (const key in cameraObj) {
            let node = rootXmlDoc.createElement(key)
            node.textContent = cameraObj[key]
            stopCameraNode.appendChild(node)
        }
        return stopCameraNode
    }
    createStopStyleNode(rootXmlDoc) {
        let nodeObj = {
            icon: "",
            markersize: 4.8,
            markericonscale: 1,
            markercolor: "RGBA(255, 255, 255, 255)"
        }
        let stopStyleNode = rootXmlDoc.createElement("style")
        let geostyle3d = rootXmlDoc.createElement("geostyle3d")

        for (const key in nodeObj) {
            let node = rootXmlDoc.createElement(key)
            node.textContent = nodeObj[key]
            geostyle3d.appendChild(node)
        }
        stopStyleNode.appendChild(geostyle3d)
        return stopStyleNode

    }
    createStopSettingNode(rootXmlDoc,stop) {
        let stopSettingNode = rootXmlDoc.createElement("setting");
        let nodesObj = {
            turnTime: stop.surroundDuration || 1.5,
            turnSlowly:  "False",
            stopPlayMode:stop.stopPlayMode|| "StopPause",
            autoPlay: "False",
            pauseTime:stop.waitTime || 0,
            angularSpeed: 1,
            sceneMode: stop.sceneMode,
        }
        for (const key in nodesObj) {
            let node = rootXmlDoc.createElement(key)
            node.textContent = nodesObj[key]
            stopSettingNode.appendChild(node)
        }
        return stopSettingNode
    }
}
export default flylinexml
