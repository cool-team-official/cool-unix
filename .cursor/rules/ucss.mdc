---
description: Uni-App X implements a subset of Web CSS on the App platform
globs: *.css,*.ucss,*.uvue,*.scss,*.less,*. sass
alwaysApply: false
---
# css rules
ucss是css的子集，但可以跨平台使用。除了浏览器之外，还支持App原生平台。

## 布局规范
- 禁用浮动、网格等布局，仅使用flex布局或绝对定位。
- flex布局默认方向为垂直(通过 flex-direction:column 实现)。

## 选择器规则
- 仅支持基本的类选择器 (.class)，禁止使用其他选择器。
- 类名必须符合 [A-Za-z0-9_-]+ 规范，禁止使用特殊字符(例如 @class)。

## 文字样式规则
- 文字内容需放置在组件 <text> 或 <button> 中。文字类样式(color、font-size)只能设置在 <text> 或 <button> 组件上。 其他组件（如<view>）禁止设置文本相关样式。
- 文字样式不继承。
- 禁用继承相关关键字，例如 inherit 和 unset。

## 层级控制
- z-index 仅对同级兄弟节点生效。
- absolute 固定位与文档流分离，不支持分层覆盖。

## 长度单位
- 仅支持px、rpx、百分比。字体的line-height支持em。不能使用其他单位，如vh。
- 除非width需要根据屏幕宽度而变化才使用rpx单位。其他场景不使用rpx单位。
- 除非长度单位需要根据父容器大小而变化才使用百分比单位。其他场景不使用rpx单位。

## at-rules
- 仅支持`@font-face`、`@import`，不使用其他at-rules。
- 如需使用`@media` 适配不同屏幕，改用 uts 代码实现，先通过API `uni.getWindowInfo`获取屏幕宽度， 再通过代码进行适配。
- 如需使用`@media` 适配暗黑模式， 改用 uts 代码 和 css变量 实现。
- 如需使用`@keyframes`，改为通过UniElement对象的animate方法实现相同逻辑。

## css function
- 仅支持 url()、rgb()、rgba()、var()、env()，不使用其他css方法。

## 样式作用范围规则
- 不使用css scoped。

