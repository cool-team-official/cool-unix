import { forInObject, get, has } from "@/cool";
import { icons } from "@/icons";
import type { ClIconContent } from "../../types";

export const getIcon = (name: string): ClIconContent => {
	let font = "";
	let text = "";

	try {
		let code = "";

		// 遍历字体库查找对应图标
		forInObject(icons, (value, key) => {
			if (has(value, name)) {
				font = key;
				code = get(value, name) as string;
			}
		});

		text = String.fromCharCode(parseInt(code, 16));
	} catch (e) {
		console.error(`图标 ${name} 不存在`, e);
	}

	return {
		font,
		text
	};
};
