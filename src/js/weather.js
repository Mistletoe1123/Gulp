
const ajax = options => new Promise((resolve, reject) => {


    let isObject = Object.prototype.toString.call(options).replace(/[\[\]]/g, "").substr(7)
    if (isObject !== 'Object') {
        throw new Error('Must be a  Object but a ') + isObject;
    }


    //默认对象，和传入对象混合
    let defaultOption = {
        url: "",
        method: "get",
        responseType: "json",
        async: true,
        data: {},
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {

        },
        error: function (e) {

        }
    }


    for (k in options) {
        if (k === 'method') {
            defaultOption[k] = options[k].toLowerCase()
        } else {
            defaultOption[k] = options[k]
        }
    }

    //测试在ajax中传参能否改变默认值
    /* console.log(defaultOption);
    defaultOption.success() */


    //直接传到open中太长，解构赋值快速拿出来
    let { url, method, async, data, headers, responseType, success, error } = defaultOption

    //创建
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest;
    } else {
        xhr = new ActiveXObject('microsoft.XMLHTTP')
    }


    //处理data数据 
    let params = ""     //params存储处理好的data
    //如何判断一个空对象
    if (JSON.stringify(data) !== "{}") {
        for (k in data) {
            //key=all&city=上海
            params += k + '=' + data[k] + '&'
        }
        params = params.substr(0, params.length - 1)
    }


    //url=http://www.chst.vip/weather/getWeather
    //但是 只有是get，并且传了参数 的时候才要拼接
    //!!params && method === 'get' ? "?" + params : ""
    // console.log(url + (!!params && method === 'get' ? "?" + params : ""));
    xhr.open(method, url + (!!params && method === 'get' ? "?" + params : ""), async);


    //处理post中的headers
    if (typeof headers !== "object") {
        error("请求头传递的是一个空对象", xhr)
        if (JSON.stringify(headers) === "{}") {
            //错误回调
            reject('headers must be a object but a ' + typeof headers)
            throw new Error('headers must be a object but a ' + typeof headers)
        }
    }
    for (h in headers) {
        if (h.toLowerCase() === 'content-type' && method === 'post' && JSON.stringify(data) !== "{}") {
            if (headers[h].toLowerCase() === 'application/json') {
                params = JSON.stringify(data)
            }
        }
        //设置请求头
        xhr.setRequestHeader(h, headers[h])
    }
    // console.log(params);


    xhr.send(method !== 'post' ? null : params);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // console.log(xhr.responseText);
                let res = xhr.responseText;
                switch (responseType.toLowerCase()) {
                    case "text":
                        resolve(res)
                        success(res);
                        break;
                    case "json":
                        resolve(res)
                        success(JSON.parse(res));
                        break;
                    default:
                        resolve(res)
                        success(res)
                }
            }
        }
    }

    xhr.onerror = function (e) {
        reject(e, xhr)
        error(e, xhr)
    }
})
