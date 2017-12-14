import { JSDOM } from 'jsdom'
import * as com from '../lo'
import test from 'ava'

const lo = url => {
  const { window } = new JSDOM('', { url: url })
  global['window'] = window
  global['location'] = window.location
  global['document'] = window.document
}

test.before(() => {
  lo(`https://example.org/?a=cc&c&d=c`)
})

test('query', t => {
  t.plan(2)
  t.deepEqual(com.query(), {
    a: 'cc',
    c: '',
    d: 'c'
  })
  t.deepEqual(com.query(`?a=cc&c&d=c`), {
    a: 'cc',
    c: '',
    d: 'c'
  })
})

test('cookie', t => {
  t.plan(2)
  com.cookie({
    name: 'world',
    value: 'hello'
  })
  t.is(global['document'].cookie, 'world=hello')
  t.deepEqual(com.cookie(), {
    world: 'hello'
  })
})
