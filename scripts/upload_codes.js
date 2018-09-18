/**
 * Created by jintian on 2018/8/19.
 */
var vm = new Vue({
    el: '#app',
    data: {
        allAiCodes: [],
        currentPage: 1,
        perPage: 10,
        hasMore: true,
        frameworkMap: {
        '1': 'TensorFlow',
        '2': 'PyTorch',
        '3': 'Caffe',
        '4': 'Caffe2',
        '5': 'Chainer',
        '6': 'Keras',
        '7': 'MXNet',
        '8': 'CNTK',
        '9': 'Others',
        },
        lanMap: {
        '1': 'C++',
        '2': 'Python2',
        '3': 'Python3',
        '4': 'Lua',
        '5': 'Julia',
        '6': 'JS',
        '7': 'Go',
        '8': 'Rust',
        '9': 'Perl',
        '10': 'C',
        '11': 'Others',
        },
        catClass1: {
        '1': '计算机视觉(CV)',
        '2': '自然语言(NLP)',
        '3': '强化学习(RL)',
        '4': '元学习(UL)',
        '5': '机器学习(ML)',
        '6': '通用AI(GAI)',
        '7': '语音合成与识别',
        '8': '自动驾驶',
        '9': '智能对话',
        '10': '知识图谱',
        '11': 'GAN',
        '12': 'Others',
        },
        currentAiCode: null,
        codeId: 0,
        isShowLoading: true,
        isLogin: false,
        isFree: false,
        isShareImgReady: false,
        isRegisterSuccess: false,

        ip5: "",
        token: "",
        user: null,
    },
    created: function () {
        // http methods
        var vm = this;

        // 用户初始化，查找是否有token，有的话直接访问请求用户信息
        vm.token = storage.getStorage('token');
        console.log(vm.token);
        if (vm.token != null && vm.token != "") {
            console.log('find token: ', vm.token);
            // do the other things
            vm.isLogin = true;
            // request for user
            var userUrl = base_url + 'v2/users?token=' + vm.token;
            var params;
            getRequest(userUrl, params, function (data) {
                if (data.status == 'success') {
                    console.log('login success, got user.');
                    console.log(data.data);
                    vm.user = data.data;
                }
            });

        } else {
            console.log('Not find token, user not login.');
        }

        // 上一个页面传来的aicode
        vm.codeId = UrlParm.parm('id');
        var aiCode = storage.getStorage(vm.codeId);
        if (aiCode == null) {
            // request by ID from server
            var aicodesUrl = base_url + 'v1/ai_codes?news_id=' + vm.codeId;
            var params;
            getRequest(aicodesUrl, params, function (data) {
                    if (data.status == 'success') {
                        // not append, but remove all
                        vm.currentAiCode = data.data;
                        console.log('price: ', vm.currentAiCode.code_price);
                        if (parseFloat(vm.currentAiCode.code_price) === 0) {
                            vm.isFree = true;
                        }
                    } else {
                        console.log('fuck!!')
                    }
            });
        }else {
            vm.currentAiCode = JSON.parse(aiCode);
            if (parseFloat(vm.currentAiCode.code_price) === 0) {
                vm.isFree = true;
            }
        }

        jQuery(function(){
            jQuery('#share-qrcode').qrcode({
                text: 'http://ai.loliloli.pro/' + 'aicodes_detail.html?id=' + vm.codeId,
                width: 60,
                height: 60,
            });
        })
    },

    computed: {
        compiledMarkdown: function () {
            if (this.currentAiCode == null) {
            } else {
                this.isShowLoading = false;
                return marked(this.currentAiCode.code_readme, { sanitize: true })
            }
        }
    },

    methods: {
        update: _.debounce(function (e) {
            this.input = e.target.value
        }, 300),

        jumpDetail: function (aicode) {
            // jump detail
            var aicodeStr = JSON.stringify(aicode);
            // save to local
            // 500s之后这个值自动消失
            var aicodeID = aicode.code_id;
            storage.setStorage(aicodeID, aicodeStr, 3491500);
            window.location.href = "aicodes_detail.html";
        },
        register: function () {
            // do register action
            var registerUrl = base_url + 'v2/users';
            var mail = this.$refs.ip1.value;
            var pwd = this.$refs.ip2.value;
            var pwdRp = this.$refs.ip3.value;
            var userName = this.$refs.ip4.value;
            console.log(mail, pwd, pwdRp, userName);

            if (!validateEmail(mail)) {
                alert('邮箱格式不正确')
            } else if (userName === '') {
                alert('填写你的姓名哦~');
            } else if (pwd !== pwdRp)  {
                alert('密码不一致， ' + pwd + ' vs. ' + pwdRp);
            } else {
                var params = {
                    "user_name": userName,
                    "user_email": mail,
                    "user_password": pwd,
                    "user_gender": '',
                    "user_avatar": '',
                    "user_birthday": '1993-12-11',
                    "user_major": '',
                    "user_phone": '',
                    "user_school": '',
                    "user_sign": '',
                    "user_wechat": '',
                };
                jsonRequest(registerUrl, params, function (data) {
                    if (data.status == 'success') {
                        // not append, but remove all
                        // register success, reload page
                        vm.isRegisterSuccess = true;
                        // save token to local
                        var token = data.data.token;
                        storage.setStorage('token', token, 90 * 24 * 60 * 60);
                        location.reload();
                        // location.reload();
                        // window.location.href = "aicodes_detail.html";

                    } else if (data.status == 'info') {
                        alert('用户 ' + mail + ' 已经存在，请登录 ');
                        vm.ip5 = mail;
                    } else {
                        console.log('fuck!!');
                        alert('注册失败，请稍后重试');
                    }
                });
            }

        },
        login: function () {
          // do the login action
            var loginUrl = base_url + 'v2/login';
            var mail = this.$refs.ip5.value;
            var pwd = this.$refs.ip6.value;
            var params = {
                "user_email": mail,
                "user_password": pwd,
            };
            var params = JSON.stringify(params);
            jsonRequest(loginUrl, params, function (data) {
                if (data.status == 'success') {
                    vm.isLogin = true;
                    var token = data.data.token;
                    storage.setStorage('token', token, 90 * 24 * 60 * 60);
                    location.reload();
                } else if (data.status == 'info') {
                    alert('用户 ' + mail + ' 不存在，请先注册 ');
                } else if (data.status == 'fail') {
                    alert('密码不对');
                } else {
                    alert('登录失败');
                }
            });
        },

        nextPage: function () {
            vm.currentPage += 1;
            var articleUrl = base_url + 'v1/news?page=' + vm.currentPage;
            jsonRequest(articleUrl, params, function (data) {
                if (data.status == 'success') {
                    vm.allArticles = data.data;
                } else {
                    console.log('fuck!!')
                }
            });
        },
        convertCanvasToImage: function (canvas) {
            var image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
            // 指定格式 PNG
            image.src = canvas.toDataURL("image/png");
            return image;
        },

        generateShareImg: function () {
            console.log("Generate img....");
            var pic;
            var finalCanvas = document.createElement("canvas");
            var _canvas = document.querySelector('#card-to-show');
            var w = parseInt(window.getComputedStyle(_canvas).width);
            var h = parseInt(window.getComputedStyle(_canvas).height);
            _canvas.style.width =  w + 'px';
            _canvas.style.height = h + 'px';
            var context = finalCanvas.getContext("2d");
            context.scale(4, 4);
            html2canvas(document.querySelector('#card-to-show'), {
                canvas: finalCanvas,
//                    allowTaint: true,
                useCORS: true,
            }).then(function (canvas) {

                pic = canvas;
                console.log(canvas.toDataURL());
                $('#share-img-placeholder').attr('src', canvas.toDataURL());
                // $('#card-to-show').se;
                vm.isShareImgReady = true;

                // $('#share-img').on('click', function () {
                //     layer.message("将页面底部的图片保存到本地即可分享~")
                // });
            });
        },

    }
});
