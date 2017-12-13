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
export const cookie = (obj?) => {
  if (obj === undefined) {
    return __splitData(document.cookie, ';', key => key, unescape)
  }
  let {
      name,
      value,
      domain = location.hostname,
      expiredays
    } = obj
  let exdate = new Date()
  exdate.setTime(exdate.getTime() + expiredays)
  const expireStr = expiredays === undefined ? '' : ';expires=' + exdate.toUTCString()
  document.cookie = `${name}=${escape(value)};domain=${domain};path=/;${expireStr}`
  return cookie()
}
