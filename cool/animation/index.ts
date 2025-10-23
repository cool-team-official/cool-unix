// #ifdef APP-ANDROID
import Choreographer from "android.view.Choreographer"; // Android 帧同步器，提供垂直同步信号
import FrameCallback from "android.view.Choreographer.FrameCallback"; // 帧回调接口
import Long from "kotlin.Long"; // Kotlin Long 类型
// #endif

/**
 * 缓动函数类型定义
 */
export type EasingFunction = (progress : number) => number;

/**
 * 动画属性配置
 */
export type AnimationAttribute = {
	/** 起始值 */
	fromValue : string;
	/** 结束值 */
	toValue : string;
	/** 单位 (px, %, deg等) */
	unit : string;
	/** 当前值 */
	currentValue : string;
	/** 当前进度 (0-1) */
	progress : number;
	/** 属性名称 */
	propertyName : string;
};

/**
 * 动画配置选项
 */
export type AnimationOptions = {
	/** 动画持续时间(毫秒) */
	duration ?: number;
	/** 循环次数 (-1为无限循环) */
	loop ?: number;
	/** 是否往返播放 */
	alternate ?: boolean;
	/** 是否按属性顺序依次执行动画 */
	sequential ?: boolean;
	/** 缓动函数名称 */
	timingFunction ?: string;
	/** 自定义贝塞尔曲线参数 */
	bezier ?: number[];
	/** 动画完成回调 */
	complete ?: () => void;
	/** 动画开始回调 */
	start ?: () => void;
	/** 每帧回调 */
	frame ?: (progress : number) => void;
};

// 贝塞尔曲线计算常量
const BEZIER_SPLINE_SIZE = 11; // 样本点数量，用于预计算优化
const BEZIER_SAMPLE_STEP = 1.0 / (BEZIER_SPLINE_SIZE - 1.0); // 样本步长

/**
 * 贝塞尔曲线系数A
 * 三次贝塞尔曲线的三次项系数
 */
function getBezierCoefficientA(x1 : number, x2 : number) : number {
	return 1.0 - 3.0 * x2 + 3.0 * x1; // B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃ 中的 t³ 系数
}

/**
 * 贝塞尔曲线系数B
 * 三次贝塞尔曲线的二次项系数
 */
function getBezierCoefficientB(x1 : number, x2 : number) : number {
	return 3.0 * x2 - 6.0 * x1; // 二次项系数
}

/**
 * 贝塞尔曲线系数C
 * 三次贝塞尔曲线的一次项系数
 */
function getBezierCoefficientC(x1 : number) : number {
	return 3.0 * x1; // 一次项系数
}

/**
 * 计算贝塞尔曲线值
 * 使用霍纳法则提高计算效率
 * @param t 时间参数 (0-1)
 * @param x1 控制点1的x坐标
 * @param x2 控制点2的x坐标
 */
function calculateBezierValue(t : number, x1 : number, x2 : number) : number {
	const a = getBezierCoefficientA(x1, x2); // 获取三次项系数
	const b = getBezierCoefficientB(x1, x2); // 获取二次项系数
	const c = getBezierCoefficientC(x1); // 获取一次项系数
	return ((a * t + b) * t + c) * t; // 霍纳法则：((at + b)t + c)t，减少乘法运算
}

/**
 * 计算贝塞尔曲线斜率
 * 对贝塞尔曲线求导得到斜率函数
 * @param t 时间参数 (0-1)
 * @param x1 控制点1的x坐标
 * @param x2 控制点2的x坐标
 */
function getBezierSlope(t : number, x1 : number, x2 : number) : number {
	const a = getBezierCoefficientA(x1, x2); // 三次项系数
	const b = getBezierCoefficientB(x1, x2); // 二次项系数
	const c = getBezierCoefficientC(x1); // 一次项系数
	return 3.0 * a * t * t + 2.0 * b * t + c; // 导数：3at² + 2bt + c
}

/**
 * 二分法求解贝塞尔曲线参数
 * 用于根据x值反推t参数，适用于斜率较小的情况
 * @param targetX 目标x值
 * @param startT 起始t值
 * @param endT 结束t值
 * @param x1 控制点1的x坐标
 * @param x2 控制点2的x坐标
 */
function binarySearchBezierT(
	targetX : number,
	startT : number,
	endT : number,
	x1 : number,
	x2 : number
) : number {
	let currentX : number; // 当前计算的x值
	let currentT : number; // 当前的t参数
	let iterations = 0; // 迭代次数计数器
	const maxIterations = 10; // 最大迭代次数，避免无限循环
	const precision = 0.0000001; // 精度要求

	do {
		currentT = startT + (endT - startT) / 2.0; // 取中点
		currentX = calculateBezierValue(currentT, x1, x2) - targetX; // 计算误差
		if (currentX > 0.0) {
			// 如果当前x值大于目标值
			endT = currentT; // 缩小右边界
		} else {
			// 如果当前x值小于目标值
			startT = currentT; // 缩小左边界
		}
		iterations++; // 增加迭代计数
	} while (Math.abs(currentX) > precision && iterations < maxIterations); // 直到精度满足或达到最大迭代次数

	return currentT; // 返回找到的t参数
}

/**
 * 牛顿-拉夫逊法求解贝塞尔曲线参数
 * 适用于斜率较大的情况，收敛速度快
 * @param targetX 目标x值
 * @param initialGuess 初始猜测值
 * @param x1 控制点1的x坐标
 * @param x2 控制点2的x坐标
 */
function newtonRaphsonBezierT(
	targetX : number,
	initialGuess : number,
	x1 : number,
	x2 : number
) : number {
	let t = initialGuess; // 当前t值，从初始猜测开始
	const maxIterations = 4; // 最大迭代次数，牛顿法收敛快

	for (let i = 0; i < maxIterations; i++) {
		const slope = getBezierSlope(t, x1, x2); // 计算当前点的斜率
		if (slope == 0.0) {
			// 如果斜率为0，避免除零错误
			return t;
		}
		const currentX = calculateBezierValue(t, x1, x2) - targetX; // 计算当前误差
		t = t - currentX / slope; // 牛顿法迭代公式：t_new = t - f(t)/f'(t)
	}
	return t; // 返回收敛后的t值
}

/**
 * 创建贝塞尔缓动函数
 * 根据四个控制点坐标生成缓动函数，类似CSS的cubic-bezier
 * @param x1 控制点1的x坐标 (0-1)
 * @param y1 控制点1的y坐标 (0-1)
 * @param x2 控制点2的x坐标 (0-1)
 * @param y2 控制点2的y坐标 (0-1)
 */
