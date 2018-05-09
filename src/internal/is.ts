/**
 * 判断是不是方法
 * @param val
 */
export const func = val => typeof val === 'function'

/**
 * 判断是不是数字
 * @param val
 */
export const num = val => typeof val === 'number' && !isNaN(val)

/**
 * 判断是不是字符串
 * @param val
 */
export const str = val => typeof val === 'string'

/**
 * 判断是不是对象
 * @param val
 */
export const obj = val => val !== null && typeof val === 'object' && !Array.isArray(val)

/**
 * 判断是不是数组
 * @param val
 */
export const arr = val => Array.isArray(val)

/**
 * 判断对象是不是布尔值
 * @param val
 */
export const bool = val => typeof val === 'boolean'

/**
 * 判断对象是不是非 null | undefined
 * @param val
 */
export const vaild = val => !(val === undefined || val === null)

/**
 * 判断是不是唯一的
 * @param val
 */
export const symbol = val => typeof val === 'symbol'

/**
 * 判断对象是不是Promise对象
 * @param val
 */
export const promise = val => val instanceof Promise

/**
 * 判断是不是迭代函数
 * @param val
 */
export const generator = val => val && val.constructor && val.constructor.name === 'GeneratorFunction'
