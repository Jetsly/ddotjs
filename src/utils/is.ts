/**
 * 判断是不是方法
 * @param f
 */
export const func = (f) => typeof f === "function";

/**
 * 判断是不是数字
 * @param f
 */
export const num = (f) => typeof f === "number" && !isNaN(parseInt(num + "", 10));

/**
 * 判断是不是字符串
 * @param f
 */
export const str = (f) => typeof f === "string";

/**
 * 判断是不是数组
 * @param arr
 */
export const array = (arr) => Array.isArray(arr);
