import test from 'ava'
import * as is from '../is'

test('is func', (t) => {
  t.plan(5)
  t.true(is.func((() => ({}))))
  t.false(is.func({}))
  t.false(is.func(1))
  t.false(is.func('1111'))
  t.false(is.func([]))
})

test('is number', (t) => {
  t.plan(5)
  t.false(is.num(() => ({})))
  t.false(is.num({}))
  t.true(is.num(1))
  t.false(is.num('1111'))
  t.false(is.num([]))
})

test('is string', (t) => {
  t.plan(5)
  t.false(is.str(() => ({})))
  t.false(is.str({}))
  t.false(is.str(1))
  t.true(is.str('1111'))
  t.false(is.str([]))
})

test('is array', (t) => {
  t.plan(5)
  t.false(is.arr(() => ({})))
  t.false(is.arr({}))
  t.false(is.arr(1))
  t.false(is.arr('1111'))
  t.true(is.arr([]))
})

test('is obj', (t) => {
  t.plan(5)
  t.false(is.obj(() => ({})))
  t.true(is.obj({}))
  t.false(is.obj(1))
  t.false(is.obj('1111'))
  t.false(is.obj([]))
})
