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
export var query = function (search) {
    if (search === void 0) { search = location.search; }
    return __splitData(search.substr(1), '&', function (key) { return key.replace(/-+(.)?/g, function (match, chr) { return chr ? chr.toUpperCase() : ''; }); }, decodeURIComponent);
};
/**
 * 查询或者设置cookie
 * @param obj 当空为获取，否则设置 {name:'',value:'',domain:location.hostname,expiredays}
 */
export var cookie = function (obj) {
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
