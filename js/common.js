/*
*
* Common js file, do the http things
*
* */
var live_url="http://live.tt519.com/";  //直播请求域名

// var base_url="http://localhost:8000/api/";
var base_url="http://loliloli.pro/api/";  //定义请求地址的前缀

function jsonRequest(path,params,callBack,errorCallBack){
    console.log("request url is "+path);
    $.ajax({
        url:path,
        cache: false, //关闭AJAX缓存
        type:"post",
        dataType:"json",
        data:params,
        success:callBack,
        error:errorCallBack
    })
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function deleteRequest(path,params,callBack,errorCallBack){
    $.ajax({
        url:path,
        type:"DELETE",
        dataType:"json",
        data:params,
        success:callBack,
        error:errorCallBack
    })
}
function getRequest(path,params,callBack,errorCallBack){
    console.log("request url is "+path);
    $.ajax({
        url:path,
        cache: false, //关闭AJAX缓存
        type:"get",
        data:params,
        dataType:"json",
        success:callBack,
        error:errorCallBack
    })
}
function getSendRequest(path,params,send,callBack,errorCallBack){
    $.ajax({
        url:path,
        cache: false, //关闭AJAX缓存
        type:"get",
        dataType:"json",
        data:params,
        beforeSend:send,
        success:callBack,
        error:errorCallBack
    })
}
function httpRequest(path,params,send,callBack,errorCallBack){
    $.ajax({
        url:path,
        cache: false, //关闭AJAX缓存
        type:"post",
        dataType:"json",
        data:params,
        beforeSend:send,
        success:callBack,
        error:errorCallBack
    })
}
//底部跳转链接
function go_index(){ window.location.href='../index.html'}
function go_selected(){ window.location.href='../selected/owner-selection.html'}
function go_classify(){ window.location.href='../classify/classify.html'}
function go_cart(){ window.location.href='../cart/shopping-cart.html'}
function go_my(){ window.location.href='../my/my-index.html'}

//静态页面传参
UrlParm = function() { // url参数
    var data, index;
    (function init() {
        data = [];
        index = {};
        var u = window.location.search.substr(1);
        if (u != '') {
            var parms = decodeURIComponent(u).split('&');
            for (var i = 0, len = parms.length; i < len; i++) {
                if (parms[i] != '') {
                    var p = parms[i].split("=");
                    if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
                        data.push(['']);
                        index[p[0]] = data.length - 1;
                    } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =
                        data[0] = [p[1]];
                    } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa
                        data.push([p[1]]);
                        index[p[0]] = data.length - 1;
                    } else {// c=aaa
                        data[index[p[0]]].push(p[1]);
                    }
                }
            }
        }
    })();
    return {
        // 获得参数,类似request.getParameter()
        parm : function(o) { // o: 参数名或者参数次序
            try {
                return (typeof(o) == 'number' ? data[o][0] : data[index[o]][0]);
            } catch (e) {
            }
        },
        //获得参数组, 类似request.getParameterValues()
        parmValues : function(o) { //  o: 参数名或者参数次序
            try {
                return (typeof(o) == 'number' ? data[o] : data[index[o]]);
            } catch (e) {}
        },
        //是否含有parmName参数
        hasParm : function(parmName) {
            return typeof(parmName) == 'string' ? typeof(index[parmName]) != 'undefined' : false;
        },
        // 获得参数Map ,类似request.getParameterMap()
        parmMap : function() {
            var map = {};
            try {
                for (var p in index) {  map[p] = data[index[p]];  }
            } catch (e) {}
            return map;
        }
    }
}();
//end静态页面传参
//四舍五入，保留2位小数
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x*100)/100;
    return f;
}
//四舍五入，保留2位小数（整数后加.00）
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

/*
 storage 主要放项目中的storage相关操作：存取等
 */
var storage = {
    /**
     对本地数据进行操作的相关方法，如localStorage,sessionStorage的封装
     */
    setStorage: function(key, value, duration) {
        var data = {
            value: value,
            expiryTime: !duration || isNaN(duration) ? 0 : this.getCurrentTimeStamp() + parseInt(duration)
        };
        localStorage[key] = JSON.stringify(data);
    },
    getStorage: function(key) {
        var data = localStorage[key];
        if (!data || data === "null") {
            return null;
        }
        var now = this.getCurrentTimeStamp();
        var obj;
        try {
            obj = JSON.parse(data);
        } catch (e) {
            return null;
        }
        if (obj.expiryTime === 0 || obj.expiryTime > now) {
            return obj.value;
        }
        return null;
    },
    removeStorage: function(key){
        localStorage.removeItem(key);
    },
    getSession: function(key) {
        var data = sessionStorage[key];
        if (!data || data === "null") {
            return null;
        }
        return JSON.parse(data).value;

    },
    setSession: function(key, value) {
        var data = {
            value: value
        }
        sessionStorage[key] = JSON.stringify(data);
    },
    getCurrentTimeStamp: function() {
        return Date.parse(new Date());
    }
};

//屏蔽浏览器查看源码
// document.onkeydown = function() {
//       var e = window.event || arguments[0];
//       if(e.keyCode == 123) {       //屏蔽F12
//           return false;
//       }else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {      //屏蔽Ctrl+Shift+I
//           return false;
//       }else if((e.shiftKey) && (e.keyCode == 121)){           //屏蔽Shift+F10
//           return false;
//       }
// };
// //屏蔽右键单击
// document.oncontextmenu = function() {
//     return false;
// };
