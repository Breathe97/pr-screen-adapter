# 基于 vue3 封装的一个自适应宽屏的组件。

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
<div class="list">
  <PrScreenAdapter :width="5760" :height="1944" :maxAspectRatio="3.6">
    <div>正常页面内容</div>
  </PrScreenAdapter>
</div>
```

## 代码仓库

[github](https://github.com/breathe97/pr-screen-adapter)

## 贡献

breathe
