const assert = chai.assert
import * as csv from '../csv'
describe('csv',() => {
  it('preloadImg',() => {
    return csv.preloadImg('https://inimg02.jiuyan.info/in/2017/03/24/5F838417-1DDA-CE2A-14A6-7A0D0247301C-1wGMzYZ.jpg').then(img => {
      assert.equal(img.naturalHeight,656)
      assert.equal(img.naturalWidth,440)
    })
  })

})
