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

```css
.list {
  padding: 4px 0;
  box-sizing: border-box;
  position: relative;
  width: 500px;
  height: 700px;
  border: 1px solid;
  overflow: hidden;
}
.item {
  padding: 4px 0;
  box-sizing: border-box;
  height: 200px;
}
.item-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(24, 60, 107);
}
```

## 代码仓库

[github](https://github.com/breathe97/pr-screen-adapter)

## 贡献

breathe
