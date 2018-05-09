
/**
 * 数组随机排序
 * Array.sort(randomSort)
 */
export function randomSort () {
  return Math.random() - 0.5
}

/**
 * 数组随机采样
 * @param arr 数组
 * @param len 长度
 */
export function randomSample<T> (arr: Array<T>,len: Number): Array<T> {
// 随机打乱数组,新建一个数组防止打乱原来的
  let newArr = Array.prototype.concat.call(arr, [])
  let tempArr = newArr.sort(randomSort)
// 当长度一样的时候
  if (newArr.length === len) return newArr
  let result = []
  while (result.length !== len) {
    let idx = Math.floor(Math.random() * Math.pow(10, 2)) * (+new Date) % tempArr.length
    result.push(tempArr[idx])
    tempArr = tempArr.slice(0, idx).concat(tempArr.slice(idx + 1))
    if (tempArr.length === 0) {
      tempArr = newArr.randomSort()
    }
  }
  return result
}
