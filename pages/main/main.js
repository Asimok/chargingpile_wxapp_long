const type = 3
Page({

  data: {
    onLoad: true,
    listArr: [],
    latitude: '',
    longitude: '',
    openId: ""
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.get_openid()
    //获得openid之后判断是否登录过
    this.getloc()
  },
//   onShow(){
//     //调用函数、方法
//     var that=this;
//     that.onLoad();
// },
  //获取位置
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
        that.getRequest()
      },
      fail: function (res) {
        console.log(res);
      }
    })

  },
  //获取openid
  get_openid: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  that.setData({
                    user_code: res.code
                  })
                  console.log("主界面的code>>>>:" + res.code);

                  wx.request({

                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx70c5b593e65351a8&secret=69ab78befe069b6a55397d50801f9e72&js_code=' + res.code + '&grant_type=authorization_code' + res.code + '&grant_type=authorization_code',
                    success: res => {

                      that.setData({
                        openId: res.data.openid
                      })
                      console.log("主界面的openid>>>>" + res.data.openid);
                      if (res.data.openid != "")
                        that.isLogin(res.data.openid)
                      else
                        that.get_openid()
                    }
                  });
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },
  // 网络请求核心函数
  getRequest: function () {

    var that = this;
    var newsListArr = [];
    wx.request({

      url: 'http://192.168.1.224:8081/bikeshed/closebs?longitude=' + that.data.longitude + '&latitude=' + that.data.latitude + '&number=2',
     
      method: "GET",

      success: function (res) {
        // console.log("首页——获取的附近车棚数据")
        // console.log(res)
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
        // console.log("首页——获取的附近车棚数据>>>>>>>处理后数据")
        // console.log(templist)
        newsListArr = templist;

        if (!res.data.length) {
          that.setData({
            onLoad: false
          })
        }
        that.setData({
          listArr: newsListArr,
        })
        // console.log("展示车棚信息")
        // console.log(newsListArr)
        wx.hideLoading()
      }
    })
  },
  //扫码 打开门禁
  getScancode: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        var scan_data = res.result;
        var scan_data_json = JSON.parse(scan_data)
        //二维码内容
        var send_scan_data = {
          bsID: scan_data_json.bsID,
          chargeID: scan_data_json.chargeID,
          grp: scan_data_json.grp,
          chargePort: scan_data_json.chargePort,
          topic: scan_data_json.topic,
          openId: that.data.openId
        }
        var str = JSON.stringify(send_scan_data);
        console.log("二维码数据")
        console.log(send_scan_data)
        //跳转
        wx.navigateTo({
          url: '/pages/pay/pay?data=' + str,
        })
      }
    })

  },
  isLogin: function (temp_openid) {
    var that = this
    var temp_send_data = {
      openId: temp_openid
    };
    console.log("发送到后端的用户信息： ");
    console.log(temp_send_data);
    wx.request({
      url: 'http://192.168.1.224:8081/long/login',
      method: "POST",
      data: temp_send_data,
      // 解析注册状态
      success: (res) => {
        console.log(res.data)
        var status = res.data.status
        console.log(res.data.status)
        if (status == -1) {
          // 登录
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      }
    })
  }

})