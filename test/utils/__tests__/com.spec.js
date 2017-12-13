"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var com = require("../com");
var ava_1 = require("ava");
var lo = function (url) {
    var window = new jsdom_1.JSDOM('', { url: url }).window;
    global['window'] = window;
    global['location'] = window.location;
    global['document'] = window.document;
};
ava_1.default.before(function () {
    lo("https://example.org/?a=cc&c&d=c");
});
ava_1.default('query', function (t) {
    t.plan(2);
    t.deepEqual(com.query(), {
        a: 'cc',
        c: '',
        d: 'c'
    });
    t.deepEqual(com.query("?a=cc&c&d=c"), {
        a: 'cc',
        c: '',
        d: 'c'
    });
});
ava_1.default('cookie', function (t) {
    t.plan(2);
    com.cookie({
        name: 'world',
        value: 'hello'
    });
    t.is(global['document'].cookie, 'world=hello');
    t.deepEqual(com.cookie(), {
        world: 'hello'
    });
});
//# sourceMappingURL=com.spec.js.map