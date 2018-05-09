const assert = chai.assert
import * as http from '../net/http'
let fetchMock = require('fetch-mock')
const json = data => ({
  sendAsJson: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  body: data
})

fetchMock.mock('a',(url,opts) => Promise.resolve(opts.method))
fetchMock.mock('b',json({ hello: 'world' }))

http.interceptors.response.use(res => res)

describe('http', () => {
  it('get text', () => http.get({ url: 'a' }).then(res => assert.deepEqual(res.data,'GET')))
  it('post text', () => http.post({ url: 'a' }).then(res => assert.deepEqual(res.data,'POST')))
  it('delete text', () => http.del({ url: 'a' }).then(res => assert.deepEqual(res.data,'DELETE')))
  it('put text', () => http.put({ url: 'a' }).then(res => assert.deepEqual(res.data,'PUT')))
  it('head text', () => http.head({ url: 'a' }).then(res => assert.deepEqual(res.data,'HEAD')))

  it('get json', () => http.get({ url: 'b' }).then(res => assert.deepEqual(res.data,{ hello: 'world' })))
  it('post json', () => http.post({ url: 'b' }).then(res => assert.deepEqual(res.data,{ hello: 'world' })))
  it('delete json', () => http.del({ url: 'b' }).then(res => assert.deepEqual(res.data,{ hello: 'world' })))
  it('put json', () => http.put({ url: 'b' }).then(res => assert.deepEqual(res.data,{ hello: 'world' })))
  it('head json', () => http.head({ url: 'b' }).then(res => assert.deepEqual(res.data,{ hello: 'world' })))
})
