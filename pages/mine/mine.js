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
    isrent:false
  },

  onLoad: function (options) {
    this.get_openid();
    this.getuserinfo();

  },

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
                        open_id: res.data.openid
                      })
                      console.log("主界面的openid>>>>" + res.data.openid);
                      if (res.data.openid != "") {
                        that.isLogin(res.data.openid)
                        that.getRequest()
                      } else
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
      url: 'http://192.168.1.224:8081/long/rent/current',
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
          newsListArr.restTime = (newsListArr.restTime/ 60000/60/24).toFixed(0) + " 天"
          newsListArr.rentTime = (newsListArr.rentTime / 60000/60/24).toFixed(0) + " 天"
           if(newsListArr.endTime=="-1")
           that.setData({
            isrent: false
          })
          else
          that.setData({
            isrent: true
          })
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