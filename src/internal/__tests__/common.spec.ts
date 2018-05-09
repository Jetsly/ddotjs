const assert = chai.assert
import * as common from '../common'

const IOS_WX = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/6.5.9 NetType/WIFI Language/zh_CN`
const ANDR_WX = `Mozilla/5.0 (Linux; Android 7.1.1; OPPO R11t Build/NMF26X; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043307 Safari/537.36 MicroMessenger/6.5.8.1060 NetType/WIFI Language/zh_CN`

describe('common', () => {
  it('query',() => {
    assert.deepEqual(common.query(`?a=cc&c&d=c`), {
      a: 'cc',
      c: '',
      d: 'c'
    })
  })
  it('cookie',() => {
    common.cookie({
      name: 'world',
      value: 'hello'
    })
    assert.equal(document.cookie, 'world=hello')
    assert.deepEqual(common.cookie(), {
      world: 'hello'
    })
  })
  it('isAndroid', () => common.isAndroid(ANDR_WX))
  it('isIOS', () => common.isIOS(IOS_WX))
  it('isWX', () => common.isWX(IOS_WX))
})
