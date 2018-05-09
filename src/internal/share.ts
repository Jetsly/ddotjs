
import { fixAchor } from './canvas/cavs'
export type Options = {
  sdkUrl: string,
  queryKey: string
}
export type Config = {
  title: string,
  desc: string,
  link: string,
  img: string,
  success?: Function,
  cancel?: Function
}

const WeixinJSBridgeReadyPromise = new Promise<Object>((resolve) => {
  if (typeof WeixinJSBridge === 'undefined') {
    document.addEventListener('WeixinJSBridgeReady', () => resolve(), false)
  } else {
    resolve()
  }
})

export default class Share {
  opts: Options
  _config: Config
  setting: Promise<Object>

  constructor (options: Options) {
    this.opts = {
      sdkUrl: '',
      queryKey: 'url',
      ...options
    }
    this.setting = this.__wxsdk()
    WeixinJSBridgeReadyPromise.then(res => WeixinJSBridge.call('hideOptionMenu'))
  }
  __wxsdk () {
    return fetch(`${this.opts.sdkUrl}?${this.opts.queryKey}=${encodeURIComponent(location.href.split('#')[0])}`).then(function (res) {
      return res.json()
    }).then(function (res) {
      return res.succ ? res.data : {}
    }).then(function (data) {
      if (data.appId) {
        wx.config({
          debug: data.debug,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        })
      }
      return data
    })
  }
  __setWx () {
    let shareObj = {
      title: this._config.title,
      desc: this._config.desc,
      link: this._config.link,
      imgUrl: this._config.img,
      success: () => {
        this._config.success && this._config.success()
      },
      cancel: () => {
        this._config.cancel && this._config.cancel()
      }
    }
    wx.ready(() => {
      wx.onMenuShareTimeline(shareObj)
      wx.onMenuShareAppMessage(shareObj)
      wx.onMenuShareQQ(shareObj)
      wx.onMenuShareWeibo(shareObj)
      wx.onMenuShareQZone(shareObj)
      WeixinJSBridgeReadyPromise.then(res => WeixinJSBridge.call('showOptionMenu'))
    })
  }
  get config () {
    return {
      get title () {
        return this._config.title
      },
      set title (value) {
        this.config = {
          title: value
        }
      },
      get desc () {
        return this._config.desc
      },
      set desc (value) {
        this.config = {
          desc: value
        }
      },
      get link () {
        return this._config.link
      },
      set link (value) {
        this.config = {
          link: value
        }
      },
      get img () {
        return this._config.img
      },
      set img (value) {
        this.config = {
          img: value
        }
      }
    }
  }
  set config (value: Config) {
    let config = this._config || {}
    this._config = { ...config,...value }
    this._config.img = fixAchor(this._config.img).href
    this.setting.then(() => this.__setWx())
  }
}
