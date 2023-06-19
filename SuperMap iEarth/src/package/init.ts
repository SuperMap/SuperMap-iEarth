import * as components from './components/components';
import store from '@/store';
import setBrowserLang from '@/tools/browserLang'

// 初始化时注入自定义超封装的图三维组件
function InitSuperMap3DComponents(app:any) {
    app.use(store);
    setBrowserLang();
    // 遍历components，实现全局注册组件
    Object.keys(components).map((key) => components[key]).forEach((component:any) => {
        // console.log("超图三维组件:",`sm-${component.__name}`)
        app.component(`sm-${component.__name}`,component)
    });

}

export default InitSuperMap3DComponents;
