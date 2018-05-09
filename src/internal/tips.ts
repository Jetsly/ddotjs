/**
 * toast
 * @param msg 消息
 * @param millisecond 豪秒数
 */
export function toast (msg, millisecond = 3000): Promise<boolean> {
  function removeToastDom () {
    const oldDom = document.getElementsByClassName('hint-box')[0]
    if (oldDom) {
      document.body.removeChild(oldDom)
    }
    return true
  }
  return new Promise(resolve => {
    removeToastDom()
    const hitEle = document.createElement('div')
    hitEle.setAttribute('class', 'hint-box')
    hitEle.innerHTML = msg
    document.body.appendChild(hitEle)
    setTimeout(() => resolve(), millisecond)
  }).then(() => removeToastDom())
}
