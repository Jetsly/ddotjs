const assert = chai.assert
import * as cavs from '../canvas/cavs'
// describe('cavs',() => {
//   it('preloadImg',() => cavs.preloadImg('https://inimg02.jiuyan.info/in/2017/03/24/5F838417-1DDA-CE2A-14A6-7A0D0247301C-1wGMzYZ.jpg').then(img => {
//     assert.equal(img.naturalHeight,656)
//     assert.equal(img.naturalWidth,440)
//   }))
//   it('getTypeAndOrient',() => new Promise(resolve => {
//     let xhr = new XMLHttpRequest()
//     xhr.open('GET', '', true)
//     xhr.responseType = 'arraybuffer'
//     xhr.onload = function (e) {
//       let arrayBufferView = new Uint8Array(this.response)
//       resolve(new Blob([ arrayBufferView ], { type: 'image/jpeg' }))
//     }
//     xhr.send()
//   }).then(blob => {
//     return cavs.getTypeAndOrient(blob).then(({ type, orient }) => {
//       assert.equal(type,'jpg')
//       assert.equal(orient,6)
//     })
//   }))
// })
