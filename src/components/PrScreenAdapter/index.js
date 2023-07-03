import PrScreenAdapter from './PrScreenAdapter.vue' // 引入封装好的组件

// 按需引入
export { PrScreenAdapter }

const component = [PrScreenAdapter]

const _PrScreenAdapter = {
  install(App) {
    component.forEach((item) => {
      App.component(item.__name, item)
    })
  }
}

export default _PrScreenAdapter