function createBezierEasing(x1 : number, y1 : number, x2 : number, y2 : number) : EasingFunction | null {
	// 验证控制点坐标范围，x坐标必须在0-1之间
	if (!(0 <= x1 && x1 <= 1 && 0 <= x2 && x2 <= 1)) {
		return null; // 参数无效时返回null
	}

	const sampleValues : number[] = []; // 预计算的样本值数组

	// 预计算样本值以提高性能，仅对非线性曲线进行预计算
	if (x1 != y1 || x2 != y2) {
		// 如果不是线性函数
		for (let i = 0; i < BEZIER_SPLINE_SIZE; i++) {
			// 计算等间距的样本点，用于快速查找
			sampleValues.push(calculateBezierValue(i * BEZIER_SAMPLE_STEP, x1, x2));
		}
	}

	/**
	 * 根据x值获取对应的t参数
	 * 使用预计算样本进行快速查找和插值
	 * @param x 输入的x值 (0-1)
	 */
	function getTParameterForX(x : number) : number {
		let intervalStart = 0.0; // 区间起始位置
		let currentSample = 1; // 当前样本索引
		const lastSample = BEZIER_SPLINE_SIZE - 1; // 最后一个样本索引

		// 找到x值所在的区间，线性搜索预计算的样本
		for (; currentSample != lastSample && sampleValues[currentSample] <= x; currentSample++) {
			intervalStart += BEZIER_SAMPLE_STEP; // 移动区间起始位置
		}
		currentSample--; // 回退到正确的区间

		// 线性插值获得初始猜测值，提高后续求解精度
		const dist =
			(x - sampleValues[currentSample]) /
			(sampleValues[currentSample + 1] - sampleValues[currentSample]); // 计算在区间内的相对位置
		const initialGuess = intervalStart + dist * BEZIER_SAMPLE_STEP; // 计算初始猜测的t值
		const initialSlope = getBezierSlope(initialGuess, x1, x2); // 计算初始点的斜率

		// 根据斜率选择合适的求解方法
		if (initialSlope >= 0.001) {
			// 斜率足够大时使用牛顿法
			return newtonRaphsonBezierT(x, initialGuess, x1, x2);
		} else if (initialSlope == 0.0) {
			// 斜率为0时直接返回
			return initialGuess;
		}
		// 斜率太小时使用二分法，更稳定
		return binarySearchBezierT(x, intervalStart, intervalStart + BEZIER_SAMPLE_STEP, x1, x2);
	}

	// 返回缓动函数，这是最终的缓动函数接口
	return function (progress : number) : number {
		// 线性情况直接返回，优化性能
		if (x1 == y1 && x2 == y2) {
			return progress;
		}
		// 边界情况处理，避免计算误差
		if (progress == 0.0 || progress == 1.0) {
			return progress;
		}
		// 计算贝塞尔曲线值：先根据progress(x)找到对应的t，再计算y值
		return calculateBezierValue(getTParameterForX(progress), y1, y2);
	};
}

/**
 * 颜色工具函数：标准化颜色值格式
 * 处理不同格式的颜色输入，确保返回有效的颜色值
 */
function getDefaultColor(colorValue : string) : string {
	// 简化的颜色处理，实际项目中可能需要更完整的颜色转换
	if (colorValue.startsWith("#")) {
		// 十六进制颜色格式
		return colorValue;
	}
	if (colorValue.startsWith("rgb")) {
		// RGB或RGBA颜色格式
		return colorValue;
	}
	// 默认返回黑色，作为兜底处理
	return "#000000";
}

/**
 * 十六进制颜色转RGB对象
 * 将#RRGGBB或#RRGGBBAA格式的颜色转换为{r,g,b,a}对象，用于颜色动画插值
 * @param hex 十六进制颜色值，如"#FF0000"（6位）或"#FF0000B3"（8位带透明度）
 * @returns 包含r,g,b,a属性的颜色对象
 */
function hexToRgb(hex : string) : UTSJSONObject {
	// 移除 # 号
	const cleanHex = hex.replace('#', '');

	if (cleanHex.length == 6) {
		// 6位十六进制：#FFFFFF
		const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
		if (result != null) {
			// 解析成功
			return {
				r: parseInt(result[1] ?? "0", 16), // 红色分量，16进制转10进制
				g: parseInt(result[2] ?? "0", 16), // 绿色分量
				b: parseInt(result[3] ?? "0", 16), // 蓝色分量
				a: 1.0 // 透明度，默认不透明
			} as UTSJSONObject;
		}
	} else if (cleanHex.length == 8) {
		// 8位十六进制：#FFFFFFB3
		const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
		if (result != null) {
			return {
				r: parseInt(result[1] ?? "0", 16),
				g: parseInt(result[2] ?? "0", 16),
				b: parseInt(result[3] ?? "0", 16),
				a: parseInt(result[4] ?? "FF", 16) / 255 // 将0-255转换为0-1
			} as UTSJSONObject;
		}
	}

	// 解析失败返回黑色
	return {
		r: 0,
		g: 0,
		b: 0,
		a: 1.0
	} as UTSJSONObject;
}

/**
 * RGB/RGBA颜色转RGB对象
 * 将rgb(r,g,b)或rgba(r,g,b,a)格式的颜色转换为{r,g,b,a}对象，用于颜色动画插值
 * @param rgba RGB/RGBA颜色值，如"rgb(255,0,0)"或"rgba(255,0,0,0.5)"
 * @returns 包含r,g,b,a属性的颜色对象
 */
function rgbaToRgb(rgba : string) : UTSJSONObject {
	// 匹配 rgb(r,g,b) 或 rgba(r,g,b,a)
	const match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
	if (match != null) {
		return {
			r: parseInt(match[1] ?? "0"),
			g: parseInt(match[2] ?? "0"),
			b: parseInt(match[3] ?? "0"),
			a: (match[4] != null) ? parseFloat(match[4]!) : 1.0
		} as UTSJSONObject;
	}

	// 解析失败返回黑色
	return {
		r: 0,
		g: 0,
		b: 0,
		a: 1.0
	} as UTSJSONObject;
}

/**
 * 通用颜色格式转RGB对象
 * 自动识别颜色格式并转换为{r,g,b,a}对象，支持十六进制、RGB、RGBA格式
 * @param colorValue 颜色值，支持格式：
 *   - 十六进制：#FFFFFF、#FFFFFFB3
 *   - RGB：rgb(255,255,255)
 *   - RGBA：rgba(255,255,255,0.7)
 * @returns 包含r,g,b,a属性的颜色对象
 */
function colorToRgb(colorValue : string) : UTSJSONObject {
	const trimmed = colorValue.trim();

	if (trimmed.startsWith("#")) {
		return hexToRgb(trimmed);
	} else if (trimmed.startsWith("rgb")) {
		return rgbaToRgb(trimmed);
	}

	// 默认返回黑色
	return {
		r: 0,
		g: 0,
		b: 0,
		a: 1.0
	} as UTSJSONObject;
}

/**
 * 高性能动画引擎类
 * 支持多平台的流畅动画效果，提供丰富的缓动函数和动画控制
 */
