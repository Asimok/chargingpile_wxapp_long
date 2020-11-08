//支付成功后跳转
const mqtt = require('../../utils/mqtt.min.js');
const clientId = "wx_open" + Date.parse(new Date());
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

Page({
  data: {
    isShow: true,
    status: "点击开始充电",
    topic_y2i: "",
    topic_i2y: "",
    topic: "",
    bsName: "",
    bsID: "",
    chargeID: "",
    chargePort: "",
    grp: "",
    restTime: "",
    openId: "",

    charge_time: "",
    fee: ""
  },
  onLoad: function (e) {
    console.log("mqtt界面收到的参数")
    var test = '{"bsID":"250","chargeID":"230602NEPU001","grp":"D001","chargePort":"RT02","restTime":216000000,"openId":"oxiix4rhiv1av9T834QExcFmcbRA","topic":"230602NEPU001","charge_time":"60","fee":1}'
    // var test = e.data
    this.connectMqtt(test)
  },
  connectMqtt: function (test) {
    var rec_data = JSON.parse(test)
    console.log(rec_data)
    this.setData({
      topic_y2i: rec_data.topic + "_Y2I",
      topic_i2y: rec_data.topic + "_I2Y",

      bsID: rec_data.bsID,
      chargeID: rec_data.chargeID,
      chargePort: rec_data.chargePort,
      grp: rec_data.grp,
      restTime: rec_data.restTime,
      openId: rec_data.openId,

      charge_time: rec_data.charge_time,
      fee: rec_data.fee
    })

    this.suscribeTopic();
  },
  suscribeTopic: function () {
    var that = this
    var topic_i2y = this.data.topic_i2y;
    console.log("订阅>>>>>>>" + topic_i2y)
    client.subscribe(topic_i2y)
    //开放式小程序上线
    client.publish("wxapp_open_status", '小程序上线');

    client.on('message', function (topic, payload) {
      console.log(topic.toString() + "收到消息");
      // console.log(payload.toString());
      var rec_message = payload.toString()
      //判断包含字符串
      if (rec_message.indexOf("AckWriteData") >= 0) {
        var rec = rec_message;
        var ack = JSON.parse(rec)
        var no_ack = ack.AckWriteData
        var No = no_ack.No
        // console.log(no_ack)
        console.log("解析消息");
        //console.log(No)
        //No相同的话开始充电成功
        that.show_opened_chargingpile()
      }
    })

  },
  onUnload: function () {
    // 关闭连接
    client.end();
  },
  //充电成功 推送消息 从订阅开始
  show_opened_chargingpile: function () {
    wx.showToast({
      title: "开始充电", // 标题
      icon: "success", // 图标类型，默认success
      duration: 2000 // 提示窗停留时间，默认1500ms
    })
    this.openbook()
  },
  //下发充电指令
  btn_charge_open: function () {

    var topic = this.data.topic_y2i;
    console.log("下发指令topic>>>>> " + topic)
    //充电指令
    // var code = '{"WriteData": {"No": ' + Date.parse(new Date()) + ',"Node": [{"Name": "D001.RT05","Value": "5"}]}}'
    var code = '{"WriteData": {"No": ' + Date.parse(new Date()) + ',"Node": [{"Name": ' + this.data.grp + "." + this.data.chargePort + ',"Value": ' + this.data.charge_time + '}]}}'
    client.publish(topic, code);
  },
  //订阅
  subscribe: function () {
    var that = this
    console.log("订阅")
    wx.requestSubscribeMessage({
      tmplIds: ['_XkeRL42L12IeT01G0n6BdIYJlh3s23yPMOK0dM83nQ'],
      success(res) {
        console.log("订阅成功")
        //console.log(res)
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
    var that = this
    var access_token = ''
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx0f57e9c304a06353&secret=6a6bced7ba1ad4bfefd03ab4a100e0d3',
      method: 'GET',
      success: function (res) {
        // console.log(res)
        access_token = res.data.access_token
        that.getName(access_token)
      }
    })
  },
  //获取车棚名称
  getName(ACCESS_TOKEN) {
    var that = this
    //获取车棚名称
    wx.request({
      url: 'http://192.168.1.224:8081/bikeshed/name',
      method: "GET",
      data: {
        "bsId": that.data.bsID
      },
      success: function (res) {
        console.log("获取车棚名称")
        console.log(res)
        if (res.data.bsName == "-1") {
          that.data.bsName = "暂未录入车棚名称"

        } else {
          that.data.bsName = res.data.bsName
          that.send(ACCESS_TOKEN)
        }
      }
    })
    console.log("车棚名称" + that.data.bsName)

  },
  //推送
  send: function (ACCESS_TOKEN) {
    console.log("推送")
    console.log("获取车棚名称")
    var that = this

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + ACCESS_TOKEN,
      method: 'POST',
      data: {
        "touser": that.data.openId,
        "template_id": "_XkeRL42L12IeT01G0n6BdIYJlh3s23yPMOK0dM83nQ",
        "page": "main",
        "miniprogram_state": "developer",
        "lang": "zh_CN",
        "data": {
          "thing1": {
            "value": that.data.bsName
          },
          "character_string2": {
            "value": that.data.chargeID
          },
          "thing14": {
            "value": that.data.chargePort
          },
          "thing5": {
            "value": that.data.charge_time +" 分钟"
          },
          "amount10": {
            "value": that.data.fee + " 元"
          }
        }
      },

      success: function (res) {
        console.log("推送成功")
        // console.log(res)
        that.setData({
          isShow: false,
          status: "正在充电"
        })
      }
    })
  },
  //调用充电接口
  openbook: function () {

    wx.request({
      url: 'http://192.168.1.224:8081/open/book',
      method: "POST",
      data: {
        "bsId": this.data.bsID,
        "cpId": this.data.chargeID,
        "grp": this.data.grp,
        "portWay": this.data.chargePort,
        "restTime": this.data.charge_time * 60 * 1000,
        "openId": this.data.openId
      },
      success: function (res) {
        console.log("充电成功接口")
        console.log(res)
      }
    })
  },
  //开始充电
  open_tap: function () {
   
    this.subscribe()

  },

})