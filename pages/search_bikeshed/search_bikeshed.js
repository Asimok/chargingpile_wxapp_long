const type =3
Page({

  data: {
    onLoad: false,
    listArr: [],
    open_id: "",
    bsName: '',
    is_auth: false,
    is_regist: false
  },

  onLoad: function (options) {

  },
  // 网络请求核心函数
  getRequest: function () {
    var that = this;
    var newsListArr = [];

    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      onLoad: true
    })

    console.log("要搜索的车棚名称")
    console.log(that.data.bsName)
    wx.request({
      url: 'https://www.hzsmartnet.com/bikeshed/' + that.data.bsName,
      method: "GET",
      success: function (res) {
        console.log("车棚数据")
        console.log(res)
        // console.log('长度')
        // console.log(res.data.data.length)

        var templist = []
        for (var i = 0; i < res.data.data.length; i++) {
        if(res.data.data[i].type == type)
        {
          templist.push(res.data.data[i])
        }
        }
        // console.log("首页——获取的附近车棚数据>>>>>>>处理后数据")
        // console.log(templist)
        newsListArr = templist;
        
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
        that.setData({
          onLoad: false
        })
        wx.hideLoading()
      }
    })

  },

  //获取用户输入的车棚名
  bsidInput: function (e) {
    this.setData({
      bsName: e.detail.value
    })
    //  this.getRequest()  
  },
  get_bikeshed: function () {

    this.getRequest()
  },
 //获取openid
 get_is_auth: function () {
  var that = this;
  wx.cloud.callFunction({
    name: 'get_openId',
    complete: res => {
      console.log('云函数获取到的openid:')
      console.log(res.result)
      var openid = res.result.openId;
      if (openid != "") {

        that.setData({
          openId: openid,
          is_auth: true
        })
        console.log("已授权");
        that.isLogin(openid)
      } else {
        console.log("未授权");
        that.setData({
          openId: "",
          is_auth: false
        })
        that.get_is_auth()
      }
    }
  });

},
    isLogin: function (temp_openid) {
      var that = this
      var temp_send_data = {
        openId: temp_openid
      };
      console.log("判断是否注册： ");
      console.log(temp_send_data);
      wx.request({
        url: 'https://www.hzsmartnet.com/long/login',
        method: "POST",
        data: temp_send_data,
        // 解析注册状态
        success: (res) => {
          console.log(res.data)
          var status = res.data.status
          if (status == -1) {
            that.setData({
              is_regist: false
            })
            console.log("附近车棚未注册")
            wx.showModal({
              title: '提示',
              content: '此功能需要授权登录！',
              success(res) {
                if (res.confirm) {
  
                  // 登录
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                } else if (res.cancel) {
                  // 登录
                  wx.reLaunch({
                    url: '/pages/main/main',
                  })
                }
              }
            })
  
          } else if (status == 0) {
            that.setData({
              is_regist: true
            })
            console.log("已注册")
          }
        }
      })
    },

})