export class AnimationEngine {
	/** 预定义缓动函数映射，存储常用的贝塞尔曲线参数 */
	private readonly easingPresets = new Map<string, number[]>([
		["linear", [0.0, 0.0, 1.0, 1.0]], // 线性缓动
		["ease", [0.25, 0.1, 0.25, 1.0]], // 默认缓动
		["easeIn", [0.42, 0.0, 1.0, 1.0]], // 加速进入
		["easeOut", [0.0, 0.0, 0.58, 1.0]], // 减速退出
		["easeInOut", [0.42, 0.0, 0.58, 1.0]], // 先加速后减速
		["easeInQuad", [0.55, 0.085, 0.68, 0.53]], // 二次方加速
		["easeOutQuad", [0.25, 0.46, 0.45, 0.94]], // 二次方减速
		["easeInOutQuad", [0.455, 0.03, 0.515, 0.955]], // 二次方先加速后减速
		["easeInCubic", [0.55, 0.055, 0.675, 0.19]], // 三次方加速
		["easeOutCubic", [0.215, 0.61, 0.355, 1.0]], // 三次方减速
		["easeInOutCubic", [0.645, 0.045, 0.355, 1.0]], // 三次方先加速后减速
		["easeInQuart", [0.895, 0.03, 0.685, 0.22]], // 四次方加速
		["easeOutQuart", [0.165, 0.84, 0.44, 1.0]], // 四次方减速
		["easeInOutQuart", [0.77, 0.0, 0.175, 1.0]], // 四次方先加速后减速
		["easeInQuint", [0.755, 0.05, 0.855, 0.06]], // 五次方加速
		["easeOutQuint", [0.23, 1.0, 0.32, 1.0]], // 五次方减速
		["easeInOutQuint", [0.86, 0.0, 0.07, 1.0]], // 五次方先加速后减速
		["easeInSine", [0.47, 0.0, 0.745, 0.715]], // 正弦加速
		["easeOutSine", [0.39, 0.575, 0.565, 1.0]], // 正弦减速
		["easeInOutSine", [0.445, 0.05, 0.55, 0.95]], // 正弦先加速后减速
		["easeInExpo", [0.95, 0.05, 0.795, 0.035]], // 指数加速
		["easeOutExpo", [0.19, 1.0, 0.22, 1.0]], // 指数减速
		["easeInOutExpo", [1.0, 0.0, 0.0, 1.0]], // 指数先加速后减速
		["easeInCirc", [0.6, 0.04, 0.98, 0.335]], // 圆形加速
		["easeOutCirc", [0.075, 0.82, 0.165, 1.0]], // 圆形减速
		["easeInOutBack", [0.68, -0.55, 0.265, 1.55]] // 回弹效果
	]);

	/** 目标DOM元素，动画作用的对象 */
	private targetElement : UniElement | null = null;

	/** 动画持续时间(毫秒)，默认500ms */
	private animationDuration : number = 500;

	/** 动画是否正在运行，用于控制动画循环 */
	private isRunning : boolean = false;

	/** 动画是否暂停，暂停时保留当前进度 */
	private isPaused : boolean = false;

	/** 当前动画进度 (0-1)，用于恢复暂停的动画 */
	private currentProgress : number = 0;

	/** 是否反向播放，影响动画方向 */
	private isReversed : boolean = false;

	/** 是否往返播放模式，控制动画是否来回播放 */
	private isAlternate : boolean = false;
	/** 往返播放时是否处于反向状态 */
	private isAlternateReversed : boolean = false;

	/** 循环播放次数 (-1为无限循环) */
	private loopCount : number = 1;
	/** 当前已完成的循环次数 */
	private currentLoop : number = 0;

	/** 动画是否正在停止，用于提前终止动画 */
	private isStopping : boolean = true;

	/** 当前执行的属性索引(顺序执行模式)，用于控制属性依次动画 */
	private currentAttributeIndex : number = 0;

	/** 回调函数，提供动画生命周期钩子 */
	private onComplete : () => void = () => { }; // 动画完成回调
	private onStart : () => void = () => { }; // 动画开始回调
	private onFrame : (progress : number) => void = () => { }; // 每帧回调

	/** 动画属性列表，存储所有要动画的CSS属性 */
	private animationAttributes : AnimationAttribute[] = [];

	/** 动画开始时间戳，用于计算动画进度 */
	private startTimestamp : number = 0;

	/** 当前使用的缓动函数，将线性进度转换为缓动进度 */
	private currentEasingFunction : EasingFunction | null = null;

	/** 是否按属性顺序依次执行动画，而非并行执行 */
	private isSequentialMode : boolean = false;

	// 平台相关的动画控制器
	// Android平台使用Choreographer提供高性能动画
	// #ifdef APP-ANDROID
	private choreographer : Choreographer | null = null; // Android系统帧同步器
	private frameCallback : FrameCallback | null = null; // 帧回调处理器
	// #endif

	// iOS/小程序平台使用定时器
	// #ifdef APP-IOS
	private displayLinkTimer : number = 0; // iOS定时器ID
	// #endif

	// Web平台使用requestAnimationFrame
	private animationFrameId : number | null = null; // 动画帧ID

	/**
	 * 创建动画引擎实例
	 * 初始化动画引擎，设置目标元素和动画配置
	 * @param element 目标DOM元素，null时仅做计算不应用样式
	 * @param options 动画配置选项，包含持续时间、缓动函数等
	 */
	constructor(element : UniElement | null, options : AnimationOptions) {
		this.targetElement = element; // 保存目标元素引用

		// 设置动画参数，使用选项值或默认值
		this.animationDuration =
			options.duration != null ? options.duration : this.animationDuration; // 设置动画持续时间
		this.loopCount = options.loop != null ? options.loop : this.loopCount; // 设置循环次数
		this.isAlternate = options.alternate != null ? options.alternate : this.isAlternate; // 设置往返播放
		this.isSequentialMode =
			options.sequential != null ? options.sequential : this.isSequentialMode; // 设置顺序执行模式

		// 设置缓动函数，优先使用预定义函数
		if (options.timingFunction != null) {
			const easingParams = this.easingPresets.get(options.timingFunction); // 查找预定义缓动参数
			if (easingParams != null) {
				// 根据贝塞尔参数创建缓动函数
				this.currentEasingFunction = createBezierEasing(
					easingParams[0], // x1坐标
					easingParams[1], // y1坐标
					easingParams[2], // x2坐标
					easingParams[3] // y2坐标
				);
			}
		}

		// 自定义贝塞尔曲线，会覆盖预定义函数
		if (options.bezier != null && options.bezier.length == 4) {
			this.currentEasingFunction = createBezierEasing(
				options.bezier[0], // 自定义x1坐标
				options.bezier[1], // 自定义y1坐标
				options.bezier[2], // 自定义x2坐标
				options.bezier[3] // 自定义y2坐标
			);
		}

		// 设置回调函数，提供动画生命周期钩子
		if (options.complete != null) {
			this.onComplete = options.complete; // 动画完成回调
		}
		if (options.start != null) {
			this.onStart = options.start; // 动画开始回调
		}
		if (options.frame != null) {
			this.onFrame = options.frame; // 每帧更新回调
		}
	}

