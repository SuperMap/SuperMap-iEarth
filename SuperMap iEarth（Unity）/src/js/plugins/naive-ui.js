/*
**在这里设置ui库的引入
**方便按需引入配置
*/

//全局引入naive-ui
// import naive from 'naive-ui'
// export default naive

//按需引入
import { create, NSpace, NButton, NConfigProvider, NMessageProvider, NCard, NTree, NTabs, NTabPane, NSelect ,NInput,NDropdown} from "naive-ui";

const naive = create({
    components: [NButton, NSpace, NConfigProvider, NMessageProvider, NCard, NTree, NTabs, NTabPane, NSelect,NInput,NDropdown]
})

export default naive



