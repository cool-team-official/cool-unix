const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

// 清理所有临时文件
function cleanupTempDir() {
	const tempDir = path.join(".cool", "temp");
	if (fs.existsSync(tempDir)) {
		try {
			fs.rmSync(tempDir, { recursive: true, force: true });
		} catch (error) {
			console.warn(`❌ 清理临时目录失败: ${ tempDir }`, error);
		}
	}
}

// 确保临时目录存在
function ensureTempDir() {
	const tempDir = path.join(".cool", "temp");
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir, { recursive: true });
	}
}

// 创建icons目录和子目录
function ensureDistDir(folderName = "") {
	const iconsPath = folderName ? path.join("icons", folderName) : "icons";
	if (!fs.existsSync(iconsPath)) {
		fs.mkdirSync(iconsPath, { recursive: true });
	}
}

// 读取zip文件列表
function getZipFiles() {
	const iconsDir = path.join(".cool", "icons");
	if (!fs.existsSync(iconsDir)) {
		console.error(`❌ 目录不存在: ${ iconsDir }`);
		return [];
	}

	return fs.readdirSync(iconsDir).filter((item) => {
		const filePath = path.join(iconsDir, item);
		const stats = fs.statSync(filePath);
		return stats.isFile() && item.endsWith(".zip");
	});
}

// 解压zip文件到临时目录
function extractZipFile(zipPath, folderName) {
	try {
		const zip = new AdmZip(zipPath);
		const tempDir = path.join(".cool", "temp", folderName);

		// 确保临时目录存在
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}

		// 解压到临时目录
		zip.extractAllTo(tempDir, true);

		// 检查是否有额外的顶层文件夹
		const extractedItems = fs.readdirSync(tempDir);

		// 如果只有一个项目且是文件夹，则可能是额外的包装文件夹
		if (extractedItems.length === 1) {
			const singleItem = extractedItems[0];
			const singleItemPath = path.join(tempDir, singleItem);
			const stats = fs.statSync(singleItemPath);

			if (stats.isDirectory()) {
				// 检查这个文件夹是否包含我们需要的文件
				const innerItems = fs.readdirSync(singleItemPath);
				const hasIconFiles = innerItems.some(
					(item) =>
						item.endsWith(".ttf") || item.endsWith(".json") || item.endsWith(".css")
				);

				if (hasIconFiles) {
					return singleItemPath;
				}
			}
		}

		return tempDir;
	} catch (error) {
		console.error(`❌ 解压失败: ${ zipPath }`, error);
		return null;
	}
}

// 将TTF文件转换为base64
function ttfToBase64(ttfPath) {
	try {
		const ttfBuffer = fs.readFileSync(ttfPath);
		return ttfBuffer.toString("base64");
	} catch (error) {
		console.error(`❌ 读取TTF文件失败: ${ ttfPath }`, error);
		return null;
	}
}

// 生成TypeScript文件
function generateTypeScript(originalFolderName, camelCaseName, iconData, iconPrefix) {
	const tsContent = `export const ${ camelCaseName } = {\n${ iconData
		.map((item) => `\t"${ iconPrefix }${ item.name }": "${ item.unicode }"`)
		.join(",\n") }\n};\n`;

	const outputPath = path.join("icons", originalFolderName, "index.ts");
	fs.writeFileSync(outputPath, tsContent);
}

// 生成SCSS文件
function generateSCSS(originalFolderName, base64Data) {
	const scssContent = `@font-face {\n\tfont-family: "${ toCamelCase(originalFolderName) }";\n\tsrc: url("data:font/ttf;base64,${ base64Data }") format("woff");\n}\n`;

	const outputPath = path.join("icons", originalFolderName, "index.scss");
	fs.writeFileSync(outputPath, scssContent);
}

// 从CSS文件提取图标数据（用于remixicon等）
function extractIconsFromCSS(cssPath) {
	try {
		const cssContent = fs.readFileSync(cssPath, "utf8");
		const iconData = [];

		// 匹配CSS中的图标规则，例如：.ri-home-line:before { content: "\ee2b"; }
		const regex = /\.ri-([^:]+):before\s*{\s*content:\s*"\\([^"]+)"/g;
		let match;

		while ((match = regex.exec(cssContent)) !== null) {
			const iconName = match[1];
			const unicode = match[2];

			iconData.push({
				name: iconName,
				unicode: unicode
			});
		}

		return iconData;
	} catch (error) {
		console.error(`❌ 读取CSS文件失败: ${ cssPath }`, error);
		return [];
	}
}

// 读取和处理图标数据
function processIconData(jsonPath) {
	try {
		const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
		return jsonData.glyphs.map((item) => ({
			name: item.font_class,
			unicode: item.unicode
		}));
	} catch (error) {
		console.error(`❌ 读取JSON文件失败: ${ jsonPath }`, error);
		return [];
	}
}

// 读取iconfont图标前缀
function getIconPrefix(jsonPath) {
	try {
		const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
		return jsonData.css_prefix_text;
	} catch (error) {
		console.error(`❌ 读取JSON文件失败: ${jsonPath}`, error);
		return [];
	}
}