	/**
	 * 从样式值中提取单位
	 * 解析CSS值中的单位部分，用于动画计算
	 * @param value 样式值，如 "100px", "50%"
	 * @param propertyName CSS属性名称，用于判断是否需要默认单位
	 * @returns 单位字符串
	 */
	private extractUnit(value ?: string, propertyName ?: string) : string {
		if (value == null) return "px"; // 默认单位为px
		const unit = value.replace(/[\d|\-|\+|\.]/g, ""); // 移除数字、负号、正号、小数点，保留单位

		// opacity、z-index等属性无需单位
		if (propertyName == "opacity" || propertyName == "z-index") {
			return ""; // 返回空字符串表示无单位
		}

		return unit == "" ? "px" : unit; // 如果没有单位则默认为px
	}

	/**
	 * 添加自定义缓动函数
	 * 向引擎注册新的缓动函数，可在后续动画中使用
	 * @param name 缓动函数名称
	 * @param bezierParams 贝塞尔曲线参数 [x1, y1, x2, y2]
	 */
	addCustomEasing(name : string, bezierParams : number[]) : AnimationEngine {
		if (bezierParams.length == 4) {
			// 验证参数数量
			this.easingPresets.set(name, bezierParams); // 添加到预设映射中
		}
		return this; // 返回自身支持链式调用
	}

	/**
	 * 设置动画反向播放
	 * 控制动画从结束值向起始值播放
	 * @param reverse 是否反向播放，null表示切换当前状态
	 */
	setReverse(reverse : boolean | null = null) : AnimationEngine {
		if (reverse != null) {
			this.isReversed = reverse; // 设置指定状态
		} else {
			this.isReversed = !this.isReversed; // 切换当前状态
		}
		return this; // 支持链式调用
	}

	/**
	 * 设置循环播放次数
	 * 控制动画重复执行的次数
	 * @param count 循环次数，-1表示无限循环
	 */
	setLoopCount(count : number) : AnimationEngine {
		this.loopCount = count; // 设置循环次数
		return this; // 支持链式调用
	}

	/**
	 * 设置动画持续时间
	 * 控制动画从开始到结束的总时长
	 * @param duration 持续时间(毫秒)
	 */
	setDuration(duration : number) : AnimationEngine {
		this.animationDuration = duration; // 设置动画持续时间
		return this; // 支持链式调用
	}

	/**
	 * 设置往返播放模式
	 * 控制动画是否在每次循环时反向播放
	 * @param alternate 是否往返播放
	 */
	setAlternate(alternate : boolean) : AnimationEngine {
		this.isAlternate = alternate; // 设置往返播放标志
		return this; // 支持链式调用
	}

	/**
	 * 设置顺序执行模式
	 * 控制多个属性是同时动画还是依次动画
	 * @param sequential 是否按属性顺序依次执行
	 */
	setSequential(sequential : boolean) : AnimationEngine {
		this.isSequentialMode = sequential; // 设置执行模式
		return this; // 支持链式调用
	}

	/**
	 * 添加动画属性
	 * 向动画引擎添加一个CSS属性的动画配置
	 * @param propertyName CSS属性名称
	 * @param fromValue 起始值(支持数字+单位，如"100px"、"50%")
	 * @param toValue 结束值(单位必须与起始值一致)
	 * @param unique 是否唯一，true时同名属性会被替换
	 */
	addAttribute(
		propertyName : string,
		fromValue : string,
		toValue : string,
		unique : boolean = true
	) : AnimationEngine {
		const isColor = this.isColorProperty(propertyName); // 检测是否为颜色属性
		const unit = isColor ? "" : this.extractUnit(fromValue, propertyName); // 提取单位

		// 根据属性类型处理值
		const processedFromValue = isColor
			? getDefaultColor(fromValue) // 颜色属性标准化
			: parseFloat(fromValue).toString(); // 数值属性提取数字
		const processedToValue = isColor
			? getDefaultColor(toValue) // 颜色属性标准化
			: parseFloat(toValue).toString(); // 数值属性提取数字

		// 查找是否已存在同名属性，用于决定是替换还是新增
		let existingIndex = this.animationAttributes.findIndex(
			(attr : AnimationAttribute) : boolean => attr.propertyName == propertyName
		);

		if (!unique) {
			existingIndex = -1; // 强制添加新属性，不替换
		}

		// 创建新的动画属性对象
		const newAttribute : AnimationAttribute = {
			fromValue: processedFromValue, // 处理后的起始值
			toValue: processedToValue, // 处理后的结束值
			unit: unit, // 单位
			progress: 0, // 初始进度为0
			currentValue: processedFromValue, // 当前值初始化为起始值
			propertyName: propertyName // 属性名称
		};

		if (existingIndex == -1) {
			this.animationAttributes.push(newAttribute); // 添加新属性
		} else {
			this.animationAttributes[existingIndex] = newAttribute; // 替换现有属性
		}

		return this; // 支持链式调用
	}

	/**
	 * 快捷方法：添加变换属性
	 */
	transform(property : string, fromValue : string, toValue : string) : AnimationEngine {
		return this.addAttribute(property, fromValue, toValue);
	}

	/**
	 * 快捷方法：添加位移动画
	 */
	translate(fromX : string, fromY : string, toX : string, toY : string) : AnimationEngine {
		this.addAttribute("translateX", fromX, toX);
		this.addAttribute("translateY", fromY, toY);
		return this;
	}

	/**
	 * 添加X轴位移动画
	 * @param fromX 起始X位置，可以使用"current"表示当前位置
	 * @param toX 结束X位置
	 * @returns
	 */
	translateX(fromX : string, toX : string) : AnimationEngine {
		return this.addAttribute("translateX", fromX, toX);
	}

	/**
	 * 添加Y轴位移动画
	 * @param fromY 起始Y位置，可以使用"current"表示当前位置
	 * @param toY 结束Y位置
	 * @returns
	 */
	translateY(fromY : string, toY : string) : AnimationEngine {
		return this.addAttribute("translateY", fromY, toY);
	}

	/**
	 * 快捷方法：添加缩放动画
	 */
	scale(fromScale : string, toScale : string) : AnimationEngine {
		return this.addAttribute("scale", fromScale, toScale);
	}

	/**
	 * 快捷方法：添加旋转动画
	 */
	rotate(fromDegree : string, toDegree : string) : AnimationEngine {
		return this.addAttribute("rotate", fromDegree, toDegree);
	}

	/**
	 * 快捷方法：添加透明度动画
	 */
	opacity(fromOpacity : string, toOpacity : string) : AnimationEngine {
		return this.addAttribute("opacity", fromOpacity, toOpacity);
	}

	/**
	 * 线性插值计算
	 * 根据进度在两个数值之间进行插值，用于计算动画中间值
	 * @param startValue 起始值
	 * @param endValue 结束值
	 * @param progress 进度 (0-1)
	 */
	private interpolateValue(startValue : number, endValue : number, progress : number) : number {
		return startValue + (endValue - startValue) * progress; // 线性插值公式：start + (end - start) * progress
	}

