// @ts-ignore
import PrScreenAdapter from './PrScreenAdapter/PrScreenAdapter.vue'
import type { Plugin } from 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    PrScreenAdapter: typeof PrScreenAdapter
  }
}
export { PrScreenAdapter }

export default Plugin
