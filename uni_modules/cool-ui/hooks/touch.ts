export class Touch {
	// 触摸起始Y坐标
	startY = 0;
	// 触摸起始X坐标
	startX = 0;
	// 横向滑动参数
	horizontal = 0;

	start(e: UniTouchEvent) {
		this.startX = e.touches[0].clientX;
		this.startY = e.touches[0].clientY;
		this.horizontal = 0;
	}

	move(e: UniTouchEvent) {
		const x = this.startX - e.touches[0].clientX;

		if (this.horizontal == 0) {
			// 只在horizontal=0时判断一次
			const y = this.startY - e.touches[0].clientY;

			if (Math.abs(x) > Math.abs(y)) {
				// 如果x轴移动距离大于y轴移动距离则表明是横向移动手势
				this.horizontal = 1;
			}

			if (this.horizontal == 1) {
				// 如果是横向移动手势，则阻止默认行为（防止页面滚动）
				e.preventDefault();
			}
		}
	}

	end() {
		this.startY = 0;
		this.horizontal = 0;
	}
}

export function useTouch(): Touch {
	return new Touch();
}