	/**
	 * 判断是否为颜色相关属性
	 * 检测CSS属性名是否与颜色相关，用于特殊的颜色动画处理
	 * @param propertyName 属性名称
	 */
	private isColorProperty(propertyName : string) : boolean {
		return (
			propertyName.indexOf("background") > -1 || // 背景颜色相关
			propertyName.indexOf("color") > -1 || // 文字颜色相关
			propertyName.indexOf("border-color") > -1 || // 边框颜色相关
			propertyName.indexOf("shadow") > -1 // 阴影颜色相关
		);
	}

	/**
	 * 判断是否为Transform相关属性
	 * 检测属性名是否为transform相关的CSS属性
	 * @param propertyName CSS属性名称
	 * @returns 是否为transform属性
	 */
	private isTransformProperty(propertyName : string) : boolean {
		return (
			propertyName == "scaleX" || // X轴缩放
			propertyName == "scaleY" || // Y轴缩放
			propertyName == "scale" || // 等比缩放
			propertyName == "rotateX" || // X轴旋转
			propertyName == "rotateY" || // Y轴旋转
			propertyName == "rotate" || // Z轴旋转
			propertyName == "translateX" || // X轴位移
			propertyName == "translateY" || // Y轴位移
			propertyName == "translate" // 双轴位移
		);
	}

	/**
	 * 设置元素样式属性
	 * 根据属性类型应用相应的样式值，支持transform、颜色、普通数值属性
	 * @param propertyName 属性名称
	 * @param currentValue 当前值
	 * @param unit 单位
	 * @param progress 动画进度
	 * @param attribute 动画属性对象
	 */
	private setElementProperty(
		propertyName : string,
		currentValue : number,
		unit : string,
		progress : number,
		attribute : AnimationAttribute
	) : void {
		if (this.targetElement == null) return; // 没有目标元素时直接返回

		const element = this.targetElement; // 获取目标元素引用
		const valueStr = currentValue.toFixed(2); // 数值保留两位小数

		// #ifdef MP
		if (element.style == null) {
			return;
		}
		// #endif

		// Transform 相关属性处理，使用CSS transform属性
		switch (propertyName) {
			case "scaleX": // X轴缩放
				element.style!.setProperty("transform", `scaleX(${currentValue})`);
				break;
			case "scaleY": // Y轴缩放
				element.style!.setProperty("transform", `scaleY(${currentValue})`);
				break;
			case "scale": // 等比缩放
				element.style!.setProperty("transform", `scale(${currentValue})`);
				break;
			case "rotateX": // X轴旋转
				element.style!.setProperty("transform", `rotateX(${valueStr + unit})`);
				break;
			case "rotateY": // Y轴旋转
				element.style!.setProperty("transform", `rotateY(${valueStr + unit})`);
				break;
			case "rotate": // Z轴旋转
				element.style!.setProperty("transform", `rotate(${valueStr + unit})`);
				break;
			case "translateX": // X轴位移
				element.style!.setProperty("transform", `translateX(${valueStr + unit})`);
				break;
			case "translateY": // Y轴位移
				element.style!.setProperty("transform", `translateY(${valueStr + unit})`);
				break;
			case "translate": // 双轴位移
				element.style!.setProperty(
					"transform",
					`translate(${valueStr + unit},${valueStr + unit})`
				);
				break;
			default:
				// 颜色属性处理，需要进行RGBA插值
				if (this.isColorProperty(propertyName)) {
					const startColor = colorToRgb(attribute.fromValue); // 解析起始颜色
					const endColor = colorToRgb(attribute.toValue); // 解析结束颜色

					// 提取起始颜色的RGBA分量，兼容不同的JSON对象访问方式
					const startR =
						startColor.getNumber != null
							? startColor.getNumber("r")
							: (startColor["r"] as number);
					const startG =
						startColor.getNumber != null
							? startColor.getNumber("g")
							: (startColor["g"] as number);
					const startB =
						startColor.getNumber != null
							? startColor.getNumber("b")
							: (startColor["b"] as number);
					const startA =
						startColor.getNumber != null
							? startColor.getNumber("a")
							: (startColor["a"] as number);

					// 提取结束颜色的RGBA分量
					const endR =
						endColor.getNumber != null
							? endColor.getNumber("r")
							: (endColor["r"] as number);
					const endG =
						endColor.getNumber != null
							? endColor.getNumber("g")
							: (endColor["g"] as number);
					const endB =
						endColor.getNumber != null
							? endColor.getNumber("b")
							: (endColor["b"] as number);
					const endA =
						endColor.getNumber != null
							? endColor.getNumber("a")
							: (endColor["a"] as number);

					// 对每个颜色分量进行插值计算
					const r = this.interpolateValue(
						startR != null ? startR : 0,
						endR != null ? endR : 0,
						progress
					);
					const g = this.interpolateValue(
						startG != null ? startG : 0,
						endG != null ? endG : 0,
						progress
					);
					const b = this.interpolateValue(
						startB != null ? startB : 0,
						endB != null ? endB : 0,
						progress
					);
					const a = this.interpolateValue(
						startA != null ? startA : 1,
						endA != null ? endA : 1,
						progress
					);

					// 设置RGBA颜色值
					element.style!.setProperty(
						propertyName,
						`rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a.toFixed(1)})`
					);
				} else {
					// 普通数值属性处理，直接设置数值和单位
					element.style!.setProperty(propertyName, valueStr + unit);
				}
				break;
		}
	}

	/**
	 * Web平台动画运行方法 (H5/iOS/Harmony)
	 * 使用requestAnimationFrame实现流畅的动画循环
	 */
	private runWebAnimation() : void {
		// #ifdef H5 || APP-IOS || APP-HARMONY
		const self = this; // 保存this引用，避免在内部函数中this指向改变
		self.startTimestamp = 0; // 重置开始时间戳

		// 取消之前的动画帧，避免重复执行
		if (self.animationFrameId != null) {
			cancelAnimationFrame(self.animationFrameId);
		}

		function animationLoop() : void {
			// 初始化开始时间，首次执行时记录时间戳
			if (self.startTimestamp <= 0) {
				self.startTimestamp = Date.now();
			}

			// 计算当前进度：(已用时间 / 总时间) + 暂停前的进度
			const elapsed = Date.now() - self.startTimestamp; // 已经过的时间
			const progress = Math.min(elapsed / self.animationDuration + self.currentProgress, 1.0); // 限制进度不超过1

			// 执行动画更新，应用当前进度到所有属性
			self.updateAnimationFrame(progress);

			// 检查暂停状态
			if (self.isPaused) {
				self.isRunning = false; // 停止运行标志
				self.currentProgress = progress; // 保存当前进度，用于恢复
				console.log("动画已暂停");
				return; // 退出动画循环
			}

			// 检查动画完成或停止
			if (progress >= 1.0 || self.isStopping) {
				self.handleAnimationComplete(); // 处理动画完成逻辑
				return; // 退出动画循环
			}

			// 继续下一帧，动画未完成且仍在运行
			if (progress < 1.0 && self.isRunning) {
				self.onFrame(progress); // 触发每帧回调
				self.animationFrameId = requestAnimationFrame(animationLoop); // 请求下一帧
			}
		}

		// 开始动画，触发开始回调并启动动画循环
		self.onStart();
		animationLoop();
		// #endif
	}

