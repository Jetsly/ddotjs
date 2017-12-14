const assert = chai.assert
import * as is from '../is'
describe('is', () => {
  it('is func', () => {
    assert.isTrue(is.func((() => ({}))))
    assert.isFalse(is.func({}))
    assert.isFalse(is.func(1))
    assert.isFalse(is.func('1111'))
    assert.isFalse(is.func([]))
  })
  it('is number', () => {
    assert.isFalse(is.num((() => ({}))))
    assert.isFalse(is.num({}))
    assert.isTrue(is.num(1))
    assert.isFalse(is.num('1111'))
    assert.isFalse(is.num([]))
  })
  it('is string', () => {
    assert.isFalse(is.str((() => ({}))))
    assert.isFalse(is.str({}))
    assert.isFalse(is.str(1))
    assert.isTrue(is.str('1111'))
    assert.isFalse(is.str([]))
  })
  it('is array', () => {
    assert.isFalse(is.arr((() => ({}))))
    assert.isFalse(is.arr({}))
    assert.isFalse(is.arr(1))
    assert.isFalse(is.arr('1111'))
    assert.isTrue(is.arr([]))
  })
  it('is obj', () => {
    assert.isFalse(is.obj((() => ({}))))
    assert.isTrue(is.obj({}))
    assert.isFalse(is.obj(1))
    assert.isFalse(is.obj('1111'))
    assert.isFalse(is.obj([]))
  })
})
