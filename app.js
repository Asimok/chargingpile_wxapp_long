//app.js
const mqtt = require('/utils/mqtt.min.js');
const clientId = "wx_long" + Date.parse(new Date());
var url = 'wx://119.45.181.212:8083/mqtt';
var client = mqtt.connect(url, {
  clientId: clientId
});
client.on('connect', function () {
  console.log('MQTT连接成功');
  wx.showToast({
    title: "MQTT连接成功", // 标题
    icon: "success", // 图标类型，默认success
    duration: 2000 // 提示窗停留时间，默认1500ms
  })

});

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
     //云开发初始化
     wx.cloud.init({
      env: 'chargingpile-long-0e0cx930c4c38b',
      traceUser: true
     })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    client:client,
  }
})