	/**
	 * 更新动画帧
	 * 根据执行模式更新所有或当前属性的动画值
	 * @param progress 当前进度 (0-1)
	 */
	private updateAnimationFrame(progress : number) : void {
		if (this.targetElement == null) return; // 没有目标元素时直接返回

		if (!this.isSequentialMode) {
			// 并行执行所有属性动画，所有属性同时进行动画
			for (let i = 0; i < this.animationAttributes.length; i++) {
				this.updateSingleAttribute(this.animationAttributes[i], progress);
			}
		} else {
			// 顺序执行属性动画，一个接一个地执行属性动画
			if (this.currentAttributeIndex < this.animationAttributes.length) {
				this.updateSingleAttribute(
					this.animationAttributes[this.currentAttributeIndex],
					progress
				);
			}
		}
	}

	/**
	 * 更新单个属性的动画
	 * 计算属性的当前值并应用到元素上
	 * @param attribute 动画属性
	 * @param progress 进度
	 */
	private updateSingleAttribute(attribute : AnimationAttribute, progress : number) : void {
		attribute.progress = progress; // 更新属性的进度记录

		if (!this.isColorProperty(attribute.propertyName)) {
			// 数值属性处理
			const fromValue = parseFloat(attribute.fromValue); // 起始数值
			const toValue = parseFloat(attribute.toValue); // 结束数值

			// 应用缓动函数，将线性进度转换为缓动进度
			let easedProgress = progress;
			if (this.currentEasingFunction != null) {
				easedProgress = this.currentEasingFunction(progress);
			}

			// 计算当前值，使用缓动进度进行插值
			let currentValue = this.interpolateValue(fromValue, toValue, easedProgress);

			// 处理反向和往返播放，交换起始和结束值
			if (this.isReversed || this.isAlternateReversed) {
				currentValue = this.interpolateValue(toValue, fromValue, easedProgress);
			}

			// 应用计算出的值到元素属性
			this.setElementProperty(
				attribute.propertyName,
				currentValue,
				attribute.unit,
				progress,
				attribute
			);
		} else {
			// 颜色属性处理，progress参数会在setElementProperty中用于颜色插值
			this.setElementProperty(attribute.propertyName, 0, attribute.unit, progress, attribute);
		}
	}

	/**
	 * 处理动画完成
	 */
	private handleAnimationComplete() : void {
		// 顺序模式下检查是否还有未执行的属性
		if (
			this.isSequentialMode &&
			this.currentAttributeIndex < this.animationAttributes.length - 1
		) {
			this.currentAttributeIndex++;
			this.currentProgress = 0;
			this.restartAnimation();
			return;
		}

		// 重置状态
		// #ifdef H5 || APP-IOS || APP-HARMONY
		if (this.animationFrameId != null) {
			cancelAnimationFrame(this.animationFrameId);
		}
		// #endif

		this.currentAttributeIndex = 0;
		this.currentProgress = 0;

		// 处理往返播放
		if (this.isAlternate) {
			this.isAlternateReversed = !this.isAlternateReversed;
		}

		// 处理循环播放
		if (this.loopCount == -1) {
			// 无限循环
			this.restartAnimation();
			return;
		} else {
			this.currentLoop++;
			if (this.currentLoop < this.loopCount) {
				this.restartAnimation();
				return;
			}
		}

		// 动画完成
		this.isRunning = false;
		this.onComplete();
	}

	/**
	 * 根据平台重新启动动画
	 */
	private restartAnimation() : void {
		// 重置开始时间戳，确保循环动画正确计时
		this.startTimestamp = 0;

		// 根据平台选择合适的动画引擎
		// #ifdef H5 || APP-IOS || APP-HARMONY
		this.runWebAnimation();
		// #endif
		// #ifdef APP-ANDROID
		this.runAndroidAnimation();
		// #endif
		// #ifdef MP
		this.runMPAnimation();
		// #endif
	}

	/**
	 * Android平台动画运行方法
	 */
	private runAndroidAnimation() : void {
		// #ifdef APP-ANDROID
		const self = this;
		self.startTimestamp = 0;

		// 初始化Choreographer
		if (self.choreographer == null) {
			self.choreographer = Choreographer.getInstance();
		} else {
			// 清除之前的回调
			if (self.frameCallback != null) {
				self.choreographer.removeFrameCallback(self.frameCallback);
			}
		}

		/**
		 * Android原生帧回调类
		 */
		class frameCallback extends Choreographer.FrameCallback {
			// @ts-ignore
			override doFrame(frameTimeNanos : Long) {
				// 检查动画是否应该停止
				if (!self.isRunning || self.isStopping) {
					return;
				}

				// 初始化开始时间
				if (self.startTimestamp <= 0) {
					self.startTimestamp = Date.now();
				}

				// 计算当前进度
				const elapsed = Date.now() - self.startTimestamp;
				const progress = Math.min(
					elapsed / self.animationDuration + self.currentProgress,
					1.0
				);

				// 执行动画更新
				self.updateAnimationFrame(progress);

				// 检查暂停状态
				if (self.isPaused) {
					self.isRunning = false;
					self.currentProgress = progress;
					return;
				}

				// 检查动画完成或停止
				if (progress >= 1.0 || self.isStopping) {
					self.handleAnimationComplete();
					return;
				}

				// 继续下一帧
				if (progress < 1.0 && self.isRunning && !self.isStopping) {
					self.onFrame(progress);
					if (self.choreographer != null) {
						self.choreographer.postFrameCallback(this);
					}
				}
			}
		}

		// 启动动画
		self.onStart();
		self.frameCallback = new frameCallback();
		self.choreographer!.postFrameCallback(self.frameCallback);
		// #endif
	}

	/**
	 * 小程序平台动画运行方法
	 */
	private runMPAnimation() : void {
		// #ifdef MP
		const self = this;
		self.startTimestamp = 0;

		// 清除之前的定时器
		if (self.displayLinkTimer != 0) {
			clearTimeout(self.displayLinkTimer);
		}

		function animationLoop() : void {
			// 初始化开始时间
			if (self.startTimestamp <= 0) {
				self.startTimestamp = Date.now();
			}

			// 计算当前进度
			const elapsed = Date.now() - self.startTimestamp;
			const progress = Math.min(elapsed / self.animationDuration + self.currentProgress, 1.0);

			// 执行动画更新
			self.updateAnimationFrame(progress);

			// 检查暂停状态
			if (self.isPaused) {
				self.isRunning = false;
				self.currentProgress = progress;
				return;
			}

			// 检查动画完成或停止
			if (progress >= 1.0 || self.isStopping) {
				self.handleAnimationComplete();
				return;
			}

			// 继续下一帧
			if (progress < 1.0 && self.isRunning) {
				self.onFrame(progress);
				self.displayLinkTimer = setTimeout(animationLoop, 16) as any; // 约60fps
			}
		}

		// 开始动画
		self.onStart();
		animationLoop();
		// #endif
	}

