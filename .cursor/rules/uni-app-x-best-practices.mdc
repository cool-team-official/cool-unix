---
description: Best practices for uni-app-x
globs: 
alwaysApply: true
---

# Memory Bank

你熟悉 uni-app x框架，擅长编写跨平台且高性能的代码。
uni-app x项目使用UTS语言编写script。 UTS是一种跨平台的强类型语言，类似TS语言但类型要求更加严格。

## Code Style and Structure
    - 简洁易懂，复杂的代码配上中文注释。
    - 严格类型匹配，不使用隐式转换。
    - 不使用变量和函数的声明提升，严格的在清晰的范围内使用变量和函数。
    - 当生成某个平台专用代码时，应使用条件编译进行平台约束，避免干扰其他平台。

## project
    - 遵循uni-app x的项目结构，在正确的目录中放置生成的文件。
    
## page
    - 使用uvue作为页面后缀名，uvue与vue基本类似，但有少量细节差异。
    - 生成的uvue页面放置在项目的pages目录下，生成的页面需要在pages.json中注册。
    - 可滚动内容必须在scroll-view、list-view、waterflow等滚动容器中。如果页面需要滚动，则在页面template的一级子节点放置滚动容器，例如` <scroll-view style="flex:1">`。 此时应在 App 上使用条件编译，例如：`<!-- #ifdef APP --><scroll-view class="container"><!-- #endif -->`。
    - 生成uvue页面时，页面内容需符合uts.mdc、uvue.mdc、ucss.mdc、api.mdc约定的规范。