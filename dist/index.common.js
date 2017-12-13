/*!
    * ddot v0.0.1
    * (c) 2017-2017 jetsly@live.cn
    * Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 判断是不是方法
 * @param f
 */
var func = function (f) { return typeof f === 'function'; };
/**
 * 判断是不是数字
 * @param f
 */
var num = function (f) { return typeof f === 'number' && !isNaN(f); };
/**
 * 判断是不是字符串
 * @param f
 */
var str = function (f) { return typeof f === 'string'; };
/**
 * 判断是不是对象
 * @param f
 */
var obj = function (f) { return typeof f === 'object' && !Array.isArray(f); };
/**
 * 判断是不是数组
 * @param f
 */
var arr = function (f) { return Array.isArray(f); };



var is = Object.freeze({
	func: func,
	num: num,
	str: str,
	obj: obj,
	arr: arr
});

function __splitData(str, delimiter, decodeKey, decodeValue) {
    if (str.trim().length === 0)
        return {};
    return str.split(delimiter).reduce(function (info, item) {
        var _a = item.trim().split('='), key = _a[0], _b = _a[1], val = _b === void 0 ? '' : _b;
        info[decodeKey(key)] = decodeValue(val);
        return info;
    }, {});
}
/**
 * 查询url参数
 * @param search 为空时为 location.search
 */
var query = function (search) {
    if (search === void 0) { search = location.search; }
    return __splitData(search.substr(1), '&', function (key) { return key.replace(/-+(.)?/g, function (match, chr) { return chr ? chr.toUpperCase() : ''; }); }, decodeURIComponent);
};
/**
 * 查询或者设置cookie
 * @param obj 当空为获取，否则设置 {name:'',value:'',domain:location.hostname,expiredays}
 */
var cookie = function (obj) {
    if (obj === undefined) {
        return __splitData(document.cookie, ';', function (key) { return key; }, unescape);
    }
    var name = obj.name, value = obj.value, _a = obj.domain, domain = _a === void 0 ? location.hostname : _a, expiredays = obj.expiredays;
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expiredays);
    var expireStr = expiredays === undefined ? '' : ';expires=' + exdate.toUTCString();
    document.cookie = name + "=" + escape(value) + ";domain=" + domain + ";path=/;" + expireStr;
    return cookie();
};



var com = Object.freeze({
	query: query,
	cookie: cookie
});

exports.is = is;
exports.com = com;
