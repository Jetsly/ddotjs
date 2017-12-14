
/**
 * 修正请求地址
 * @param url 地址
 */
function fixAchor (url) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.href.replace(/https?:/,location.protocol)
  return anchor
}

/**
 * 预加载图片
 * @param src
 */
export const preloadImg = src => new Promise<HTMLImageElement>((resolve,reject) => {
  const img = new Image()
  const anchor = fixAchor(src)
  // cross domain (除了base64 和 当前域名)
  if (!(/^data:image/.test(anchor.href) || location.host === anchor.host)) {
    img.crossOrigin = ''
  }
  img.onload = () => resolve(img)
  img.onerror = () => reject(img)
  img.src = anchor.href
})
