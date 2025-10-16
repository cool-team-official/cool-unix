// components/cl-divider/types.ts
export interface DividerProps {
  /** 提示内容 */
  text?: string
  /** 水平分割线占据高度，单位rpx */
  height?: number
  /** 分割线宽度，参数值需要带单位 */
  width?: string
  /** 分割线颜色 */
  dividerColor?: string
  /** 提示文字颜色 */
  color?: string
  /** 提示文字大小，单位rpx */
  size?: number
  /** 提示文字字重，可选值：'normal'、'bold' */
  fontWeight?: 'normal' | 'bold'
  /** 背景颜色，和当前页面背景色保持一致 */
  backgroundColor?: string
  /** 分割线方向：horizontal(水平) 或 vertical(垂直) */
  direction?: 'horizontal' | 'vertical'
  /** 垂直分割线占据宽度，单位rpx */
  verticalWidth?: number
}

export interface DividerSlots {
  /** 默认插槽，用于自定义内容 */
  default?: () => any
}