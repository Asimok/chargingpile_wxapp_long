
Page({
  data: {
    payTime: "-",
    openId: "",
    bsID: "",
    bsName:"",
    grp:"",
    chargeID: "",
    chargePort: "",
    startTime: "",
    topic: "",
    fee: "",
    charge_time: "-",
    items: [{
        name: '1',
        value: '1元',
        checked: 'true'
      },
      {
        name: '2',
        value: '2元'
      },
      {
        name: '3',
        value: '3元'
      },
      {
        name: '4',
        value: '4元'
      },
    ]
  },
  onLoad: function (e) {
    console.log("带来支付界面的参数");
    console.log(e);
    var rec_data_json = JSON.parse(e.data)
    this.setData({
      bsID: rec_data_json.bsID,
      chargeID: rec_data_json.chargeID,
      grp:rec_data_json.grp,
      chargePort: rec_data_json.chargePort,
      topic: rec_data_json.topic,
      openId: rec_data_json.openId
    })

  this.getPrice1()
  },
  getPrice1:function()
  {
    var that =this
      //请求1元的价格
      wx.request({
        url: 'http://192.168.1.224:8081/money/get/'+this.data.bsID,
        method: "GET",
        success: function (res) {
          var getLIst=[]
          console.log(res)
          getLIst = res.data.data
          console.log(getLIst)
          for (var i = 0; i < getLIst.length; i++) {
            if (getLIst[i].price == 1) {
              that.data.charge_time = getLIst[i].time
              break
            }
          }
          console.log("1元充电时长")
          console.log( that.data.charge_time)
          that.setData({
            payTime: that.data.charge_time
          })
          that.data.fee=1

        }
      })
  },
  //选择价格计算时间
  radioChange: function (e) {
    var that =this
   
    var checkPrice =e.detail.value
    this.data.fee =e.detail.value
    console.log('radio发生change事件，携带value值为：', checkPrice)
    wx.request({
      url: 'http://192.168.1.224:8081/money/get/'+that.data.bsID,
      method: "GET",
      success: function (res) {
        var getLIst=[]
        console.log(res)
        getLIst = res.data.data
        console.log(getLIst)
        for (var i = 0; i < getLIst.length; i++) {
          if (getLIst[i].price == checkPrice) {
            that.data.charge_time = getLIst[i].time
            break
          }
        }
        console.log("充电时长")
        console.log( that.data.charge_time)
        that.setData({
          payTime: that.data.charge_time
        })

      }
    })
   
  },
  //获取车棚名称
  getName(){
    var that =this
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

        } else
         { that.data.bsName = res.data.bsName
          that.getpaydata()}
      }
    })
    console.log("车棚名称"+ that.data.bsName)

  },
  //后端支付接口 下订单
  getpaydata: function (e) {
    console.log("需要支付的金额")
    var that = this
    var fee = that.data.fee
    console.log(fee)

    var tempdata =that.data.bsName+"_"+ that.data.bsID + "_" + that.data.chargeID + "_" +that.data.grp+"_"+
     that.data.chargePort + "_"+ that.data.charge_time + "分钟"
    var temp_json = {
      "openId": that.data.openId,
      "goods_name": tempdata,
      "total_fee": fee,
      "trade_type": "JSAPI"
    }
    console.log("请求支付")
    console.log(temp_json)

    wx.request({
      url: 'http://192.168.1.224:8081/pay',
      method: "POST",
      data: temp_json,
      success: (res) => {
        console.log(res)
        console.log("收到的支付信息")
        console.log(res)
        //调用微信支付接口
        that.doWxPay(res)
      }
    })

  },
  doWxPay(param) {
    var that = this
    //小程序发起微信支付
    console.log("小程序发起微信支付的参数")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      appId: param.data.appid,

      success: function (event) {
        // success
        console.log("success事件");
        console.log(event);
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
        //支付成功
        that.goto_charge()
      },
      fail: function (error) {
        console.log("支付失败")
        console.log(error)
      },
      complete: function () {
        // complete
        console.log("pay complete")
      }

    });

  },
  //支付成功跳转充电
  goto_charge: function () {
    var send_charge_data = {
      bsID: this.data.bsID,
      chargeID: this.data.chargeID,
      grp:this.data.grp,
      chargePort: this.data.chargePort,
      restTime:this.data.charge_time,
      openId:this.data.openId,
      topic: this.data.topic,
    
      charge_time:this.data.charge_time,
      fee: this.data.fee
    }
    var str = JSON.stringify(send_charge_data);
    console.log("支付成功")
    console.log("带给充电界面的参数")
    console.log(str)
    //跳转
    wx.redirectTo({
      url: '/pages/mqtt/mqtt?data=' + str,
    })
  }
})