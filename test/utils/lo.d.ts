/**
 * 查询url参数
 * @param search 为空时为 location.search
 */
export declare const query: (search?: string) => any;
/**
 * 查询或者设置cookie
 * @param obj 当空为获取，否则设置 {name:'',value:'',domain:location.hostname,expiredays}
 */
export declare const cookie: (obj?: any) => any;
