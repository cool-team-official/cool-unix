/**
 * @description 简单生成随机数
 * @param {number} 生成随机数的长度
 */
export function TuiGuid(len: number): string {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < len; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

/**
 * 检查值是否为 null
 * @example isNull(null) // true
 * @example isNull(undefined) // true
 */
export function isNull(value?: any | null): boolean {
	// #ifdef APP
	return value == null;
	// #endif

	// #ifndef APP
	return value == null || value == undefined;
	// #endif
}

/**
 * 获取对象的属性值
 * @example get({a: {b: 1}}, 'a.b') // 1
 * @example get({a: {b: 1}}, 'a.c', 'default') // 'default'
 */
export function get(object: any, path: string, defaultValue: any | null = null): any | null {
	if (isNull(object)) {
		return defaultValue;
	}

	// @ts-ignore
	const value = new UTSJSONObject(object).getAny(path);

	if (isNull(value)) {
		return defaultValue;
	}

	return value;
}

/**
 * 设置对象的属性值
 * @example set({a: 1}, 'b', 2) // {a: 1, b: 2}
 */
export function set(object: any, key: string, value: any | null): void {
	(object as UTSJSONObject)[key] = value;
}
