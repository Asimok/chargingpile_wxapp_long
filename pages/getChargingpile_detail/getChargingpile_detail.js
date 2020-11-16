Page({

  data: {
    onLoad: true,
    listArr: [],
    open_id: "",
    bsId: ''
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    //解析上一个页面传来的 bsid 
    console.log('解析上一个页面传来的 bsid')
    console.log(options)
    this.data.bsId = options.bsId
    this.get_openid()
    this.getRequest()
  },

  // 网络请求核心函数
  getRequest: function () {

    var that = this;
    var newsListArr = [];

    wx.request({
      url: 'https://www.hzsmartnet.com/chargepile/restpos',
      data: {
        "bsId": this.data.bsId
      },
      method: "GET",

      success: function (res) {
        console.log("车棚数据")
        console.log(res)
        console.log('长度')
        console.log(res.data.data.length)


        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].RTNos = String(res.data.data[i].RTNos);
          res.data.data[i].RTNos_num = String(res.data.data[i].RTNos).split(",").length;

          if (i == res.data.data.length - 1)
            that.setData({
              onLoad: false
            })
        }
        newsListArr = res.data.data;

        // 
        if (!res.data.data.length) {
          that.setData({
            onLoad: false
          })
        }
        that.setData({
          listArr: newsListArr,
        })

        console.log("展示车棚信息")
        console.log(newsListArr)
        wx.hideLoading()
      }
    })



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
            open_id: openid
          })
          that.getRequest()
        } else {
          that.setData({
            open_id: ""
          })
          that.get_openid()
        }
      }
    });

  },

})