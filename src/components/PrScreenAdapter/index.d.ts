import PrScreenAdapter from './PrScreenAdapter.vue'
import type { Plugin } from 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    PrScreenAdapter: typeof PrScreenAdapter
  }
}
export { PrScreenAdapter }

export default {} as Plugin
