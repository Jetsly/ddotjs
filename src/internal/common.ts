declare function escape (s: string): string
declare function unescape (s: string): string

function __splitData (str, delimiter, decodeKey, decodeValue) {
  if (str.trim().length === 0) return {}
  return str.split(delimiter).reduce((info,item) => {
    const [key, val = ''] = item.trim().split('=')
    info[decodeKey(key)] = decodeValue(val)
    return info
  },{})
}

/**
 * 查询url参数
 * @param search 为空时为 location.search
 */
export const query = (search = location.search) => __splitData(search.substr(1), '&',
    key => key.replace(/-+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : ''),
    decodeURIComponent)

/**
 * 查询或者设置cookie
 * @param obj 当空为获取，否则设置 {name:'',value:'',domain:location.hostname,expiredays}
 */
export const cookie = (obj?: {
  name: string
  value: string
  domain?: string,
  expiredays?: number
}) => {
  if (obj === undefined) {
    return __splitData(document.cookie, ';', key => key, unescape)
  }
  let {
      name,
      value,
      domain = location.hostname,
      expiredays = 0
    } = obj
  let exdate = new Date()
  exdate.setTime(exdate.getTime() + (expiredays * 1000 * 60 * 60 * 24))
  const expireStr = expiredays === 0 ? '' : ';expires=' + exdate.toUTCString()
  document.cookie = `${name}=${escape(value)};domain=${domain};path=/;${expireStr}`
  return cookie()
}

/**
 * 查询 cookie \ query
 * @param key
 */
export const get = key => cookie()[`${key}`] || query()[`${key}`]

/**
 * 判断 Android 机型
 * @param ua
 */
export const isAndroid = (ua = navigator.userAgent) => /Linux|Android|adr/gi.test(ua)

/**
 * 判断 IOS 机型
 * @param ua
 */
export const isIOS = (ua = navigator.userAgent) => /iphone|ipod|ipad/gi.test(ua)

/**
 * 判断 微信 内核
 * @param ua
 */
export const isWX = (ua = navigator.userAgent) => /micromessenger/gi.test(ua)

/**
 * 判断 微博 内核
 * @param ua
 */
export const isWB = (ua = navigator.userAgent) => /weibo/gi.test(ua)

/**
 * 获取手机型号
 * @param ua
 */
export const platform = (ua = navigator.userAgent) => {
  const testAndroid = /; ([\w\s-]+) Build/.exec(ua)
  const testIOS = /CPU ([\w\s]+) like/.exec(ua)
  return isAndroid() ? (testAndroid && testAndroid[1]) : (testIOS && testIOS[1])
}
