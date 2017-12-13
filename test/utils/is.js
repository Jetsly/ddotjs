"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 判断是不是方法
 * @param f
 */
exports.func = function (f) { return typeof f === 'function'; };
/**
 * 判断是不是数字
 * @param f
 */
exports.num = function (f) { return typeof f === 'number' && !isNaN(f); };
/**
 * 判断是不是字符串
 * @param f
 */
exports.str = function (f) { return typeof f === 'string'; };
/**
 * 判断是不是对象
 * @param f
 */
exports.obj = function (f) { return typeof f === 'object' && !Array.isArray(f); };
/**
 * 判断是不是数组
 * @param f
 */
exports.arr = function (f) { return Array.isArray(f); };
//# sourceMappingURL=is.js.map