const type = 3
Page({

  data: {
    onLoad: true,
    listArr: [],
    latitude: '',
    longitude: '',
    is_auth: false,
    is_regist: false
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    this.getloc()

  },
  getloc: function () {
    var that = this;
    wx.getLocation({

      type: 'wgs84',
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        console.log("that");
        console.log(that.data.longitude);
        that.getRequest()
      },
      fail: function (res) {
        console.log(res);
      }

    })

  },
  // 网络请求核心函数  
  getRequest: function () {

    var that = this;
    var newsListArr = [];
    wx.request({

      url: 'https://www.hzsmartnet.com/bikeshed/closebs?longitude=' + that.data.longitude + '&latitude=' + that.data.latitude + '&number=-1',
      method: "GET",
      success: function (res) {
        console.log("获取的附近车棚数据")
        console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          var tempd = parseFloat(res.data.data[i].distance).toFixed(0);

          if (tempd < 1000) {
            //  console.log( parseInt(res.data.data[i].distance) );
            res.data.data[i].distance = String(tempd) + "m"
          } else {
            res.data.data[i].distance = String((tempd / 1000).toFixed(2)) + "km"

          }

          if (i == res.data.data.length - 1)
            that.setData({
              onLoad: false
            })
        }

        var templist = []
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].type == type) {
            templist.push(res.data.data[i])
          }
        }
        console.log("获取的附近车棚数据>>>>>>>处理后数据")
        console.log(templist)
        newsListArr = templist;

        if (!res.data.length) {
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