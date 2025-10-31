import { UTSHarmony } from '@dcloudio/uni-app-x-runtime';
import { systemShare } from '@kit.ShareKit';
import { uniformTypeDescriptor as utd } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { fileUri } from '@kit.CoreFileKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * 分享类型枚举
 */
enum ShareType {
	TEXT = "text", // 纯文本分享
	IMAGE = "image", // 图片分享
	VIDEO = "video", // 视频分享
	AUDIO = "audio", // 音频分享
	FILE = "file", // 文件分享
	LINK = "link" // 链接分享
}

/**
 * 根据文件路径获取统一数据类型标识符
 * @param filePath 文件路径
 * @param defaultType 默认数据类型
 * @returns 统一数据类型标识符
 */
function getUtdTypeByPath(filePath: string, defaultType: string): string {
	const ext = filePath?.split('.')?.pop()?.toLowerCase() ?? '';
	if (ext === '') {
		return defaultType;
	}
	return utd.getUniformDataTypeByFilenameExtension('.' + ext, defaultType);
}

/**
 * 创建图片分享数据
 * @param url 图片路径（支持本地路径和网络 URL）
 * @param title 分享标题
 * @param summary 分享描述
 * @returns 分享数据对象
 */
function createImageShareData(url: string, title: string, summary: string): systemShare.SharedData | null {
	if (url === '') {
		return null;
	}

	const filePath = UTSHarmony.getResourcePath(url);
	const utdTypeId = getUtdTypeByPath(filePath, utd.UniformDataType.IMAGE);

	return new systemShare.SharedData({
		utd: utdTypeId,
		uri: fileUri.getUriFromPath(filePath),
		title: title,
		description: summary,
	});
}

/**
 * 创建视频分享数据
 * @param url 视频路径（支持本地路径和网络 URL）
 * @param title 分享标题
 * @param summary 分享描述
 * @returns 分享数据对象
 */
function createVideoShareData(url: string, title: string, summary: string): systemShare.SharedData | null {
	if (url === '') {
		return null;
	}

	const filePath = UTSHarmony.getResourcePath(url);
	const utdTypeId = getUtdTypeByPath(filePath, utd.UniformDataType.VIDEO);

	return new systemShare.SharedData({
		utd: utdTypeId,
		uri: fileUri.getUriFromPath(filePath),
		title: title,
		description: summary,
	});
}

/**
 * 创建音频分享数据
 * @param url 音频路径（支持本地路径和网络 URL）
 * @param title 分享标题
 * @param summary 分享描述
 * @returns 分享数据对象
 */
function createAudioShareData(url: string, title: string, summary: string): systemShare.SharedData | null {
	if (url === '') {
		return null;
	}

	const filePath = UTSHarmony.getResourcePath(url);
	const utdTypeId = getUtdTypeByPath(filePath, utd.UniformDataType.AUDIO);

	return new systemShare.SharedData({
		utd: utdTypeId,
		uri: fileUri.getUriFromPath(filePath),
		title: title,
		description: summary,
	});
}

/**
 * 创建文件分享数据
 * @param filePath 文件路径（支持本地路径和网络 URL）
 * @param title 分享标题
 * @param summary 分享描述
 * @returns 分享数据对象
 */
