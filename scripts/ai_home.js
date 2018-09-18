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
            '0': '全部',
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
            '0': '全部',
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
            '0': '全部',
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
        isSuccess: false,

        currentLan: '全部',
        currentFramework: '全部',
        currentCat: '全部',
        isShowNoMore: false,
    },
    created: function () {
        // http methods
        var vm = this;


        var aicodesUrl = base_url + 'v1/ai_codes?page=' + vm.currentPage;
        var params;
        // get the articles
        getRequest(aicodesUrl, params, function (data) {
            console.log(data);
            if (data.status == 'success') {
                // not append, but remove all
                vm.allAiCodes = data.data;
                // if (vm.allArticles.length > 0) {
                //     vm.currentPage += 1
                // } else {
                //     vm.currentPage += 1
                // }
            } else {
                console.log('fuck!!')
            }
        });
    },

    methods: {
        jumpDetail: function (aicode) {
            console.log('did click detail?');
            // jump detail
            var aicodeStr = JSON.stringify(aicode);

            // save to local
            // 500s之后这个值自动消失
            var aicodeID = aicode.code_id;
            storage.setStorage(aicodeID, aicodeStr, 3491500);
            // window.location.href = ;
            window.open("aicodes_detail.html?id=" + aicode.code_id);
        },

        nextPage: function () {
            vm.currentPage += 1;
            var articleUrl = base_url + 'v1/ai_codes?page=' + vm.currentPage;
            var params;
            getRequest(articleUrl, params, function (data) {
                console.log(data);
                if (data.status == 'success') {
                    vm.allAiCodes = data.data;
                } else {
                    console.log('fuck!!');
                    vm.isShowNoMore = true;
                }
            });
        },
        prevPage: function () {
            vm.currentPage -= 1;
            var articleUrl = base_url + 'v1/ai_codes?page=' + vm.currentPage;
            var params;
            getRequest(articleUrl, params, function (data) {
                console.log(data);
                if (data.status == 'success') {
                    vm.allAiCodes = data.data;
                } else {
                    console.log('fuck!!');
                    vm.isShowNoMore = true;
                }
            });
        },
        filterFramework: function (i) {
            vm.currentFramework = i;
            $('#collapse-framework').collapse('close');
            // all vm.allAiCodes filter by the code_framework index

        },
        filterLan: function (i) {
            vm.currentLan = i;
            $('#collapse-lan').collapse('close');

        },
        filterCat: function (i) {
            vm.currentCat = i;
            $('#collapse-cat').collapse('close');
        },

        sortTime:function () {
            $('#collapse-sort').collapse('close');
        },
        sortStar:function () {
            $('#collapse-sort').collapse('close');

        },
        sortPrice:function () {
            $('#collapse-sort').collapse('close');

        },
        sortDownload:function () {
            $('#collapse-sort').collapse('close');

        },

        submit: function () {
            vm.isSuccess = true;
        },
        close: function () {
            vm.isShowNoMore = false;
        }


    }
});
