# 基于 vue3 封装的一个基于外部容器自适应缩放的组件。

[在线预览](https://pryun.vip/pr-screen-adapter/)

## 插件核心源码在 ./core 中 当前目录为插件应用的demo

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
<div id="app" style="position: relative;;width:100vw;height:100vh;">
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
  // 最大宽高比 在当前比值内自动校准宽度 以达到充满两边适配宽屏
  maxAspectRatio: {
    type: [Number],
    default: () => 4
  },
  // 模式 纵横比缩放
  // none 关闭时会开启滚动条 (一般本地开发可能会用到，比如台式、笔记本不能缩放页面时)
  // aspectFit 全屏适应，宽度高度自适应缩放到完整显示
  // widthFix 宽度铺满，高度自动变化
  // heightFix 高度铺满，宽度自动变化
  mode: {
    type: [String],
    default: () => 'aspectFit'
  },
  // 背景
  bg: {
    type: [String],
    default: () => 'rgba(5, 21, 39, 0.9)'
  },
  // 布局同步 （当外层修改 width height mode 时 会重新加载内部布局和缩放）
  layoutSync: {
    type: [Boolean],
    default: () => false
  },
  // 快捷缩放 功能键 + 鼠标滚轮
  quickZoom: {
    type: [Boolean],
    default: () => false
  },
  // 快捷键
  quickKey: {
    type: String as PropType<'Shift' | 'Alt'>,
    default: () => 'Alt'
  },
  // 鼠标滚轮事件 默认关闭 在触发快捷功能时会强行关闭
  mouseEvent: {
    type: [Boolean],
    default: () => false
  }
})
```

## 代码仓库

[github](https://github.com/breathe97/pr-screen-adapter)

## 贡献

breathe
