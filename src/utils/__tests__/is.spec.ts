const assert = chai.assert
import * as is from '../is'

const typeCheck = (idx,func) => {
  [ null , () => ({}) , 1 , '111' , [] , {} , false , undefined ].forEach((type,_idx) => {
    (_idx === idx ? assert.isTrue : assert.isFalse)(func(type),`paramIdx: ${_idx} param ${type}`)
  })
}

const instanceCheck = (idx,func) => {
  [ Promise.resolve() , function* () { console.log(1) } ].forEach((type,_idx) => {
    (_idx === idx ? assert.isTrue : assert.isFalse)(func(type),`paramIdx: ${_idx} param ${type}`)
  })
}
describe('is', () => {
  it('is func', () => typeCheck(1,is.func))
  it('is number', () => typeCheck(2,is.num))
  it('is string', () => typeCheck(3,is.str))
  it('is array', () => typeCheck(4,is.arr))
  it('is obj', () => typeCheck(5,is.obj))
  it('is bool', () => typeCheck(6,is.bool))
  it('is symbol', () => {
    typeCheck(-1,is.symbol)
    assert.isTrue(is.symbol(Symbol('aa')))
  })

  it('is promise',() => instanceCheck(0,is.promise))
  it('is generator',() => instanceCheck(1,is.generator))
})
