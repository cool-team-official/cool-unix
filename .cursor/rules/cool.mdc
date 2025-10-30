---
description: 
globs: *.uts,*.uvue
alwaysApply: false
---

# ts | uts

- 所有方法必须在被调用之前进行定义，避免出现“先调用后定义”的情况。
- 当使用 {} 进行对象赋值时，必须显式声明类型，例如：{} as Data，确保类型安全与规范。

# setup

- 页面参数请通过 props 接收，避免使用 onLoad 接口。

# <template>

- 页面无需手动在最外层包裹 <scroll-view class="flex-1" scroll-y>，因已由 <cl-page> 统一处理页面滚动。

# cool-ui

- 组件参数值必须为合法、准确且符合预期的类型和取值范围，避免传递无效或异常数值。

# 图标

- 图标样式名称的使用请参考 /icons 目录下已定义的命名。

# 设计规范

- 组件开发请参考 /pages/demo 下的代码示例，遵循其用法与风格。
- 页面开发建议参照 /pages/template 下的标准模板，保持结构与规范一致。
- 当页面底部需要展示按钮等操作区域时，建议统一使用 cl-footer 组件配合实现，确保交互区域风格和布局规范一致。

# 页面模板代码

```uvue
<template>
    <cl-page>
        <view class="p-3"></view>
    </cl-page>
</template>

<script lang="ts" setup>

</script>
```