// 将连字符转换为驼峰命名的函数
function toCamelCase(str) {
	return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// 处理单个zip文件
function processZipFile(zipFileName) {
	const originalFolderName = path.basename(zipFileName, ".zip");
	const folderName = toCamelCase(originalFolderName); // 转换为驼峰命名用于变量名
	const zipPath = path.join(".cool", "icons", zipFileName);

	// 解压zip文件 (使用原始文件夹名称)
	const tempDir = extractZipFile(zipPath, originalFolderName);
	if (!tempDir) {
		return null;
	}

	// 图标库名称
	const ptName = ["iconfont", "remixicon"];

	// 获取文件路径
	const getFilePath = (ext) => {
		let filePath = null;
		for (const name of ptName) {
			const tempPath = path.join(tempDir, `${ name }.${ ext }`);
			if (fs.existsSync(tempPath)) {
				filePath = tempPath;
				break;
			}
		}
		return filePath;
	};

	// 在解压后的目录中查找文件
	const jsonPath = getFilePath("json");
	const cssPath = getFilePath("css");
	const ttfPath = getFilePath("ttf");

	if (!ttfPath) {
		console.warn(`⚠️跳过 ${ folderName }: 缺少 TTF 文件`);
		return null;
	}

	let iconData = [];

	let iconPrefix = "";

	// 优先使用JSON文件
	if (jsonPath) {
		iconData = processIconData(jsonPath);
		if (originalFolderName !== "iconfont") {
			iconPrefix = getIconPrefix(jsonPath);
		}
	}
	// 如果没有则尝试CSS文件
	else if (cssPath) {
		iconData = extractIconsFromCSS(cssPath);
	} else {
		console.warn(`⚠️ 跳过 ${ folderName }: 缺少 ${ jsonPath } 或 ${ cssPath }`);
		return null;
	}

	if (iconData.length === 0) {
		console.warn(`⚠️ ${ folderName }: 没有找到图标数据`);
		return null;
	}

	console.log(`✅ ${ zipFileName } 找到 ${ iconData.length } 个图标`);

	// 转换TTF为base64
	const base64Data = ttfToBase64(ttfPath);
	if (!base64Data) {
		console.error(`❌ ${ folderName }: TTF转换失败`);
		return null;
	}

	// 为该文件夹创建icons子目录 (使用原始文件夹名称)
	ensureDistDir(originalFolderName);

	// 生成TypeScript文件 (使用驼峰命名作为变量名，原始名称作为路径)
	generateTypeScript(originalFolderName, folderName, iconData, iconPrefix);

	// 生成SCSS文件 (使用原始名称作为路径和字体名称)
	generateSCSS(originalFolderName, base64Data);

	return { originalName: originalFolderName, camelName: folderName };
}

// 生成主index.ts文件
function generateIndexTS(actualFolders) {
	const imports = actualFolders
		.map((folder) => {
			const camelName = toCamelCase(folder);
			return `import { ${ camelName } } from "./${ folder }";`;
		})
		.join("\n");

	const exports = `export const icons = {\n${ actualFolders
		.map((folder) => `\t${ toCamelCase(folder) }`)
		.join(",\n") }\n};\n`;

	const content = `${ imports }\n\n${ exports }`;
	fs.writeFileSync("icons/index.ts", content);
}

// 生成主index.scss文件
function generateIndexSCSS(actualFolders) {
	const imports = actualFolders.map((folder) => `@import "./${ folder }/index.scss";`).join("\n");

	fs.writeFileSync("icons/index.scss", imports + "\n");
}

// 扫描icons目录下的实际文件夹
function getActualIconFolders() {
	const iconsDir = "icons";
	if (!fs.existsSync(iconsDir)) {
		return [];
	}

	return fs.readdirSync(iconsDir).filter((item) => {
		const itemPath = path.join(iconsDir, item);
		const stats = fs.statSync(itemPath);
		return stats.isDirectory();
	});
}

// 主函数
function main() {
	console.log("🚀 开始处理字体文件...\n");

	// 确保临时目录存在
	ensureTempDir();

	// 确保icons目录存在
	ensureDistDir();

	try {
		// 获取所有zip文件
		const zipFiles = getZipFiles();

		// 处理每个zip文件
		const processedFolders = [];
		for (const zipFile of zipFiles) {
			const result = processZipFile(zipFile);
			if (result) {
				processedFolders.push(result);
			}
		}

		// 扫描icons目录下的实际文件夹
		const actualFolders = getActualIconFolders();

		if (actualFolders.length > 0) {
			// 生成主index文件
			generateIndexTS(actualFolders);
			generateIndexSCSS(actualFolders);
		}

		if (processedFolders.length > 0) {
			const folderNames = processedFolders.map((f) =>
				typeof f === "string" ? f : f.originalName
			);
			console.log(
				`\n🎉 成功处理了 ${ processedFolders.length } 个字体包: ${ folderNames.join(", ") }`
			);
		}
	} catch (error) {
		console.error("❌ 脚本执行出错:", error);
	} finally {
		cleanupTempDir();
	}
}

// 运行脚本
if (require.main === module) {
	main();
}