	/**
	 * 开始播放动画
	 */
	play() : AnimationEngine {
		if (this.isRunning) return this;

		// 初始化动画状态
		this.isRunning = true;
		this.isStopping = false;
		this.isPaused = false;
		this.currentLoop = 0;
		this.currentAttributeIndex = 0;

		// 根据平台选择合适的动画引擎
		// #ifdef H5 || APP-IOS || APP-HARMONY
		this.runWebAnimation();
		// #endif
		// #ifdef APP-ANDROID
		this.runAndroidAnimation();
		// #endif
		// #ifdef MP
		this.runMPAnimation();
		// #endif

		return this;
	}

	/**
	 * 异步播放动画，支持await
	 * @returns Promise，动画完成时resolve
	 */
	playAsync() : Promise<void> {
		return new Promise<void>((resolve) => {
			const originalComplete = this.onComplete;
			this.onComplete = () => {
				originalComplete();
				resolve();
			};
			this.play();
		});
	}

	/**
	 * 停止动画
	 * 会立即停止动画并跳转到结束状态
	 */
	stop() : AnimationEngine {
		this.isStopping = true;
		this.currentProgress = 0;
		this.currentAttributeIndex = this.animationAttributes.length;

		// 清理平台相关的动画控制器
		// #ifdef WEB || APP-IOS || APP-HARMONY
		if (this.animationFrameId != null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		// #endif

		// #ifdef APP-ANDROID
		if (this.choreographer != null && this.frameCallback != null) {
			this.choreographer.removeFrameCallback(this.frameCallback);
		}
		// #endif

		// #ifdef MP
		if (this.displayLinkTimer != 0) {
			clearTimeout(this.displayLinkTimer);
			this.displayLinkTimer = 0;
		}
		// #endif

		this.isRunning = false;
		return this;
	}

	/**
	 * 暂停动画
	 * 保留当前状态，可以通过play()恢复
	 */
	pause() : AnimationEngine {
		this.isPaused = true;
		return this;
	}

	/**
	 * 恢复暂停的动画
	 */
	resume() : AnimationEngine {
		if (this.isPaused) {
			this.isPaused = false;
			this.play();
		}
		return this;
	}

	/**
	 * 清空应用到元素上的动画样式
	 * 只清空实际被动画引擎设置过的CSS属性
	 */
	private clearElementStyles() : void {
		if (this.targetElement == null) return;

		const element = this.targetElement;

		// 清空所有动画属性列表中记录的属性
		for (const attr of this.animationAttributes) {
			const propertyName = attr.propertyName;

			// Transform 相关属性需要清空transform
			if (this.isTransformProperty(propertyName)) {
				element.style!.setProperty("transform", "");
			} else {
				// 其他属性直接清空
				element.style!.setProperty(propertyName, "");
			}
		}
	}

	/**
	 * 重置动画到初始状态，清空所有内容
	 */
	reset() : AnimationEngine {
		// 停止当前动画
		this.stop();

		// 清空应用到元素上的所有样式
		this.clearElementStyles();

		// 重置所有动画状态
		this.currentProgress = 0;
		this.currentLoop = 0;
		this.currentAttributeIndex = 0;
		this.isAlternateReversed = false;
		this.isReversed = false;
		this.isPaused = false;
		this.isStopping = true;
		this.startTimestamp = 0;

		// 清空动画属性列表
		this.animationAttributes = [];

		// 重置缓动函数
		this.currentEasingFunction = null;

		// 重置回调函数
		this.onComplete = () => { };
		this.onStart = () => { };
		this.onFrame = () => { };

		// 清理平台相关的动画控制器
		// #ifdef WEB || APP-IOS || APP-HARMONY
		if (this.animationFrameId != null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		// #endif

		// #ifdef APP-ANDROID
		if (this.choreographer != null && this.frameCallback != null) {
			this.choreographer.removeFrameCallback(this.frameCallback);
			this.frameCallback = null;
		}
		this.choreographer = null;
		// #endif

		// #ifdef MP
		if (this.displayLinkTimer != 0) {
			clearTimeout(this.displayLinkTimer);
			this.displayLinkTimer = 0;
		}
		// #endif

		return this;
	}

	/**
	 * 获取当前动画进度
	 */
	getProgress() : number {
		return this.currentProgress;
	}

	/**
	 * 获取动画是否正在运行
	 */
	isAnimating() : boolean {
		return this.isRunning;
	}

	/**
	 * 获取当前循环次数
	 */
	getCurrentLoop() : number {
		return this.currentLoop;
	}

	/**
	 * 清除所有动画属性
	 */
	clearAttributes() : AnimationEngine {
		this.animationAttributes = [];
		return this;
	}

	/**
	 * 获取动画属性数量
	 */
	getAttributeCount() : number {
		return this.animationAttributes.length;
	}

	/**
	 * 淡入动画
	 * @param duration 持续时间
	 */
	fadeIn(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).opacity("0", "1");
	}

	/**
	 * 淡出动画
	 * @param duration 持续时间
	 */
	fadeOut(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).opacity("1", "0");
	}

