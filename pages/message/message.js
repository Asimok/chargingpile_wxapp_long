// 推送消息
//获取应用实例
const app = getApp()
Page({

  data: {
    open_id: ""
  },

  onLoad: function (options) {
  // 查看是否授权
this.get_openid()

  },



  //订阅
subscribe: function(){
  var that =this
  console.log("订阅")
  wx.requestSubscribeMessage({
    tmplIds: ['_XkeRL42L12IeT01G0n6BdIYJlh3s23yPMOK0dM83nQ'],
    success (res) { 
      console.log("订阅成功")
      console.log(res)
      that.get_access_token()
    },
    fail(res) {
      console.log("订阅失败")
      console.log(res);
    }
  })
  
},
//获取access_token
get_access_token: function () {
  var that =this
  var access_token = ''
  wx.request({
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx0f57e9c304a06353&secret=6a6bced7ba1ad4bfefd03ab4a100e0d3',
    method: 'GET',
    success: function (res) {
      console.log(res)
      access_token = res.data.access_token
      that.send(access_token)
    }
  })
},
//推送
  send: function (ACCESS_TOKEN) {
    console.log("推送")

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+ACCESS_TOKEN,
      method: 'POST',
      data: {
        "touser": "oxiix4rhiv1av9T834QExcFmcbRA",
        "template_id": "_XkeRL42L12IeT01G0n6BdIYJlh3s23yPMOK0dM83nQ",
        "page": "message",
        "miniprogram_state": "developer",
        "lang": "zh_CN",
        "data": {
          "thing1": {
            "value": "东油1d103"
          },
          "character_string2": {
            "value": "123456"
          },
          "thing14": {
            "value": "B2"
          },
          "thing5": {
            "value": "90分钟"
          },
          "amount10": {
            "value": "1.0元"
          }
        }
      },

      success: function (res) {
        console.log("推送成功")
        console.log(res)
      
      }
    })


  },

  //获取openid
  get_openid: function () {
    console.log("获取我的界面的code");
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.login({
                success: res => {
                  that.setData({
                    user_code: res.code
                  })
                  console.log("mqtt界面的code>>>>:" + res.code);
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx70c5b593e65351a8&secret=69ab78befe069b6a55397d50801f9e72&js_code=' + res.code + '&grant_type=authorization_code' + res.code + '&grant_type=authorization_code',
                    success: res => {
                      // 获取到用户的 openid
                      that.setData({
                        open_id: res.data.openid
                      })
                      console.log("mqtt界面的openid>>>>:" + res.data.openid);
                    }
                  });
                }
              });
            }
          });
        } 
      }
    });
  }
})
