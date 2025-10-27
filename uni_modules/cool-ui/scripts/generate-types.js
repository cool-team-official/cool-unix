const fs = require("fs");
const path = require("path");
const { parse } = require("@vue/compiler-sfc");
const babelParser = require("@babel/parser");
const t = require("@babel/types");

/**
 * UVUE 组件类型定义生成器
 *
 * 这个脚本可以自动解析 uvue 文件中的 Vue 3 Composition API 代码，
 * 提取组件的 Props、Emits、Expose 等类型信息，并生成对应的 TypeScript 类型定义。
 *
 * 支持的特性：
 * - ✅ defineProps：支持所有 Vue 3 props 定义方式，包括 PropType、联合类型、可选/必需属性
 * - ✅ defineEmits：支持 TypeScript 类型化的 defineEmits<{}>() 和数组形式的 defineEmits([])
 * - ✅ defineSlots：支持 TypeScript 类型化的 defineSlots<{}>() 插槽定义
 * - ✅ defineExpose：解析组件暴露的方法和属性
 * - ✅ defineOptions：提取组件名称
 * - ✅ 自动生成 Vue 全局组件类型声明
 *
 * 生成的文件：
 * - index.d.ts：包含全局组件类型声明的主文件
 * - types/components.ts：包含具体组件 Props 接口的类型文件
 *
 * 使用方法：
 * 1. 确保项目已安装必要依赖：@vue/compiler-sfc @babel/parser @babel/types
 * 2. 运行脚本：npm run generate-types 或 node uni_modules/cool-ui/scripts/generate-types.js
 * 3. 生成的类型文件将自动更新到对应位置
 *
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * 解析uvue文件并提取类型信息
 */
class UvueTypeParser {
	constructor() {
		this.componentTypes = new Map();
	}

	/**
	 * 使用Vue官方编译器解析uvue文件
	 */
	parseUvueFile(filePath) {
		const content = fs.readFileSync(filePath, "utf-8");

		try {
			// 使用Vue官方编译器解析SFC文件
			const { descriptor } = parse(content, { filename: filePath });

			if (!descriptor.script && !descriptor.scriptSetup) {
				console.log(`  跳过文件 ${path.basename(filePath)}: 没有script部分`);
				return null;
			}

			// 优先使用script setup，否则使用普通script
			const script = descriptor.scriptSetup || descriptor.script;
			if (!script || !script.content) {
				return null;
			}

			return this.parseScriptContent(script.content, filePath);
		} catch (error) {
			console.error(`解析文件 ${filePath} 时出错:`, error.message);
			return null;
		}
	}

	/**
	 * 解析script内容
	 */
	parseScriptContent(scriptContent, filePath) {
		try {
			// 使用Babel解析TypeScript代码
			const ast = babelParser.parse(scriptContent, {
				sourceType: "module",
				plugins: ["typescript", "decorators-legacy"]
			});

			const result = {
				name: null,
				props: {},
				emits: {},
				slots: {},
				expose: {},
				imports: [],
				passThroughTypes: {},
				filePath
			};

			// 遍历AST节点
			this.traverseAST(ast, result);

			return result.name ? result : null;
		} catch (error) {
			console.error(`解析script内容时出错:`, error.message);
			return null;
		}
	}

	/**
	 * 遍历AST并提取信息
	 */
	traverseAST(ast, result) {
		const visit = (node) => {
			if (!node) return;

			// 处理import语句
			if (t.isImportDeclaration(node)) {
				this.extractImports(node, result);
			}

			// 处理defineOptions调用
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				node.callee.name === "defineOptions"
			) {
				this.extractDefineOptions(node, result);
			}

			// 处理defineProps调用
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				node.callee.name === "defineProps"
			) {
				this.extractDefineProps(node, result);
			}