	/**
	 * 滑入动画(从左)
	 * @param duration 持续时间
	 */
	slideInLeft(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).translateX("-100%", "0%").opacity("0", "1");
	}

	/**
	 * 滑入动画(从右)
	 * @param duration 持续时间
	 */
	slideInRight(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).translateX("100%", "0%").opacity("0", "1");
	}

	/**
	 * 滑入动画(从上)
	 * @param duration 持续时间
	 */
	slideInUp(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("translateY", "-100%", "0%")
			.opacity("0", "1");
	}

	/**
	 * 滑入动画(从下)
	 * @param duration 持续时间
	 */
	slideInDown(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("translateY", "100%", "0%")
			.opacity("0", "1");
	}

	/**
	 * 缩放动画(放大)
	 * @param duration 持续时间
	 */
	zoomIn(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).scale("0", "1").opacity("0", "1");
	}

	/**
	 * 缩放动画(缩小)
	 * @param duration 持续时间
	 */
	zoomOut(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).scale("1", "0").opacity("1", "0");
	}

	/**
	 * 旋转动画
	 * @param duration 持续时间
	 * @param degrees 旋转角度
	 */
	rotateIn(duration : number = 500, degrees : number = 360) : AnimationEngine {
		return this.setDuration(duration).rotate("0deg", `${degrees}deg`).opacity("0", "1");
	}

	/**
	 * 旋转退出动画
	 * @param duration 持续时间
	 * @param degrees 旋转角度
	 */
	rotateOut(duration : number = 500, degrees : number = 360) : AnimationEngine {
		return this.setDuration(duration).rotate("0deg", `${degrees}deg`).opacity("1", "0");
	}

	/**
	 * 弹跳动画
	 * @param duration 持续时间
	 */
	bounce(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.addCustomEasing("bounce", [0.68, -0.55, 0.265, 1.55])
			.scale("1", "1.1")
			.setAlternate(true)
			.setLoopCount(2);
	}

	/**
	 * 摇摆动画
	 * @param duration 持续时间
	 */
	shake(duration : number = 500) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("translateX", "0px", "10px")
			.setAlternate(true)
			.setLoopCount(6);
	}

	/**
	 * 链式动画：支持多个动画依次执行
	 * @param animations 动画配置函数数组
	 */
	sequence(animations : ((engine : AnimationEngine) => AnimationEngine)[]) : AnimationEngine {
		const self = this;

		if (animations.length == 0) {
			return this;
		}

		// 执行第一个动画
		const firstEngine = animations[0](new AnimationEngine(this.targetElement, {}));

		// 如果只有一个动画，直接返回
		if (animations.length == 1) {
			return firstEngine;
		}

		// 递归设置后续动画
		function setNextAnimation(
			currentEngine : AnimationEngine,
			remainingAnimations : ((engine : AnimationEngine) => AnimationEngine)[]
		) : void {
			if (remainingAnimations.length == 0) {
				return;
			}

			const originalComplete = currentEngine.onComplete;
			currentEngine.onComplete = () => {
				originalComplete();

				// 执行下一个动画
				const nextEngine = remainingAnimations[0](
					new AnimationEngine(self.targetElement, {})
				);

				// 如果还有更多动画，继续设置链式
				if (remainingAnimations.length > 1) {
					setNextAnimation(nextEngine, remainingAnimations.slice(1));
				}

				nextEngine.play();
			};
		}

		// 设置动画链
		setNextAnimation(firstEngine, animations.slice(1));

		return firstEngine;
	}

	/**
	 * 滑出动画(向左)
	 * @param duration 持续时间
	 */
	slideOutLeft(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).translateX("0%", "-100%").opacity("1", "0");
	}

	/**
	 * 滑出动画(向右)
	 * @param duration 持续时间
	 */
	slideOutRight(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration).translateX("0%", "100%").opacity("1", "0");
	}

	/**
	 * 滑出动画(向上)
	 * @param duration 持续时间
	 */
	slideOutUp(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("translateY", "0%", "-100%")
			.opacity("1", "0");
	}

	/**
	 * 滑出动画(向下)
	 * @param duration 持续时间
	 */
	slideOutDown(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("translateY", "0%", "100%")
			.opacity("1", "0");
	}

	/**
	 * 翻转动画(水平)
	 * @param duration 持续时间
	 */
	flipX(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("rotateX", "0deg", "180deg")
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 翻转动画(垂直)
	 * @param duration 持续时间
	 */
	flipY(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("rotateY", "0deg", "180deg")
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 弹性进入动画
	 * @param duration 持续时间
	 */
	elasticIn(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.scale("0", "1")
			.opacity("0", "1")
			.addCustomEasing("elastic", [0.175, 0.885, 0.32, 1.275]);
	}

	/**
	 * 弹性退出动画
	 * @param duration 持续时间
	 */
	elasticOut(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.scale("1", "0")
			.opacity("1", "0")
			.addCustomEasing("elastic", [0.68, -0.55, 0.265, 1.55]);
	}

	/**
	 * 回弹动画
	 * @param duration 持续时间
	 */
	rubberBand(duration : number = 1000) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("scaleX", "1", "1.25")
			.addAttribute("scaleY", "1", "0.75")
			.setAlternate(true)
			.setLoopCount(2)
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 摆动动画
	 * @param duration 持续时间
	 */
	swing(duration : number = 1000) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("rotate", "0deg", "15deg")
			.setAlternate(true)
			.setLoopCount(4)
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 抖动动画
	 * @param duration 持续时间
	 */
	wobble(duration : number = 1000) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("translateX", "0px", "25px")
			.addAttribute("rotate", "0deg", "5deg")
			.setAlternate(true)
			.setLoopCount(4);
	}

	/**
	 * 滚动进入动画
	 * @param duration 持续时间
	 */
	rollIn(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.translateX("-100%", "0%")
			.rotate("-120deg", "0deg")
			.opacity("0", "1");
	}

	/**
	 * 滚动退出动画
	 * @param duration 持续时间
	 */
	rollOut(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.translateX("0%", "100%")
			.rotate("0deg", "120deg")
			.opacity("1", "0");
	}

	/**
	 * 灯光效果动画
	 * @param duration 持续时间
	 */
	lightSpeed(duration : number = 500) : AnimationEngine {
		return this.setDuration(duration)
			.translateX("-100%", "0%")
			.addAttribute("skewX", "-30deg", "0deg")
			.opacity("0", "1")
			.addCustomEasing("ease-out", [0.25, 0.46, 0.45, 0.94]);
	}

	/**
	 * 浮动动画
	 * @param duration 持续时间
	 */
	float(duration : number = 3000) : AnimationEngine {
		return this.setDuration(duration)
			.translateY("0px", "-10px")
			.setAlternate(true)
			.setLoopCount(-1)
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 呼吸动画
	 * @param duration 持续时间
	 */
	breathe(duration : number = 2000) : AnimationEngine {
		return this.setDuration(duration)
			.scale("1", "1.1")
			.setAlternate(true)
			.setLoopCount(-1)
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 发光动画
	 * @param duration 持续时间
	 */
	glow(duration : number = 1500) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute(
				"boxShadow",
				"0 0 5px rgba(255,255,255,0.5)",
				"0 0 20px rgba(255,255,255,1)"
			)
			.setAlternate(true)
			.setLoopCount(-1)
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 进度条动画
	 * @param duration 持续时间
	 * @param progress 进度百分比 (0-100)
	 */
	progressBar(duration : number = 1000, progress : number = 100) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("width", "0%", `${progress}%`)
			.addCustomEasing("ease-out", [0.25, 0.46, 0.45, 0.94]);
	}

	/**
	 * 模态框进入动画
	 * @param duration 持续时间
	 */
	modalIn(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration)
			.scale("0.7", "1")
			.opacity("0", "1")
			.addCustomEasing("ease-out", [0.25, 0.46, 0.45, 0.94]);
	}

	/**
	 * 模态框退出动画
	 * @param duration 持续时间
	 */
	modalOut(duration : number = 300) : AnimationEngine {
		return this.setDuration(duration)
			.scale("1", "0.7")
			.opacity("1", "0")
			.addCustomEasing("ease-in", [0.42, 0.0, 1.0, 1.0]);
	}

	/**
	 * 卡片翻转动画
	 * @param duration 持续时间
	 */
	cardFlip(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.addAttribute("rotateY", "0deg", "180deg")
			.addCustomEasing("ease-in-out", [0.25, 0.1, 0.25, 1.0]);
	}

	/**
	 * 波纹扩散动画
	 * @param duration 持续时间
	 */
	ripple(duration : number = 600) : AnimationEngine {
		return this.setDuration(duration)
			.scale("0", "4")
			.opacity("0.7", "0")
			.addCustomEasing("ease-out", [0.25, 0.46, 0.45, 0.94]);
	}
}

/**
 * 创建动画实例
 * @param element 目标元素
 * @param options 动画选项
 */
export function createAnimation(
	element : UniElement | null,
	options : AnimationOptions = {}
) : AnimationEngine {
	return new AnimationEngine(element, options);
}