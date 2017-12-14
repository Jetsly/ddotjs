const assert = chai.assert
import * as com from '../lo'
describe('lo', () => {
  it('query', () => {
    assert.deepEqual(com.query(`?a=cc&c&d=c`), {
      a: 'cc',
      c: '',
      d: 'c'
    })
  })

  it('cookie', () => {
    com.cookie({
      name: 'world',
      value: 'hello'
    })
    assert.equal(document.cookie, 'world=hello')
    assert.deepEqual(com.cookie(), {
      world: 'hello'
    })
  })
})
