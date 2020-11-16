const app = getApp();
var client = app.globalData.client
Page({
  data: {
    client_id:"",
    open_id:""
  },
  onLoad: function () {
    var test = '{"client_id":"I230602NEPU001","open_id":"orhhB5SGz_uF2UJiZUvKLUyk90wg","code":"open","type":"in/out","mode":"long/share"}'
    // var test = e.data
    this.connectMqtt(test)

  },
  onUnload: function () {
    // 关闭连接
    client.end();
  },
  connectMqtt: function (test) {
    var rec_data = JSON.parse(test)
    console.log(rec_data)
    this.setData({
      topic_y2i: rec_data.client_id + "_Y2I",
      topic_i2y: rec_data.client_id + "_I2Y",

      client_id: rec_data.client_id,
      code: rec_data.code,
      type: rec_data.type,
      mode: rec_data.mode,
      open_id:rec_data.open_id
    })

    this.suscribeTopic();
  },
  suscribeTopic: function () {
    var that = this
    var topic_i2y = this.data.topic_i2y;
    console.log("订阅>>>>>>>" + topic_i2y)
    client.subscribe(topic_i2y)

    client.on('message', function (topic, payload) {
      console.log(topic.toString() + "收到消息——E");
      // console.log(payload.toString());
      var rec_message = payload.toString()
      //判断包含字符串

      var rec = JSON.parse(rec_message);
      var result = rec.status;
      if (result == 'opened') {
        that.opened_lock('开锁成功！', 'success')
      }
      else
      {
        that.opened_lock(result, 'loading')
      }
    })
  },
  getScancode: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        var scan_data = res.result;
        var scan_data_json = JSON.parse(scan_data)
        //二维码内容
        var send_scan_data = {
          client_id: scan_data_json.client_id,
          code: scan_data_json.code,
          type: scan_data_json.type,
          mode:scan_data_json.mode,
          open_id: that.data.openId
        }
        var str = JSON.stringify(send_scan_data);
        console.log("二维码数据")
        console.log(send_scan_data)
        //跳转
        wx.navigateTo({
          url: '/pages/entrance_guard/entrance_guard?data=' + str,
        })
      }
    })

  },
  opened_lock: function (isOpened, status) {
    wx.showToast({
      title: isOpened, 
      icon: status, 
      duration: 2000 
    })
  },
  send_open: function () {
    console.log("点击开灯")
    var topic = this.data.topic_y2i;
    var tempcode = '{"entrance":{"client_id":'+this.data.client_id+',"open_id":'+this.data.open_id+',"code":'+this.data.code+',type:'+this.data.type+'}}'
    client.publish(topic, tempcode);

  },
  send_close: function () {
    var topic = this.data.topic_y2m;
    var code = '{"client_id":"entrance_230603001","open_id":"test","code": "close"}'
    client.publish(topic, code);
  }


})