import { defineStore } from 'pinia';

export const useSkitTreeStore = defineStore({
  id: 'useSkitTreeStore',
  state: (): any => {
    return {
      InstanceCollection: [
        {
          sceneMode: viewer.scene.mode,
          label: $t("allSkits"),
          key: '0',
          children: [
            {
              label: $t("singleAdd"),
              key: '1',
              children: []
            }, {
              label: $t("lineAdd"),
              key: '2',
              children: []
            }, {
              label: $t("AreaAdd"),
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