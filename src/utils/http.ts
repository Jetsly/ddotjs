import * as is from './is'
import { fixAchor } from './cavs'

/**
 * 构建参数
 * @param {string} prefix key的前缀
 * @param {object} param  参数
 * @param {function} append 回调方法
 */
const buildParam = (prefix, param, append) => {
  if ((is.obj(param) && param.constructor === ({}).constructor) || is.arr(param)) {
    Object.keys(param).forEach(key => {
      let val = param[`${key}`]
      if (val !== undefined) {
        let _key = is.obj(val) || is.arr(val) || is.obj(param) ? key : ``
        buildParam(prefix === '' ? key : `${prefix}[${_key}]`, val, append)
      }
    })
  } else {
    append(`${prefix}`, param)
  }
}

/**
 * 构建get请求参数
 * @param url 地址
 * @param params 参数
 */
const buildGetParam = (url, ...params) => {
  let query = []
  params.forEach(param => is.vaild(param) && buildParam('', param, (key, val) => {
    query.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
  }))
  if (query.length === 0) return url
  else if (~url.indexOf('?')) return `${url.replace(/&$/,'')}&${query.join('&')}`
  else return `${url}?${query.join('&')}`
}

/**
 * 构建post请求参数
 * @param params 参数
 */
const buildPostParam = (...params) => {
  let data = new FormData()
  params.forEach(param => is.vaild(param) && buildParam('', param, (key, val) => {
    data.append(key, val)
  }))
  return data
}

const isJson = contentType => ~contentType.indexOf('application/json')

export type ReqConfig = {
  url: string, // 请求地址
  params?: object,
  data?: object | string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'HEAD' | 'OPTIONS', // Request with GET/HEAD method cannot have body
  headers?: HeadersInit
  credentials?: boolean
  useHandle?: boolean
  contentType?: string
}

export type ReqParams = ReqConfig

export type ResObj = {
  headers: object,
  status: object,
  data: object
} | Response

/** 注入 */
const defaultHandle = {
  fulfilled: res => Promise.resolve(isJson(res.headers.get('content-type')) ? res.json() : res.text())
    .then(data => {
      const { headers,status } = res
      return {
        headers,
        status,
        data
      }
    }),
  rejected: error => Promise.resolve({ error })
}
const requestHandle = []
const responseHandle = [defaultHandle]

/**
 * 设置注入
 */
export const interceptors = {
  request: {
    use (fulfilled, rejected?) {
      requestHandle.push({
        fulfilled: fulfilled,
        rejected: rejected
      })
    }
  },
  response: {
    use (fulfilled, rejected?) {
      responseHandle.push({
        fulfilled: fulfilled,
        rejected: rejected
      })
    }
  }
}

/**
 * fetch 请求
 * @param conf
 */
export const req = (conf: ReqConfig): Promise<any> => {
  conf = {
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    params: {},
    data: undefined, // ios 下 data 默认不能为 空字符串 或者对象
    headers: {},
    credentials: true,
    useHandle: true,
    ...conf
  }
  let fetchPromise = Promise.resolve(conf)
  const chain: [any,any] = [({ url,method,headers,data }) => fetch(url, {
    method: method,
    headers: headers,
    body: data,
    ...(conf.credentials ? { credentials: 'include' } : {})
  }),undefined]
  chain.unshift(conf => {
    conf = {
      ...conf,
      url: buildGetParam(conf.url,conf.params)
    }
    const setHeader = (name: string, value: string) => (conf.headers[name.toLowerCase()] = value,setHeader)
    const urlAnchor = fixAchor(conf.url)
    // 如果同域设置 当前请求为 AJAX
    if (location.host !== urlAnchor.host) {
      setHeader('X-Requested-With', 'XMLHttpRequest')
    }
    // 如果是POST 则设置 'Content-Type'
    if (~['POST'].indexOf(conf.method)) {
      setHeader('Content-Type', conf.contentType)
    }
  // 处理请求类型(如果是get|head忽略)
    if (!~['GET','HEAD'].indexOf(conf.method)) {
      if (~conf.contentType.indexOf('x-www-form-urlencoded')) {
        conf.data = buildGetParam('',conf.data).slice(1)
      } else if (isJson(conf.contentType)) {
        conf.data = JSON.stringify(conf.data)
      }
    }
    return conf
  }, undefined)
  if (conf.useHandle) {
    requestHandle.forEach(function unshiftRequestInterceptors (interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    responseHandle.forEach(function pushResponseInterceptors (interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })
  } else {
    chain.push(defaultHandle.fulfilled, defaultHandle.rejected)
  }
  while (chain.length) {
    fetchPromise = fetchPromise.then(chain.shift(), chain.shift())
  }
  return fetchPromise
}

/**
 * fetch get 请求
 * @param reqParams
 */
export const get = (reqParams: ReqParams) => req(reqParams)

/**
 * fetch post 请求
 * @param reqParams
 */
export const post = (reqParams: ReqParams) => req({ method: 'POST', ...reqParams })

/**
 * fetch put 请求
 * @param reqParams
 */
export const put = (reqParams: ReqParams) => req({ method: 'PUT', ...reqParams })

/**
 * fetch del 请求
 * @param reqParams
 */
export const del = (reqParams: ReqParams) => req({ method: 'DELETE', ...reqParams })

/**
 * fetch head 请求
 * @param reqParams
 */
export const head = (reqParams: ReqParams) => req({ method: 'HEAD', ...reqParams })

/**
 * fetch head 请求
 * @param reqParams
 */
export const options = (reqParams: ReqParams) => req({ method: 'OPTIONS', ...reqParams })
