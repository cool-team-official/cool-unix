// 尺寸类型，控件大小
export type Size = "small" | "normal" | "large";

// 主题类型，常用于按钮、标签等
export type Type = "primary" | "success" | "warn" | "error" | "info";

// 透传属性类型
export type PassThroughProps = {
	className?: string; // 自定义样式类名
};

// 主轴对齐方式
export type Justify = "start" | "center" | "end";

// 输入框类型支持
export type ClInputType =
	| "text" // 文本
	| "number" // 数字
	| "idcard" // 身份证
	| "digit" // 数字（带小数点）
	| "tel" // 电话
	| "safe-password" // 安全密码
	| "nickname"; // 昵称

// 文本内容类型
export type ClTextType = "default" | "phone" | "name" | "amount" | "card" | "email";

// 按钮风格类型
export type ClButtonType = "primary" | "success" | "warn" | "error" | "info" | "light" | "dark";

// 单选项类型
export type ClRadioOption = {
	label?: string; // 标签
	value: string | number | boolean; // 值
	disabled?: boolean; // 是否禁用
};

// 多选项类型
export type ClCheckboxOption = {
	label?: string; // 标签
	value: string | number | boolean; // 值
	disabled?: boolean; // 是否禁用
};

// 下拉、选择组件的值类型
export type ClSelectValue = string[] | number[] | number | string | null;

// 选择框选项类型
export type ClSelectOption = {
	label: string; // 显示文本
	value: any; // 取值
	children?: ClSelectOption[]; // 子选项
};

// 确认框动作类型
export type ClConfirmAction = "confirm" | "cancel" | "close";

// 确认框关闭事件参数
export type ClConfirmBeforeCloseEvent = {
	close: () => void; // 关闭弹窗
	showLoading: () => void; // 展示加载
	hideLoading: () => void; // 隐藏加载
};

// 确认框配置项
export type ClConfirmOptions = {
	title: string; // 标题
	message: string; // 内容
	callback?: (action: ClConfirmAction) => void; // 操作回调
	beforeClose?: (action: ClConfirmAction, event: ClConfirmBeforeCloseEvent) => void; // 关闭前回调
	confirmText?: string; // 确认按钮文案
	showConfirm?: boolean; // 是否显示确认
	cancelText?: string; // 取消按钮文案
	showCancel?: boolean; // 是否显示取消
	duration?: number; // 自动关闭时长(ms)
};

// 操作菜单项
export type ClActionSheetItem = {
	label: string; // 文本
	icon?: string; // 图标
	disabled?: boolean; // 是否禁用
	color?: string; // 自定义颜色
	callback?: () => void; // 点击回调
};

// 操作菜单配置项
export type ClActionSheetOptions = {
	list: ClActionSheetItem[]; // 操作项列表
	title?: string; // 标题
	description?: string; // 描述
	cancelText?: string; // 取消按钮文案
	showCancel?: boolean; // 是否显示取消
	maskClosable?: boolean; // 点击遮罩关闭
};

// 吐司位置类型
export type ClToastPosition = "top" | "center" | "bottom";
// 吐司类型
export type ClToastType = "success" | "warn" | "error" | "question" | "disabled" | "stop";

// 吐司配置项
export type ClToastOptions = {
	type?: ClToastType; // 类型
	icon?: string; // 自定义图标
	image?: string; // 图片
	message: string; // 内容
	position?: ClToastPosition; // 显示位置
	duration?: number; // 时长(ms)
	clear?: boolean; // 唯一吐司(清除之前的)
};

// Tabs组件的单项类型
export type ClTabsItem = {
	label: string; // 标签文本
	value: string | number; // 对应值
	disabled?: boolean; // 是否禁用
};

// 列表项类型
export type ClListItem = {
	label: string; // 标题
	content?: string; // 内容描述
	icon?: string; // 左侧图标
	arrow?: boolean; // 是否展示箭头
	hoverable?: boolean; // 是否可点击高亮
	disabled?: boolean; // 是否禁用
};

// 列表视图单项
export type ClListViewItem = {
	label?: string; // 节点标签
	value?: any; // 节点值
	index?: string; // 索引
	children?: ClListViewItem[]; // 子项
};

// 列表分组
export type ClListViewGroup = {
	index: string; // 分组索引
	children: ClListViewItem[]; // 分组数据
};

// 虚拟滚动列表项类型
export type ClListViewVirtualItem = {
	key: string; // 唯一标识
	type: "header" | "item"; // 类型
	index: number; // 排序索引
	top: number; // 距离顶部像素
	height: number; // 高度
	data: ClListViewItem; // 数据
};

