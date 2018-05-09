import { preloadImg } from './cavs'
import { str,obj } from '../is'
/**
 * 图片画贴纸点位
 * @param canvas
 * @param pasters 贴纸数组
 * @param faceInfo 点位信息
 * @param faceIdx 脸索引
 * @param ratio
 */
export function pointsPaster (canvas: HTMLCanvasElement,pasters,faceInfo,faceIdx= 0,ratio= 1.4) {
  let ctx = canvas.getContext('2d')
  const pointCountperFace = 52
  return Promise.all(pasters.map(paster => preloadImg(paster.url))).then(pasterImgs => {
    pasterImgs.forEach((pasterImg: HTMLImageElement,idx) => {
      ctx.save()
      const paster = pasters[idx]
      const point = faceInfo.point.slice((pointCountperFace * faceIdx) + (+paster.point * 2))
      const [x, y] = [point[0], point[1]]
      const rotate = paster.rotate + faceInfo.rotate[faceIdx]
      const scale = paster.scale * Math.abs(faceInfo.size[faceIdx]) * ratio
      ctx.translate(x, y)
      ctx.scale(paster.sw * scale, paster.sh * scale)
      ctx.rotate((rotate * Math.PI) / 180)
      ctx.drawImage(
        pasterImg, 0, 0, paster.w, paster.h,
        -1 * paster.alignx, -1 * paster.aligny, paster.w, paster.h
      )
      ctx.restore()
    })
    return canvas
  })
}

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