function createFileShareData(filePath: string, title: string, summary: string): systemShare.SharedData | null {
	if (filePath === '') {
		return null;
	}

	const resourcePath = UTSHarmony.getResourcePath(filePath);
	const ext = resourcePath?.split('.')?.pop()?.toLowerCase() ?? '';

	// 根据文件扩展名确定数据类型
	let utdType = utd.UniformDataType.FILE;
	let utdTypeId = '';

	// 支持常见的文件类型
	switch (ext) {
		case 'zip':
		case 'rar':
		case '7z':
		case 'tar':
		case 'gz':
			utdType = utd.UniformDataType.ARCHIVE;
			break;
		case 'pdf':
			utdType = utd.UniformDataType.PDF;
			break;
		case 'doc':
		case 'docx':
			utdType = utd.UniformDataType.WORD_DOC;
			break;
		case 'xls':
		case 'xlsx':
			utdType = utd.UniformDataType.EXCEL;
			break;
		case 'ppt':
		case 'pptx':
			utdType = utd.UniformDataType.PPT;
			break;
		default:
			utdType = utd.UniformDataType.FILE;
			break;
	}

	utdTypeId = utd.getUniformDataTypeByFilenameExtension('.' + ext, utdType);

	return new systemShare.SharedData({
		utd: utdTypeId,
		uri: fileUri.getUriFromPath(resourcePath),
		title: title,
		description: summary,
	});
}

/**
 * 创建链接分享数据
 * @param url 链接地址
 * @param title 分享标题
 * @param summary 分享描述
 * @returns 分享数据对象
 */
function createLinkShareData(url: string, title: string, summary: string): systemShare.SharedData {
	return new systemShare.SharedData({
		utd: utd.UniformDataType.HYPERLINK,
		title: title,
		content: url,
		description: summary
	});
}

/**
 * 创建文本分享数据
 * @param title 分享标题
 * @param summary 分享内容
 * @returns 分享数据对象
 */
function createTextShareData(title: string, summary: string): systemShare.SharedData {
	return new systemShare.SharedData({
		utd: utd.UniformDataType.TEXT,
		title: title,
		content: summary
	});
}

/**
 * 系统分享功能
 * @param options 分享参数
 * @param options.type 分享类型: text(文本) | image(图片) | video(视频) | audio(音频) | file(文件) | link(链接)
 * @param options.title 分享标题
 * @param options.summary 分享描述/内容
 * @param options.url 资源路径（图片/视频/音频/文件路径或链接地址，支持本地路径和网络 URL）
 * @param options.success 成功回调
 * @param options.fail 失败回调
 */
export function share(type: string, title: string, summary: string, url: string, success: () => void, fail: (error: string) => void): void {
	// 获取UI上下文
	const uiContext: UIContext = UTSHarmony.getCurrentWindow()?.getUIContext();
	const context: common.UIAbilityContext = uiContext.getHostContext() as common.UIAbilityContext;

	// 根据分享类型创建分享数据
	let shareData: systemShare.SharedData | null = null;
	let errorMsg = '';

	switch (type) {
		case ShareType.IMAGE:
			shareData = createImageShareData(url, title, summary);
			errorMsg = '图片路径不能为空';
			break;

		case ShareType.VIDEO:
			shareData = createVideoShareData(url, title, summary);
			errorMsg = '视频路径不能为空';
			break;

		case ShareType.AUDIO:
			shareData = createAudioShareData(url, title, summary);
			errorMsg = '音频路径不能为空';
			break;

		case ShareType.FILE:
			shareData = createFileShareData(url, title, summary);
			errorMsg = '文件路径不能为空';
			break;

		case ShareType.LINK:
			shareData = createLinkShareData(url, title, summary);
			break;

		default:
			// 默认为文本分享
			shareData = createTextShareData(title, summary);
			errorMsg = '分享内容不能为空';
			break;
	}

	// 验证分享数据
	if (shareData === null) {
		fail(errorMsg);
		return;
	}

	// 创建分享控制器
	const controller: systemShare.ShareController = new systemShare.ShareController(shareData);

	// 显示分享面板，配置分享选项
	controller.show(context, {
		selectionMode: systemShare.SelectionMode.SINGLE,     // 单选模式
		previewMode: systemShare.SharePreviewMode.DEFAULT,   // 默认预览模式
	})
		.then(() => {
			// 分享成功
			success();
		})
		.catch((error: BusinessError) => {
			// 分享失败，返回错误信息
			const errorMessage = error?.message ?? '分享失败';
			fail(errorMessage);
		});
}