// 下拉刷新状态
export type ClListViewRefresherStatus = "default" | "pulling" | "refreshing";

// 多级联动选项(复用列表项类型)
export type ClCascaderOption = ClListViewItem;

// 弹窗出现方向
export type ClPopupDirection = "top" | "right" | "bottom" | "center" | "left";

// 二维码样式
export type ClQrcodeMode = "rect" | "circular" | "line" | "rectSmall";

// 上传项
export type ClUploadItem = {
	uid: string; // 唯一标识
	preview: string; // 预览图
	url: string; // 真实地址
	progress: number; // 上传进度(0-100)
};

// 日期选择快捷项
export type ClSelectDateShortcut = {
	label: string; // 显示文本
	value: string[]; // 日期范围数组
};

// 表单规则类型
export type ClFormRule = {
	required?: boolean; // 是否必填
	message?: string; // 错误信息
	min?: number; // 最小长度
	max?: number; // 最大长度
	pattern?: RegExp; // 正则验证
	validator?: (value: any | null) => boolean | string; // 自定义验证函数
};

// 表单校验错误信息
export type ClFormValidateError = {
	field: string; // 错误字段
	message: string; // 错误信息
};

// 表单校验返回结果
export type ClFormValidateResult = {
	valid: boolean; // 是否通过校验
	errors: ClFormValidateError[]; // 错误列表
};

// 表单标签布局方式
export type ClFormLabelPosition = "left" | "top" | "right";

// 筛选项类型
export type ClFilterItemType = "switch" | "sort" | "select";

// 筛选项实体
export type ClFilterItem = {
	label: string; // 筛选标签
	value: any; // 值
	type: ClFilterItemType; // 类型
	options?: ClSelectOption[]; // 选项
};

// 树结构项
export type ClTreeItem = {
	id: string | number; // 节点唯一标识
	label: string; // 节点文本
	disabled?: boolean; // 是否禁用
	children?: ClTreeItem[]; // 子节点
	value?: UTSJSONObject; // 扩展数据
	isExpand?: boolean; // 是否展开
	isChecked?: boolean; // 是否选中
	isHalfChecked?: boolean; // 部分选中
};

// 树节点信息
export type ClTreeNodeInfo = {
	node: ClTreeItem; // 当前节点
	parent?: ClTreeItem; // 父节点
	index: number; // 索引
};

// 日历类型
export type ClCalendarMode = "single" | "multiple" | "range";

// 日历日期配置
export type ClCalendarDateConfig = {
	date: string; // 日期字符串
	topText?: string; // 顶部文案
	bottomText?: string; // 底部文案
	disabled?: boolean; // 是否禁用
	color?: string; // 文字颜色
};

// 跑马灯滚动方向
export type ClMarqueeDirection = "horizontal" | "vertical";

// 跑马灯单项
export type ClMarqueeItem = {
	url: string; // 跳转链接
	originalIndex: number; // 原始下标
};

// 跑马灯透传属性
export type ClMarqueePassThrough = {
	className?: string; // 自定义样式类名
	container?: PassThroughProps; // 容器
	item?: PassThroughProps; // 条目
	image?: PassThroughProps; // 图片
};

// 跑马灯组件属性
export type ClMarqueeProps = {
	className?: string; // 容器样式类
	pt?: ClMarqueePassThrough; // 透传属性
	list?: string[]; // 数据列表
	direction?: ClMarqueeDirection; // 滚动方向
	speed?: number; // 滚动速度
	pause?: boolean; // 是否暂停
	pauseOnHover?: boolean; // 悬浮是否暂停
	itemHeight?: number; // 行高
	itemWidth?: number; // 项宽
	gap?: number; // 项间距
};

// 图标内容配置
export type ClIconContent = {
	font: string; // 字体名称
	text: string; // 图标文本
};

// 选座项
export type ClSelectSeatItem = {
	row: number; // 行号
	col: number; // 列号
	disabled?: boolean; // 是否禁用
	empty?: boolean; // 是否为空位（不渲染但保留位置）
	color?: string; // 默认颜色
	bgColor?: string; // 默认背景色
	borderColor?: string; // 边框颜色
	selectedBgColor?: string; // 选中背景色
	selectedColor?: string; // 选中图标颜色
	selectedIcon?: string; // 选中图标名称
	icon?: string; // 图标名称
	image?: string; // 默认图片（小程序平台字体渲染兼容）
	selectedImage?: string; // 选中图片（小程序平台字体渲染兼容）
};

// 选中座位的值
export type ClSelectSeatValue = {
	row: number; // 行号
	col: number; // 列号
};
