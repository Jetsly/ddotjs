/**
 * 判断是不是方法
 * @param f
 */
export var func = function (f) { return typeof f === 'function'; };
/**
 * 判断是不是数字
 * @param f
 */
export var num = function (f) { return typeof f === 'number' && !isNaN(f); };
/**
 * 判断是不是字符串
 * @param f
 */
export var str = function (f) { return typeof f === 'string'; };
/**
 * 判断是不是对象
 * @param f
 */
export var obj = function (f) { return typeof f === 'object' && !Array.isArray(f); };
/**
 * 判断是不是数组
 * @param f
 */
export var arr = function (f) { return Array.isArray(f); };
