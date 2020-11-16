//租用记录
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
      url: 'https://www.hzsmartnet.com/long/rent/history',
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
          newsListArr[i].bookTime = comm.js_date_time(newsListArr[i].bookTime)
          newsListArr[i].percent = (((newsListArr[i].restTime) * 1.0 / newsListArr[i].rentTime) * 100).toFixed(0)

          newsListArr[i].restTime = (newsListArr[i].restTime/ 60000/60/24).toFixed(0) + " 天"
          newsListArr[i].rentTime = (newsListArr[i].rentTime / 60000/60/24).toFixed(0) + " 天"

          if (newsListArr[i].rentStatus == "0") {
            newsListArr[i].rentStatus = "未到期"
          } else
            newsListArr[i].rentStatus = "已到期"
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