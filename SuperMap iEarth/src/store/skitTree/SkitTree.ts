import { defineStore } from 'pinia';

export const useSkitTreeStore = defineStore({
  id: 'useSkitTreeStore',
  state: (): any => {
    return {
      InstanceCollection: [
        {
          sceneMode: viewer.scene.mode,
          label: '全部小品',
          key: '0',
          children: [
            {
              label: '单个添加',
              key: '1',
              children: []
            }, {
              label: '沿线添加',
              key: '2',
              children: []
            }, {
              label: '区域添加',
              key: '3',
              children: []
            }
          ]
        }
      ]
    }
  },
  getters:{},
  actions:{
    createSkitCollectionOptions(){
      return SuperMap3D.clone(this.InstanceCollection[0], true);
    }
  }
})