			// 处理defineEmits调用
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				node.callee.name === "defineEmits"
			) {
				this.extractDefineEmits(node, result);
			}

			// 处理defineSlots调用
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				node.callee.name === "defineSlots"
			) {
				this.extractDefineSlots(node, result);
			}

			// 处理defineExpose调用
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				node.callee.name === "defineExpose"
			) {
				this.extractDefineExpose(node, result);
			}

			// 处理type声明（如PassThrough类型）
			if (t.isTSTypeAliasDeclaration(node)) {
				this.extractTypeAlias(node, result);
			}

			// 递归遍历所有子节点
			for (const key in node) {
				const child = node[key];
				if (Array.isArray(child)) {
					child.forEach(visit);
				} else if (child && typeof child === "object" && child.type) {
					visit(child);
				}
			}
		};

		visit(ast);
	}

	/**
	 * 提取import语句中的类型导入
	 */
	extractImports(node, result) {
		if (!t.isStringLiteral(node.source)) return;

		const source = node.source.value;
		const typeImports = [];

		// 只处理类型导入 (import type {...} 或 import { type ... })
		if (node.importKind === "type") {
			// import type { Type1, Type2 } from '...'
			for (const specifier of node.specifiers) {
				if (t.isImportSpecifier(specifier)) {
					const importedName = t.isIdentifier(specifier.imported)
						? specifier.imported.name
						: specifier.imported.value;
					typeImports.push(importedName);
				}
			}
		} else {
			// import { type Type1, type Type2, normalFunction } from '...'
			for (const specifier of node.specifiers) {
				if (t.isImportSpecifier(specifier) && specifier.importKind === "type") {
					const importedName = t.isIdentifier(specifier.imported)
						? specifier.imported.name
						: specifier.imported.value;
					typeImports.push(importedName);
				}
			}
		}

		// 只保存类型导入，并且不是vue或其他框架的导入
		if (typeImports.length > 0 && !source.includes("vue") && !source.includes("@/")) {
			result.imports.push({
				source,
				types: typeImports,
				isTypeOnly: node.importKind === "type"
			});
		}
	}

	/**
	 * 提取defineOptions中的组件名
	 */
	extractDefineOptions(node, result) {
		if (node.arguments.length > 0 && t.isObjectExpression(node.arguments[0])) {
			const props = node.arguments[0].properties;
			for (const prop of props) {
				if (
					t.isObjectProperty(prop) &&
					t.isIdentifier(prop.key) &&
					prop.key.name === "name" &&
					t.isStringLiteral(prop.value)
				) {
					result.name = prop.value.value;
				}
			}
		}
	}

	/**
	 * 提取defineProps中的props定义
	 */
	extractDefineProps(node, result) {
		if (node.arguments.length > 0 && t.isObjectExpression(node.arguments[0])) {
			const propsObj = node.arguments[0];

			for (const prop of propsObj.properties) {
				if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
					const propName = prop.key.name;
					const propConfig = this.extractPropConfig(prop.value);
					if (propConfig) {
						result.props[propName] = propConfig;
					}
				}
			}
		}
	}

	/**
	 * 提取单个prop的配置
	 */
	extractPropConfig(propValue) {
		if (!t.isObjectExpression(propValue)) {
			return null;
		}

		// 默认所有 props 都是可选的（非必填），符合 Vue 的默认行为
		const config = {
			type: "any",
			required: false
		};

		for (const prop of propValue.properties) {
			if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;

			const key = prop.key.name;

			if (key === "type") {
				config.type = this.extractTypeFromValue(prop.value);
			} else if (key === "required" && t.isBooleanLiteral(prop.value)) {
				// 只有显式设置 required: true 时才设为必填
				config.required = prop.value.value;
			}
		}

		return config;
	}

	/**
	 * 从AST值节点提取类型信息
	 */
	extractTypeFromValue(node) {
		// 处理基础类型
		if (t.isIdentifier(node)) {
			switch (node.name) {
				case "String":
					return "string";
				case "Number":
					return "number";
				case "Boolean":
					return "boolean";
				case "Object":
					return "object";
				case "Array":
					return "any[]";
				case "Function":
					return "Function";
				default:
					return node.name;
			}
		}

		// 处理 String as PropType<Type> 形式
		if (t.isTSAsExpression(node) && t.isTSTypeReference(node.typeAnnotation)) {
			const typeRef = node.typeAnnotation;
			if (t.isIdentifier(typeRef.typeName) && typeRef.typeName.name === "PropType") {
				if (typeRef.typeParameters && typeRef.typeParameters.params.length > 0) {
					return this.extractTSType(typeRef.typeParameters.params[0]);
				}
			}
		}

		return "any";
	}

	/**
	 * 提取TypeScript类型
	 */
	extractTSType(tsType) {
		if (t.isTSStringKeyword(tsType)) return "string";
		if (t.isTSNumberKeyword(tsType)) return "number";
		if (t.isTSBooleanKeyword(tsType)) return "boolean";
		if (t.isTSObjectKeyword(tsType)) return "object";
		if (t.isTSAnyKeyword(tsType)) return "any";

		// 处理联合类型
		if (t.isTSUnionType(tsType)) {
			const types = tsType.types.map((type) => {
				if (t.isTSLiteralType(type) && t.isStringLiteral(type.literal)) {
					return `"${type.literal.value}"`;
				}
				return this.extractTSType(type);
			});
			return types.join(" | ");
		}

		// 处理字面量类型
		if (t.isTSLiteralType(tsType)) {
			if (t.isStringLiteral(tsType.literal)) {
				return `"${tsType.literal.value}"`;
			}
			if (t.isNumericLiteral(tsType.literal)) {
				return tsType.literal.value.toString();
			}
			if (t.isBooleanLiteral(tsType.literal)) {
				return tsType.literal.value.toString();
			}
		}

		// 处理类型引用
		if (t.isTSTypeReference(tsType) && t.isIdentifier(tsType.typeName)) {
			const typeName = tsType.typeName.name;
			
			// 处理泛型类型，如 Array<T>
			if (tsType.typeParameters && tsType.typeParameters.params.length > 0) {
				const typeArgs = tsType.typeParameters.params.map(param => this.extractTSType(param));
				if (typeName === "Array") {
					return `${typeArgs[0]}[]`;
				}
				return `${typeName}<${typeArgs.join(", ")}>`;
			}
			
			return typeName;
		}

		// 处理数组类型: T[]
		if (t.isTSArrayType(tsType)) {
			const elementType = this.extractTSType(tsType.elementType);
			return `${elementType}[]`;
		}

		return "any";
	}

	/**
	 * 提取defineEmits中的事件定义
	 */
	extractDefineEmits(node, result) {
		// 处理类型化的emits: defineEmits<{ eventName: [type] }>()
		if (node.typeParameters && node.typeParameters.params.length > 0) {
			const typeParam = node.typeParameters.params[0];
			if (t.isTSTypeLiteral(typeParam)) {
				for (const member of typeParam.members) {
					if (t.isTSPropertySignature(member)) {
						let eventName = "";

						// 处理字符串键名和标识符键名
						if (t.isStringLiteral(member.key)) {
							eventName = member.key.value;
						} else if (t.isIdentifier(member.key)) {
							eventName = member.key.name;
						}

						if (eventName && member.typeAnnotation) {
							const eventType = this.extractEmitType(
								member.typeAnnotation.typeAnnotation
							);
							result.emits[eventName] = eventType;
						}
					}
				}
			}
		}

		// 处理数组形式的emits: defineEmits(['event1', 'event2'])
		else if (node.arguments.length > 0 && t.isArrayExpression(node.arguments[0])) {
			const events = node.arguments[0].elements;
			for (const event of events) {
				if (t.isStringLiteral(event)) {
					result.emits[event.value] = "any";
				}
			}
		}
	}

	/**
	 * 提取emit事件的参数类型
	 */
	extractEmitType(tsType) {
		// 处理元组类型: [value: string]
		if (t.isTSTupleType(tsType)) {
			const elementTypes = tsType.elementTypes.map((elem) => {
				if (t.isTSNamedTupleMember(elem)) {
					// 处理命名元组成员: value: string
					return `${elem.label.name}: ${this.extractTSType(elem.elementType)}`;
				}
				return this.extractTSType(elem);
			});
			return elementTypes.join(", ");
		}

		// 处理其他类型
		return this.extractTSType(tsType);
	}

	/**
	 * 提取defineSlots中的插槽定义
	 */
	extractDefineSlots(node, result) {
		// 处理类型化的slots: defineSlots<{ slotName: { propName: type } }>()
		if (node.typeParameters && node.typeParameters.params.length > 0) {
			const typeParam = node.typeParameters.params[0];
			if (t.isTSTypeLiteral(typeParam)) {
				for (const member of typeParam.members) {
					let slotName = "";
					
					// 处理方法签名: slotName(props: { ... }): any
					if (t.isTSMethodSignature(member)) {
						if (t.isIdentifier(member.key)) {
							slotName = member.key.name;
						} else if (t.isStringLiteral(member.key)) {
							slotName = member.key.value;
						}

						if (slotName && member.parameters && member.parameters.length > 0) {
							const firstParam = member.parameters[0];
							if (firstParam.typeAnnotation) {
								const slotTypeInfo = this.extractSlotTypeWithDependencies(
									firstParam.typeAnnotation.typeAnnotation
								);
								result.slots[slotName] = slotTypeInfo.type;
								
								// 收集外部类型依赖
								if (slotTypeInfo.externalTypes.length > 0) {
									if (!result.slotExternalTypes) {
										result.slotExternalTypes = new Set();
									}
									slotTypeInfo.externalTypes.forEach(type => 
										result.slotExternalTypes.add(type)
									);
								}
							}
						}
					}
					// 处理属性签名: slotName: { propName: type }
					else if (t.isTSPropertySignature(member)) {
						// 处理字符串键名和标识符键名
						if (t.isStringLiteral(member.key)) {
							slotName = member.key.value;
						} else if (t.isIdentifier(member.key)) {
							slotName = member.key.name;
						}

						if (slotName && member.typeAnnotation) {
							const slotTypeInfo = this.extractSlotTypeWithDependencies(
								member.typeAnnotation.typeAnnotation
							);
							result.slots[slotName] = slotTypeInfo.type;
							
							// 收集外部类型依赖
							if (slotTypeInfo.externalTypes.length > 0) {
								if (!result.slotExternalTypes) {
									result.slotExternalTypes = new Set();
								}
								slotTypeInfo.externalTypes.forEach(type => 
									result.slotExternalTypes.add(type)
								);
							}
						}
					}
				}
			}
		}
	}

	/**
	 * 提取插槽的参数类型
	 */
	extractSlotType(tsType) {
		// 处理对象类型: { item: string, index: number }
		if (t.isTSTypeLiteral(tsType)) {
			const props = [];
			for (const member of tsType.members) {
				if (t.isTSPropertySignature(member)) {
					let propName = "";
					let propType = "any";

					// 获取属性名
					if (t.isIdentifier(member.key)) {
						propName = member.key.name;
					} else if (t.isStringLiteral(member.key)) {
						propName = member.key.value;
					}

					// 获取属性类型
					if (member.typeAnnotation && member.typeAnnotation.typeAnnotation) {
						propType = this.extractTSType(member.typeAnnotation.typeAnnotation);
					}

					if (propName) {
						props.push(`${propName}: ${propType}`);
					}
				}
			}
			return props.length > 0 ? `{ ${props.join(", ")} }` : "{}";
		}

		// 处理其他类型
		return this.extractTSType(tsType);
	}

	/**
	 * 提取插槽的参数类型，同时收集外部类型依赖
	 */
	extractSlotTypeWithDependencies(tsType) {
		const externalTypes = new Set();

		const extractTypeWithDeps = (type) => {
			// 处理对象类型: { item: string, index: number }
			if (t.isTSTypeLiteral(type)) {
				const props = [];
				for (const member of type.members) {
					if (t.isTSPropertySignature(member)) {
						let propName = "";
						let propType = "any";

						// 获取属性名
						if (t.isIdentifier(member.key)) {
							propName = member.key.name;
						} else if (t.isStringLiteral(member.key)) {
							propName = member.key.value;
						}

						// 获取属性类型并收集外部依赖
						if (member.typeAnnotation && member.typeAnnotation.typeAnnotation) {
							const typeInfo = this.extractTSTypeWithDependencies(
								member.typeAnnotation.typeAnnotation
							);
							propType = typeInfo.type;
							// 收集外部类型依赖
							typeInfo.externalTypes.forEach(t => externalTypes.add(t));
						}

						if (propName) {
							props.push(`${propName}: ${propType}`);
						}
					}
				}
				return props.length > 0 ? `{ ${props.join(", ")} }` : "{}";
			}

			// 处理其他类型
			const typeInfo = this.extractTSTypeWithDependencies(type);
			typeInfo.externalTypes.forEach(t => externalTypes.add(t));
			return typeInfo.type;
		};

		const slotType = extractTypeWithDeps(tsType);

		return {
			type: slotType,
			externalTypes: Array.from(externalTypes)
		};
	}

	/**
	 * 提取defineExpose中的导出定义
	 */
	extractDefineExpose(node, result) {
		if (node.arguments.length > 0 && t.isObjectExpression(node.arguments[0])) {
			const exposeObj = node.arguments[0];
			for (const prop of exposeObj.properties) {
				if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
					result.expose[prop.key.name] = "any"; // 可以进一步分析类型
				}
			}
		}
	}

	/**
	 * 提取类型别名声明（如PassThrough类型及其相关类型）
	 */
	extractTypeAlias(node, result) {
		if (t.isIdentifier(node.id)) {
			const typeName = node.id.name;

			// 提取PassThrough类型及其相关的嵌套类型
			if (typeName === "PassThrough" || typeName.endsWith("PassThrough")) {
				const typeDefinition = this.extractTSTypeDefinition(node.typeAnnotation);
				result.passThroughTypes[typeName] = typeDefinition;
			}
		}
	}

	/**
	 * 提取TypeScript类型定义，同时收集外部类型依赖
	 */
	extractTSTypeDefinition(tsType) {
		if (t.isTSTypeLiteral(tsType)) {
			const properties = {};
			const externalTypes = new Set(); // 收集外部类型依赖

			for (const member of tsType.members) {
				if (t.isTSPropertySignature(member)) {
					let propName = "";
					let propType = "any";
					let isOptional = false;

					// 获取属性名
					if (t.isIdentifier(member.key)) {
						propName = member.key.name;
					} else if (t.isStringLiteral(member.key)) {
						propName = member.key.value;
					}

					// 检查是否可选
					isOptional = !!member.optional;

					// 获取属性类型，同时收集外部类型依赖
					if (member.typeAnnotation && member.typeAnnotation.typeAnnotation) {
						const typeInfo = this.extractTSTypeWithDependencies(
							member.typeAnnotation.typeAnnotation
						);
						propType = typeInfo.type;
						// 收集外部类型依赖
						typeInfo.externalTypes.forEach((type) => externalTypes.add(type));
					}

					if (propName) {
						properties[propName] = {
							type: propType,
							optional: isOptional
						};
					}
				}
			}

			return {
				properties,
				externalTypes: Array.from(externalTypes)
			};
		}

		return {
			properties: {},
			externalTypes: []
		};
	}

	/**
	 * 提取TypeScript类型，同时收集外部类型依赖
	 */
	extractTSTypeWithDependencies(tsType) {
		const externalTypes = new Set();

		const extractType = (type) => {
			if (t.isTSStringKeyword(type)) return "string";
			if (t.isTSNumberKeyword(type)) return "number";
			if (t.isTSBooleanKeyword(type)) return "boolean";
			if (t.isTSObjectKeyword(type)) return "object";
			if (t.isTSAnyKeyword(type)) return "any";

			// 处理联合类型
			if (t.isTSUnionType(type)) {
				const types = type.types.map((unionType) => {
					if (t.isTSLiteralType(unionType) && t.isStringLiteral(unionType.literal)) {
						return `"${unionType.literal.value}"`;
					}
					return extractType(unionType);
				});
				return types.join(" | ");
			}

			// 处理字面量类型
			if (t.isTSLiteralType(type)) {
				if (t.isStringLiteral(type.literal)) {
					return `"${type.literal.value}"`;
				}
				if (t.isNumericLiteral(type.literal)) {
					return type.literal.value.toString();
				}
				if (t.isBooleanLiteral(type.literal)) {
					return type.literal.value.toString();
				}
			}

			// 处理类型引用
			if (t.isTSTypeReference(type) && t.isIdentifier(type.typeName)) {
				const typeName = type.typeName.name;
				// 检查是否为外部类型（不是基础类型）
				if (
					![
						"String",
						"Number",
						"Boolean",
						"Object",
						"Array",
						"Function",
						"Date"
					].includes(typeName)
				) {
					externalTypes.add(typeName);
				}
				return typeName;
			}

			// 处理数组类型
			if (t.isTSArrayType(type)) {
				const elementType = extractType(type.elementType);
				return `${elementType}[]`;
			}

			return "any";
		};

		const type = extractType(tsType);

		return {
			type,
			externalTypes: Array.from(externalTypes)
		};
	}

	/**
	 * 扫描指定目录下的所有uvue文件
	 * 只扫描与父目录同名的主组件文件，忽略辅助组件
	 */
	scanUvueFiles(directory) {
		const results = [];

		function scanDir(dir) {
			if (!fs.existsSync(dir)) return;

			const items = fs.readdirSync(dir);

			for (const item of items) {
				const fullPath = path.join(dir, item);
				const stat = fs.statSync(fullPath);

				if (stat.isDirectory()) {
					scanDir(fullPath);
				} else if (item.endsWith(".uvue")) {
					// 只包含与父目录同名的 .uvue 文件（主组件）
					const parentDirName = path.basename(path.dirname(fullPath));
					const fileNameWithoutExt = path.basename(item, ".uvue");
					
					if (parentDirName === fileNameWithoutExt) {
						results.push(fullPath);
					}
				}
			}
		}

		scanDir(directory);
		return results;
	}

	/**
	 * 生成TypeScript类型定义
	 */
	generateTypeDefinitions(components) {
		// 收集所有需要的类型导入
		const allImports = this.collectAllImports(components);

		// 收集所有组件的PassThrough类型导入
		const passThroughImports = this.collectPassThroughImports(components);

		let typeDefinitions = "";

		// 生成import语句
		if (allImports.length > 0) {
			for (const importInfo of allImports) {
				const importPath = this.resolveImportPath(importInfo.source);
				if (importInfo.isTypeOnly) {
					typeDefinitions += `import type { ${importInfo.types.join(
						", "
					)} } from "${importPath}";\n`;
				} else {
					typeDefinitions += `import { type ${importInfo.types.join(
						", type "
					)} } from "${importPath}";\n`;
				}
			}
			typeDefinitions += "\n";
		}

		// 生成组件Props类型导入语句
		if (passThroughImports.length > 0) {
			for (const importInfo of passThroughImports) {
				typeDefinitions += `import type { ${importInfo.types.join(", ")} } from "${importInfo.source}";\n`;
			}
			typeDefinitions += "\n";
		}

		// 不再在这里生成组件Props接口，而是从单独的props.ts文件导入

		// 检查是否有插槽定义，如果有则导入 SlotsType
		let hasSlotsDefinition = false;
		for (const component of components) {
			if (component && Object.keys(component.slots).length > 0) {
				hasSlotsDefinition = true;
				break;
			}
		}

		// 不再需要导入 DefineProps，改用 import('vue').DefineComponent

		// 生成全局组件声明
		typeDefinitions += `export {};\n\n`;
		typeDefinitions += `// 自动生成的组件全局类型声明\n`;
		typeDefinitions += `declare module "vue" {\n`;
		typeDefinitions += `\texport interface GlobalComponents {\n`;

		for (const component of components) {
			if (!component) continue;

			const propsType = this.generatePropsTypeName(component.name);
			
			// 使用参考 cl-list 的写法格式
			typeDefinitions += `\t\t"${component.name}": (typeof import('./components/${component.name}/${component.name}.uvue')['default']) & import('vue').DefineComponent<${propsType}>;\n`;
		}

		typeDefinitions += `\t}\n`;
		typeDefinitions += `}\n`;

		return typeDefinitions;
	}

	/**
	 * 收集所有组件的类型导入（不包括组件自身的Props导入）
	 */
	collectAllImports(components) {
		const importMap = new Map();

		for (const component of components) {
			if (!component || !component.imports) continue;

			for (const importInfo of component.imports) {
				// 跳过组件自身的props文件导入，这些将在collectPassThroughImports中处理
				if (importInfo.source.includes("props") || importInfo.source.includes("../cl-")) {
					continue;
				}

				const key = importInfo.source;
				if (importMap.has(key)) {
					// 合并类型导入
					const existing = importMap.get(key);
					const allTypes = [...new Set([...existing.types, ...importInfo.types])];
					importMap.set(key, {
						source: importInfo.source,
						types: allTypes,
						isTypeOnly: existing.isTypeOnly && importInfo.isTypeOnly
					});
				} else {
					importMap.set(key, { ...importInfo });
				}
			}
		}

		return Array.from(importMap.values());
	}

	/**
	 * 收集所有组件的Props类型导入
	 */
	collectPassThroughImports(components) {
		const propsImports = [];

		for (const component of components) {
			if (!component) continue;

			const propsTypeName = this.generatePropsTypeName(component.name);
			const componentPath = `./components/${component.name}/props`;

			const typesToImport = [propsTypeName];

			// 如果组件有PassThrough类型，也需要导入
			if (component.passThroughTypes && Object.keys(component.passThroughTypes).length > 0) {
				// 添加主要的PassThrough类型
				if (component.passThroughTypes.PassThrough) {
					const passThroughTypeName = this.generatePassThroughTypeName(component.name);
					typesToImport.push(passThroughTypeName);
				}

				// 添加所有嵌套的PassThrough类型
				for (const originalTypeName of Object.keys(component.passThroughTypes)) {
					if (originalTypeName === "PassThrough") continue;

					const nestedTypeName = this.generateNestedPassThroughTypeName(
						component.name,
						originalTypeName
					);
					typesToImport.push(nestedTypeName);
				}
			}

			propsImports.push({
				source: componentPath,
				types: typesToImport
			});
		}

		return propsImports;
	}

	/**
	 * 解析导入路径，将相对路径转换为从index.d.ts的相对路径
	 */
	resolveImportPath(originalPath) {
		// 原始路径是从组件文件的相对路径，比如 "../../types"
		// 需要转换为从 index.d.ts 的相对路径，即 "./types"

		if (originalPath.startsWith("../../types")) {
			return "./types";
		}

		// 处理其他相对路径
		if (originalPath.startsWith("../")) {
			// 计算相对层级
			const levels = (originalPath.match(/\.\.\//g) || []).length;
			if (levels >= 2) {
				// 减少两级，因为index.d.ts在uni_modules/cool-ui/目录下
				const remaining = originalPath.replace(/\.\.\//g, "");
				return `./${remaining}`;
			}
		}

		return originalPath;
	}

	/**
	 * 生成Props接口
	 */
	generatePropsInterface(component) {
		const propsTypeName = this.generatePropsTypeName(component.name);

		if (Object.keys(component.props).length === 0) {
			return `export interface ${propsTypeName} {}`;
		}

		let propsInterface = `export interface ${propsTypeName} {\n`;

		for (const [propName, propInfo] of Object.entries(component.props)) {
			const optional = propInfo.required ? "" : "?";
			let propType = propInfo.type;

			// 如果是 pt 或 passThrough 属性，且存在对应的 PassThrough 类型定义，使用组件特定的 PassThrough 类型
			if (
				(propName === "pt" || propName === "passThrough") &&
				component.passThroughTypes &&
				component.passThroughTypes.PassThrough
			) {
				propType = this.generatePassThroughTypeName(component.name);
			}

			propsInterface += `\t${propName}${optional}: ${propType};\n`;
		}

		propsInterface += `}`;
		return propsInterface;
	}

	/**
	 * 生成Props类型名称
	 */
	generatePropsTypeName(componentName) {
		const pascalName = componentName
			.split("-")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join("");
		return `${pascalName}Props`;
	}

	/**
	 * 生成PassThrough类型名称
	 */
	generatePassThroughTypeName(componentName) {
		const pascalName = componentName
			.split("-")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join("");
		return `${pascalName}PassThrough`;
	}

	/**
	 * 生成嵌套PassThrough类型名称
	 */
	generateNestedPassThroughTypeName(componentName, originalTypeName) {
		const pascalName = componentName
			.split("-")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join("");

		// 移除原类型名中的"PassThrough"后缀（如果存在）
		const baseTypeName = originalTypeName.replace(/PassThrough$/, "");
		return `${pascalName}${baseTypeName}PassThrough`;
	}

	/**
	 * 获取类型生成顺序（依赖关系排序）
	 */
	getTypeGenerationOrder(passThroughTypes, componentName) {
		const typeNames = Object.keys(passThroughTypes);

		// 简单排序：先生成嵌套类型，再生成主类型
		return typeNames
			.filter((name) => name !== "PassThrough")
			.concat(typeNames.filter((name) => name === "PassThrough"));
	}

	/**
	 * 替换类型引用中的嵌套类型为组件特定的类型名
	 */
	replaceNestedTypeReferences(typeString, componentName, passThroughTypes) {
		let result = typeString;

		// 替换所有已知的嵌套类型引用
		for (const originalTypeName of Object.keys(passThroughTypes)) {
			if (originalTypeName === "PassThrough") continue;

			const newTypeName = this.generateNestedPassThroughTypeName(
				componentName,
				originalTypeName
			);

			// 使用词边界来确保精确匹配
			const regex = new RegExp(`\\b${originalTypeName}\\b`, "g");
			result = result.replace(regex, newTypeName);
		}

		return result;
	}

	/**
	 * 生成Emits类型
	 */
	generateEmitsType(emits) {
		const emitEntries = Object.entries(emits).map(([name, type]) => {
			return `"${name}": (${type}) => void`;
		});
		return `{ ${emitEntries.join("; ")} }`;
	}

	/**
	 * 生成Slots类型
	 */
	generateSlotsType(slots) {
		const slotEntries = Object.entries(slots).map(([name, type]) => {
			// 将插槽参数类型转换为对象属性格式
			// 从 "{ item: ClListItem }" 转换为 "{ item: ClListItem }"
			const slotProps = type.replace(/props:\s*/, '');
			return `${name}: ${slotProps}`;
		});
		return `{}, {}, {}, {}, {}, {}, SlotsType<{ ${slotEntries.join(", ")} }>`;
	}

	/**
	 * 为单个组件生成props.ts文件
	 */
	generateComponentPropsFile(component) {
		const componentDir = path.dirname(component.filePath);
		const propsFilePath = path.join(componentDir, "props.ts");

		let propsContent = "";

		// 收集需要导入的类型
		const imports = new Map();

		// 添加组件原有的导入
		if (component.imports && component.imports.length > 0) {
			for (const importInfo of component.imports) {
				const importPath = this.resolveImportPathForComponent(
					importInfo.source,
					componentDir
				);
				if (!imports.has(importPath)) {
					imports.set(importPath, new Set());
				}
				importInfo.types.forEach((type) => imports.get(importPath).add(type));
			}
		}

		// 收集PassThrough类型中的外部类型依赖
		if (component.passThroughTypes && component.passThroughTypes.PassThrough) {
			const passThroughDef = component.passThroughTypes.PassThrough;
			if (passThroughDef.externalTypes && passThroughDef.externalTypes.length > 0) {
				// 为PassThrough类型的外部依赖寻找对应的导入路径
				const externalTypesToImport = this.mapExternalTypesToImports(
					passThroughDef.externalTypes,
					component.imports
				);

				for (const [importPath, types] of externalTypesToImport) {
					const resolvedPath = this.resolveImportPathForComponent(
						importPath,
						componentDir
					);
					if (!imports.has(resolvedPath)) {
						imports.set(resolvedPath, new Set());
					}
					types.forEach((type) => imports.get(resolvedPath).add(type));
				}
			}
		}

		// 收集slots中的外部类型依赖
		if (component.slotExternalTypes && component.slotExternalTypes.size > 0) {
			const slotExternalTypes = Array.from(component.slotExternalTypes);
			const externalTypesToImport = this.mapExternalTypesToImports(
				slotExternalTypes,
				component.imports
			);

			for (const [importPath, types] of externalTypesToImport) {
				const resolvedPath = this.resolveImportPathForComponent(
					importPath,
					componentDir
				);
				if (!imports.has(resolvedPath)) {
					imports.set(resolvedPath, new Set());
				}
				types.forEach((type) => imports.get(resolvedPath).add(type));
			}
		}

		// 生成import语句
		if (imports.size > 0) {
			for (const [importPath, types] of imports) {
				const typeList = Array.from(types);
				propsContent += `import type { ${typeList.join(", ")} } from "${importPath}";\n`;
			}
			propsContent += "\n";
		}

		// 生成PassThrough类型定义（如果存在）
		if (component.passThroughTypes && Object.keys(component.passThroughTypes).length > 0) {
			// 首先生成所有嵌套的PassThrough类型
			const typeOrder = this.getTypeGenerationOrder(
				component.passThroughTypes,
				component.name
			);

			for (const originalTypeName of typeOrder) {
				if (originalTypeName === "PassThrough") continue; // 主要类型最后处理

				const typeDef = component.passThroughTypes[originalTypeName];
				const newTypeName = this.generateNestedPassThroughTypeName(
					component.name,
					originalTypeName
				);

				propsContent += `export type ${newTypeName} = {\n`;

				for (const [propName, propInfo] of Object.entries(typeDef.properties)) {
					const optional = propInfo.optional ? "?" : "";
					let propType = propInfo.type;

					// 替换嵌套类型引用为组件特定的类型名
					propType = this.replaceNestedTypeReferences(
						propType,
						component.name,
						component.passThroughTypes
					);

					propsContent += `\t${propName}${optional}: ${propType};\n`;
				}

				propsContent += `};\n\n`;
			}

			// 最后生成主要的PassThrough类型
			if (component.passThroughTypes.PassThrough) {
				const passThroughTypeName = this.generatePassThroughTypeName(component.name);
				const passThroughDef = component.passThroughTypes.PassThrough;

				propsContent += `export type ${passThroughTypeName} = {\n`;

				for (const [propName, propInfo] of Object.entries(passThroughDef.properties)) {
					const optional = propInfo.optional ? "?" : "";
					let propType = propInfo.type;

					// 替换嵌套类型引用为组件特定的类型名
					propType = this.replaceNestedTypeReferences(
						propType,
						component.name,
						component.passThroughTypes
					);

					propsContent += `\t${propName}${optional}: ${propType};\n`;
				}

				propsContent += `};\n\n`;
			}
		}

		// 生成props类型定义
		const propsTypeName = this.generatePropsTypeName(component.name);

		propsContent += `export type ${propsTypeName} = {\n`;

		// 添加固定的 className 参数
		propsContent += `\tclassName?: string;\n`;

		// 添加组件定义的其他 props
		for (const [propName, propInfo] of Object.entries(component.props)) {
			const optional = propInfo.required ? "" : "?";
			let propType = propInfo.type;

			// 如果是 pt 或 passThrough 属性，且存在对应的 PassThrough 类型定义，使用组件特定的 PassThrough 类型
			if (
				(propName === "pt" || propName === "passThrough") &&
				component.passThroughTypes &&
				component.passThroughTypes.PassThrough
			) {
				propType = this.generatePassThroughTypeName(component.name);
			}

			propsContent += `\t${propName}${optional}: ${propType};\n`;
		}

		propsContent += `};\n`;

		// 写入文件
		fs.writeFileSync(propsFilePath, propsContent, "utf-8");

		return propsFilePath;
	}

	/**
	 * 将外部类型映射到它们的导入路径
	 */
	mapExternalTypesToImports(externalTypes, componentImports) {
		const typeToImportMap = new Map();

		// 根据组件的导入信息建立类型到导入路径的映射
		if (componentImports && componentImports.length > 0) {
			for (const importInfo of componentImports) {
				for (const type of importInfo.types) {
					if (!typeToImportMap.has(importInfo.source)) {
						typeToImportMap.set(importInfo.source, new Set());
					}
					typeToImportMap.get(importInfo.source).add(type);
				}
			}
		}

		const result = new Map();

		// 将外部类型映射到对应的导入路径
		for (const externalType of externalTypes) {
			for (const [importPath, types] of typeToImportMap) {
				if (types.has(externalType)) {
					if (!result.has(importPath)) {
						result.set(importPath, []);
					}
					result.get(importPath).push(externalType);
					break;
				}
			}
		}

		return result;
	}

	/**
	 * 解析组件目录的导入路径
	 */
	resolveImportPathForComponent(originalPath, componentDir) {
		// 如果是相对路径，保持相对路径
		if (originalPath.startsWith("./") || originalPath.startsWith("../")) {
			return originalPath;
		}

		// 如果是绝对路径（从项目根目录），转换为相对路径
		if (originalPath.startsWith("@/")) {
			// 计算从组件目录到项目根目录的相对路径
			const relativePath = path.relative(componentDir, process.cwd());
			return originalPath.replace("@/", relativePath + "/");
		}

		return originalPath;
	}

	/**
	 * 主要生成函数
	 */
	async generate() {
		try {
			console.log("开始解析uvue文件类型定义...");

			// 扫描组件目录
			const componentsDir = path.join(__dirname, "../components");
			const uvueFiles = this.scanUvueFiles(componentsDir);

			console.log(`找到 ${uvueFiles.length} 个uvue文件`);

			// 解析每个文件
			const components = [];
			for (const filePath of uvueFiles) {
				console.log(`解析文件: ${path.relative(process.cwd(), filePath)}`);
				const componentInfo = this.parseUvueFile(filePath);
				if (componentInfo) {
					components.push(componentInfo);
					console.log(`  - 组件名: ${componentInfo.name}`);
					console.log(`  - Props: ${Object.keys(componentInfo.props).length} 个`);
					console.log(`  - Emits: ${Object.keys(componentInfo.emits).length} 个`);
					console.log(`  - Slots: ${Object.keys(componentInfo.slots).length} 个`);
					console.log(`  - Expose: ${Object.keys(componentInfo.expose).length} 个`);
				}
			}

			// 生成每个组件的单独props.ts文件
			console.log("\n开始生成单独的props.ts文件...");
			const generatedPropsFiles = [];
			for (const component of components) {
				if (component) {
					try {
						const propsFilePath = this.generateComponentPropsFile(component);
						generatedPropsFiles.push(propsFilePath);
						console.log(`  - 已生成: ${path.relative(process.cwd(), propsFilePath)}`);
					} catch (error) {
						console.error(
							`生成 ${component.name} 的props.ts文件时出错:`,
							error.message
						);
					}
				}
			}

			// 生成类型定义
			const typeDefinitions = this.generateTypeDefinitions(components);

			// 写入文件
			const outputPath = path.join(__dirname, "../index.d.ts");

			fs.writeFileSync(outputPath, typeDefinitions, "utf-8");

			console.log(`\n类型定义已生成到:`);
			console.log(`  - ${path.relative(process.cwd(), outputPath)}`);
			console.log(`总共处理了 ${components.length} 个组件`);
			console.log(`生成了 ${generatedPropsFiles.length} 个props.ts文件`);
		} catch (error) {
			console.error("生成类型定义时出错:", error);
			process.exit(1);
		}
	}
}

// 执行生成
if (require.main === module) {
	const parser = new UvueTypeParser();
	parser.generate();
}

module.exports = UvueTypeParser;
