const comm = require("../../utils/comm.js")

Page({
  data: {
    onLoad: true,
    listArr: [],
    open_id: "",
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.get_openid()
  },
  onShow(){
    //调用函数、方法
    var that=this;
    that.onLoad();
},
  // 网络请求核心函数
  getRequest: function () {
    console.log("request里的openid")
    console.log(this.data.open_id)
    var that = this;
    var newsListArr = [];

    wx.request({
      url: 'http://192.168.1.224:8081/open/history',
      data: {
        "openId": that.data.open_id
      },
      method: "GET",
      success: function (res) {
        console.log("历史数据")
        console.log(res)
        newsListArr = res.data.data;
        that.setData({
          onLoad: false
        })
        for (var i = 0; i < newsListArr.length; i++) {
          newsListArr[i].endTime = comm.js_date_time(newsListArr[i].endTime)
          newsListArr[i].startTime = comm.js_date_time(newsListArr[i].startTime)
          newsListArr[i].percent = (((newsListArr[i].restTime - newsListArr[i].RTime) * 1.0 / newsListArr[i].restTime) * 100).toFixed(0)
          newsListArr[i].restTime = newsListArr[i].restTime / 60000 + " 分钟"
          newsListArr[i].RTime = (newsListArr[i].RTime / 60000).toFixed(0) + " 分钟"

          if (newsListArr[i].chargeStatus == "0") {
            newsListArr[i].chargeStatus = "正在充电"
          } else
            newsListArr[i].chargeStatus = "已完成"
          newsListArr[i].price = newsListArr[i].price / 100 + " 元"

        }

        that.setData({
          listArr: newsListArr,
        })
        console.log("展示历史信息")
        console.log(that.data.listArr)

        wx.hideLoading()
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

                  that.setData({
                    user_code: res.code
                  })
                  console.log("历史数据的code:" + res.code);

                  wx.request({
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx70c5b593e65351a8&secret=69ab78befe069b6a55397d50801f9e72&js_code=' + res.code + '&grant_type=authorization_code' + res.code + '&grant_type=authorization_code',
                    success: res => {

                      that.setData({
                        open_id: res.data.openid
                      })
                      console.log("历史数据的openid:" + res.data.openid);
                      that.getRequest()
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

})