---
description: 
globs: *.uts,*.uvue
alwaysApply: false
---

# UTS Rules

- 生成的脚本代码使用跨平台的UTS语言。
- UTS语言类似ts，但为了跨平台编译为kotlin、swift等强类型语言，进行了约束。
- UTS是强类型语言，类型要求严格，不能动态转换类型。 与kotlin等强类型语言一样。
- 不能使用类型隐式转换。 尤其是条件语句(if、while、do-while、三元运算符、for 循环的条件部分)必须使用布尔类型作为条件。 当判断变量a是否为空时，不能写成 `if (a)`，或`if (!a)` 要写成 `if (a!=null)`。
- 可为null和不可为null的类型需要严格区分，使用 `|null` 或 `?` 来定义可为空。
- 可为null的数据类型在使用其属性或方法时，需要判断不为null，或者使用`?.`安全调用。 谨慎使用 `!.` 断言。
- any类型的变量在使用其属性或方法时，需要as为正确的相容类型。
- 不支持object类型，使用UTSJSONObject类型替代。
- 不支持undefined，变量使用前必须赋值。
- 对象类型定义使用type而不是interface。 interface是接口，不用于对象类型定义。
- 变量和常量定义使用let和const，不使用var。
- 不使用 JSX 表达式。
- 不使用 with 语句。
- 不使用ts的结构化类型系统。使用名义类型系统，强调类型名称和继承关系以确保类型安全。
- 不使用 is 运算符。 使用 instanceof 和 as 进行类型保护。
- 尽量不使用any。
- 尽量不使用 === 和!==， 使用 == 和!= 替代。
- 不使用js的原型链特性。
- 严格遵守“先定义后使用”的规则。使用代码在定义代码之前。
- 更多参考：[uts与ts的差异](https://doc.dcloud.net.cn/uni-app-x/uts/uts_diff_ts.html)
