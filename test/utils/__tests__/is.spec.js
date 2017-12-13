"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var is = require("../is");
ava_1.default('is func', function (t) {
    t.plan(5);
    t.true(is.func((function () { return ({}); })));
    t.false(is.func({}));
    t.false(is.func(1));
    t.false(is.func('1111'));
    t.false(is.func([]));
});
ava_1.default('is number', function (t) {
    t.plan(5);
    t.false(is.num(function () { return ({}); }));
    t.false(is.num({}));
    t.true(is.num(1));
    t.false(is.num('1111'));
    t.false(is.num([]));
});
ava_1.default('is string', function (t) {
    t.plan(5);
    t.false(is.str(function () { return ({}); }));
    t.false(is.str({}));
    t.false(is.str(1));
    t.true(is.str('1111'));
    t.false(is.str([]));
});
ava_1.default('is array', function (t) {
    t.plan(5);
    t.false(is.arr(function () { return ({}); }));
    t.false(is.arr({}));
    t.false(is.arr(1));
    t.false(is.arr('1111'));
    t.true(is.arr([]));
});
ava_1.default('is obj', function (t) {
    t.plan(5);
    t.false(is.obj(function () { return ({}); }));
    t.true(is.obj({}));
    t.false(is.obj(1));
    t.false(is.obj('1111'));
    t.false(is.obj([]));
});
//# sourceMappingURL=is.spec.js.map