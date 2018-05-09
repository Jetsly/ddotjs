import { str } from './is'
/**
 * 微信支付
 * @param config wx配置
 * @param wxConfig 支付配置
 * @param debug 是否调试
 */
export function wxPay (config,wxConfig,debug= false): Promise<{response?: boolean,error?: string}> {
  config = str(config) ? JSON.parse(config) : config
  return new Promise((resolve) => {
    wx.config({
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: config.jsApiList,
      debug
    })
    wx.ready(() => {
      wx.chooseWXPay({
        timestamp: wxConfig.timestamp,
        nonceStr: wxConfig.nonceStr,
        package: wxConfig.package,
        signType: wxConfig.signType,
        paySign: wxConfig.paySign,
        success: () => resolve({ response: true }),
        cancel: () => resolve({ error: '取消支付！' }),
        fail: err => resolve({ error: `支付失败:${JSON.stringify(err)}` })
      })
    })
    wx.error(() => resolve({ error: 'wx配置异常!' }))
  })
}
