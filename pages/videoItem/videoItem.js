Page({

  data: {
    onLoad: true,
    listArr: [],
    openId: "",

  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.get_openid()

  },
  //获取openid
  get_openid: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'get_openId',
      complete: res => {
        console.log('云函数获取到的openid:')
        console.log(res.result)
        var openid = res.result.openId;
        if (openid != "") {
          that.setData({
            openId: openid
          })
          that.getRequest()
        } else {
          that.setData({
            openId: ""
          })
          that.get_openid()
        }
      }
    });

  },
  // 网络请求核心函数
  getRequest: function () {

    var that = this;
    var newsListArr = [];
    var temp_json = {
      "openId": this.data.openId
    };
    console.log(temp_json)
    wx.request({
      url: 'https://www.hzsmartnet.com/open/camera',
      data: {
        "openId": this.data.openId
      },
      method: "GET",

      success: function (res) {
        console.log("监控列表")
        console.log(res)
        newsListArr = res.data.data;

        for (var i = 0; i < newsListArr.length; i++) {
          if (newsListArr.url == "")
            newsListArr.url = "https://tx1.yunchuanglive.com/live/none.m3u8"
        }
        that.setData({
          listArr: newsListArr,
        })
        that.setData({
          onLoad: false
        })
        console.log("展示监控列表")
        console.log(that.data.listArr)
        wx.hideLoading()
      }
    })



  },

})