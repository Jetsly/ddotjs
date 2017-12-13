"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 判断是不是方法
 * @param f
 */
exports.func = (f) => typeof f === "function";
/**
 * 判断是不是数字
 * @param f
 */
exports.num = (f) => typeof f === "number" && !isNaN(parseInt(exports.num + "", 10));
/**
 * 判断是不是字符串
 * @param f
 */
exports.str = (f) => typeof f === "string";
/**
 * 判断是不是数组
 * @param arr
 */
exports.array = (arr) => Array.isArray(arr);
//# sourceMappingURL=is.js.map