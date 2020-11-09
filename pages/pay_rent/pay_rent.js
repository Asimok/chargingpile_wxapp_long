
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
    charge_price: "-",
    items: [{
        name: '1',
        value: '1月',
        checked: 'true'
      },
      {
        name: '2',
        value: '2月'
      },
      {
        name: '3',
        value: '3月'
      },
      {
        name: '6',
        value: '6月'
      },
      {
        name: '12',
        value: '12月'
      }
    ]
  },
  onLoad: function (e) {
    console.log("带来支付界面的参数");
    console.log(e);
    var rec_data_json = e
    this.setData({
      bsID: rec_data_json.bsID,
      chargeID: rec_data_json.chargeID,
      grp:rec_data_json.grp,
      chargePort: rec_data_json.chargePort,
      topic: rec_data_json.topic,
     
    })
    this.get_openid()
  this.getPrice1()
  },
  getPrice1:function()
  {
    var that =this
      //请求1元的价格
      wx.request({
        url: 'http://192.168.1.224:8081/money/rent/',
        data:{
          "bsId" : that.data.bsID
        },
        method: "GET",
        success: function (res) {
          var getLIst=[]
          console.log(res)
          getLIst = res.data.data
          console.log(getLIst)
          for (var i = 0; i < getLIst.length; i++) {
            if (getLIst[i].time == 1) {
              that.data.charge_price = getLIst[i].price
              break
            }
          }
          console.log("1月充电时长")
          console.log( that.data.charge_price)
          that.setData({
            payTime: that.data.charge_price
          })
          //费用
          that.data.fee=that.data.charge_price

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
      url: 'http://192.168.1.224:8081/money/rent/',
      data:{
        "bsId" : that.data.bsID
      },
      method: "GET",
      success: function (res) {
        var getLIst=[]
        console.log(res)
        getLIst = res.data.data
        console.log(getLIst)
        for (var i = 0; i < getLIst.length; i++) {
          if (getLIst[i].time == checkPrice) {
            that.data.charge_price = getLIst[i].price
            break
          }
        }
        console.log("充电时长")
        console.log( that.data.charge_price)
        that.setData({
          payTime: that.data.charge_price
        })
         //费用
         that.data.fee=that.data.charge_price
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

    var tempdata ="长租_"+that.data.bsName+"_"+ that.data.bsID + "_" + that.data.chargeID + "_" +that.data.grp+"_"+
     that.data.chargePort + "_"+ that.data.charge_price + "分钟"
    var temp_json = {
      "openId": that.data.openId,
      "appId":"wx70c5b593e65351a8",
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
  //支付成功跳转租用记录
  goto_charge: function () {
    wx.redirectTo({
      url: '/pages/long_history/long_history'
    })
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