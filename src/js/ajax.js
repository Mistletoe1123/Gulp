

function core(defaultOption, resolve, reject) {
    console.log(resolve, reject);
    console.log(defaultOption);
    //解构赋值
    let { url, method, async, data, headers, success, responseType, error } = defaultOption;

    //2.创建ajax对象
    let xhr;
    if (window.XMLHttpRequest) {
        //现代浏览器
        xhr = new XMLHttpRequest()
    } else {
        //兼容IE浏览器
        xhr = new ActiveXObject('microsoft.XMLHTTP')
    }

    //3.处理传入参数data

    let params = ""; //用户存储处理好的参数

    //把 data: {key: "all",city: "上海"}处理成 key=all&city=上海

    //首先处理的data不能是一个{}

    if (JSON.stringify(data) !== "{}") {
        //不是个空对象
        for (k in data) {
            params += k + "=" + data[k] + "&"
        }
        //'key=all&city=上海&'
        params = params.substr(0, params.length - 1) //为了去掉最后面的&符号

    }

    //4.发送请求
    //这里需要携带参数

    //get请求的参数是拼接在地址后面的 ?name=李磊

    //传递参数需要先判断是不是get请求,并且有没有传递参数,还要考虑用户传递是不是一个大写的get,统一转成小写

    //代码的含义
    //因为params是通过data处理得来的,所以要保证用户传递了data并且是get请求
    //需要使用?+params参数 => ?key=all&city=上海
    //url的结果是http://chst.vip/weather/getWeather
    //最终拼接的结果http://chst.vip/weather/getWeather?key=all&city=上海
    // console.log(url + (!!params && method === 'get' ? "?" + params : ""));
    xhr.open(method, url + (!!params && method === 'get' ? "?" + params : ""), async)

    //post要放在send里面

    //application/json => 传递json

    //x-www-form-urlencoded =>传字符串 name=李磊&age=30

    //处理post请求的参数

    //根据请求头处理
    // console.log(headers);
    if (typeof headers === 'object') {//如果header不是一个对象
        if (JSON.stringify(headers) === "{}") { //如果header是一个空对象
            error("请求头传递的是一个空对象", xhr)
        }
    } else {
        if (async) reject("headers expected object but got a " + typeof headers);
        throw new Error("headers expected object but got a " + typeof headers);
    }

    for (h in headers) { //在上面解构了
        //判断content-type这个请求头
        //必须保证是post请求,并且data不是一个空对象
        if (h.toLowerCase() === "content-type" && method === "post" && JSON.stringify(data) !== "{}") {
            // console.log(h);
            //再判断值是不是application/json
            if (headers[h].toLowerCase() === "application/json") {
                //将传入的data转换成json格式
                params = JSON.stringify(data)
            }
        }
        //设置请求头
        xhr.setRequestHeader(h, headers[h])
    }

    // console.log(params);

    xhr.send(method !== "post" ? null : params)


    //同步到这里就结束了

    if (!async) {
        //如果是同步,这里就直接返回结果
        // console.log(xhr.responseText);
        return responseType === "json" ? JSON.parse(xhr.responseText) : xhr.responseText
    }


    //5响应

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                //成功
                let res = xhr.responseText;//获取响应的结果
                switch (responseType.toLowerCase()) {
                    case "text": //返回纯文本
                        success(res);
                        if (async) resolve(res)
                        break
                    case 'json'://返回json
                        success(JSON.parse(res))
                        if (async) resolve(JSON.parse(res))
                        break;
                    default:
                        success(res);
                        if (async) resolve(res)
                }
            }
        }
    }

    xhr.onerror = function (e) {
        //处理错误
        error(e, xhr)
        //失败的状态
        if (async) reject(e, xhr)
    }
}


function ajax(options) {
    //面试题,判断一个参数是不是null类型
    //如果传入的是一个null
    //通过下面这个方法来判断数据类型
    // Object.prototype.toString.call([]).replace(/[\[\]]/g,"").substr(7)

    //1.确保传入的是一个对象
    let isObject = Object.prototype
        .toString.call(options)
        .replace(/[\[\]]/g, "")
        .substr(7)
        .toLowerCase()

    if (isObject !== 'object') {
        //传入的不是一个对象,抛出异常

        throw new Error('传入的必须是一个对象, the param expected a object,but got a ' + isObject)
        //下面的代码不会执行
    }

    //默认对象,需要和传入的options进行混合,mix
    let obj = {
        url: "fsdfsdf",
        success: function () {

        }
    }


    let defaultOption = {
        url: "",//请求地址
        method: "get",//请求方式,默认为
        responseType: "json",//返回JSON或者纯文本取值范围 json/text
        data: {},//需要传递的参数
        async: true,//默认是异步的
        headers: { //请求头
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {//请求成功回调的函数

        },
        error: function (e) { //请求失败回调的函数

        }
    }

    //让此对象,和传入的对象混合,考虑到将来用户传入的参数不全,那么没传的参数采用默认值
    //传了的参数,值就=传入的参数
    // { url: 'http://chst.vip/weather/getWeather',method:"GET"}
    for (k in options) { //两个对象混入的方法(mix)
        if (k === 'method') {
            defaultOption[k] = options[k].toLowerCase()
        } else {
            defaultOption[k] = options[k];
        }

    }
    //判断是同步还是异步
    if (!defaultOption.async) {
        //如果不是异步
        return core(defaultOption)
    } else {
        return new Promise((resolve, reject) => {
            core(defaultOption, resolve, reject)
        })
    }
}