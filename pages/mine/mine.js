// pages/my/my.js
const comm = require("../../utils/comm.js")

Page({
  data: {
    avatarUrl: "",
    nickNam: "",
    vipclass: "",
    open_id: "",
    user_data: '',
    newdata: false,
    isrent: false
  },
  onShow() {
    //调用函数、方法
    var that = this;
    that.onLoad();
  },
  onLoad: function (options) {
    this.get_openid();
    this.getuserinfo();

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
  
  //获取userinfo
  getuserinfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickNam: res.userInfo.nickName,
          newdata: true
        })

        console.log("获取我的界面的昵称:" + that.data.nickNam);
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
      url: 'https://www.hzsmartnet.com/long/login',
      method: "POST",
      data: temp_send_data,
      // 解析注册状态
      success: (res) => {
        console.log(res.data)
        var status = res.data.status
        if (status == -1) {
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
                console.log("取消")
              }
            }
          })
        }
      }
    })
  },
  // 当前租用
  getRequest: function () {
    console.log("查询当前租用")
    var temp_json = {
      "openId": this.data.open_id
    };
    console.log(temp_json)
    var that = this
    var newsListArr = []
    wx.request({
      // url: 'http://192.168.1.224:8081/long/rent/current',
      url: 'https://www.hzsmartnet.com/long/rent/current',
      data: temp_json,
      method: "GET",

      success: function (res) {
        console.log("当前租用")
        newsListArr = res.data.data;
        console.log(newsListArr)
        that.setData({
          onLoad: false
        })
        newsListArr.endTime = comm.js_date_time(newsListArr.endTime)
        newsListArr.bookTime = comm.js_date_time(newsListArr.bookTime)

        if (newsListArr.endTime == "-1")
          that.setData({
            isrent: false
          })
        else {

          if ((newsListArr.restTime / 60000 / 60 / 24).toFixed(0) > 0)
            that.setData({
              isrent: true
            })
          else
            that.setData({
              isrent: false
            })
        }
        newsListArr.restTime = (newsListArr.restTime / 60000 / 60 / 24).toFixed(0) + " 天"
        newsListArr.rentTime = (newsListArr.rentTime / 60000 / 60 / 24).toFixed(0) + " 天"
        that.setData({
          listArr: newsListArr,
        })

        console.log("展示当前租用信息")
        console.log(newsListArr)

        wx.hideLoading()
      }
    })


  }
})