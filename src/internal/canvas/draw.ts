import { preloadImg } from './cavs'
import { str,obj } from '../is'
/**
 * 画图
 * @param imgInfo 画布信息
 * @param imgs 图片数组 [url|canvas] 2选1
 */
export function imgWithImgs (imgInfo: {
  width: number,
  height: number
  bg?: string
}, ...imgs: Array<{
  x: number,
  y: number,
  width?: number,
  height?: number,
  url?: string,
  canvas ?: HTMLCanvasElement
}>) {
  const canvas = document.createElement('canvas')
  canvas.width = imgInfo.width
  canvas.height = imgInfo.height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = imgInfo.bg || '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  return Promise.all(imgs.map(img => (str(img) ? { url: img,canvas: null } : img))
    .map(img => (img.url ? preloadImg(img.url) : Promise.resolve(img.canvas))))
    .then(([...drawImgs]) => {
      drawImgs.forEach((itemImg, idx) => {
        const item = imgs[idx]
        ctx.save()
        if (obj(item) && (item.width || item.height)) {
          ctx.translate(item.x + (item.width / 2), item.y + (item.height / 2))
          // 设置裁剪区域
          ctx.globalAlpha = 0
          ctx.rect(-item.width / 2, -item.height / 2, item.width, item.height)
          ctx.clip()
          ctx.globalAlpha = 1
          const width = itemImg.naturalWidth
          const height = itemImg.naturalHeight
          const scale = Math.max(item.width / width, item.height / height)
          ctx.scale(scale, scale)
          ctx.drawImage(itemImg, 0, 0, width, height, -width / 2, -height / 2, width, height)
        } else {
          ctx.drawImage(itemImg, item.x , item.y)
        }
        ctx.restore()
      })
      return canvas
    })
}
