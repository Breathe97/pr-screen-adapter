# 基于 vue3 封装的一个基于外部容器自适应缩放的组件。

[在线预览](https://pryun.vip/pr-screen-adapter/)

## 使用方法

```bash
npm i pr-screen-adapter
```

#### 全局引入

```js
import PrScreenAdapter from 'pr-screen-adapter'
app.use(PrScreenAdapter)
```

#### 按需引入

```js
import { PrScreenAdapter } from 'pr-screen-adapter'
```

```html
<div style="width:100vw;height:100vh;">
  <PrScreenAdapter :width="5760" :height="1944" :maxAspectRatio="3.6">
    <div>正常页面内容</div>
  </PrScreenAdapter>
</div>
```

#### 参数设置

```js
const props = defineProps({
  // 期望宽度
  width: {
    type: [Number],
    default: () => 5760
  },
  // 期望高度
  height: {
    type: [Number],
    default: () => 1620
  },
  // 自动校准比例
  autoRatio: {
    type: [Boolean],
    default: () => true
  },
  // 最大宽高比 在基数内自动校准宽度 以达到充满两边
  maxAspectRatio: {
    type: [Number],
    default: () => 4
  },
  // 滚动容器 默认关闭 开启时不缩放 但是可以左右滚动
  scrollView: {
    type: [Boolean],
    default: () => false
  },
  // 背景
  bg: {
    type: [String],
    default: () => 'rgba(5, 21, 39, 0.9)'
  }
})
```

## 代码仓库

[github](https://github.com/breathe97/pr-screen-adapter)

## 贡献

breathe
