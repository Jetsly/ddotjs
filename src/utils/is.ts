/**
 * 判断是不是方法
 * @param f
 */
export const func = f => typeof f === 'function'

/**
 * 判断是不是数字
 * @param f
 */
export const num = f => typeof f === 'number' && !isNaN(f)

/**
 * 判断是不是字符串
 * @param f
 */
export const str = f => typeof f === 'string'

/**
 * 判断是不是对象
 * @param f
 */
export const obj = f => typeof f === 'object' && !Array.isArray(f)

/**
 * 判断是不是数组
 * @param f
 */
export const arr = f => Array.isArray(f)
