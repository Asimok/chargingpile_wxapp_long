//验证码
// 18182737073
Page({
  data: {
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    reccode: "",
    recphone: "",
    openId: ""
  },
  onLoad: function (e) {
    console.log("带来的数据")
    console.log(e)
    this.data.openId = e.openid
  },
  // 手机号部分
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        //console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },
  //验证手机号
  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1000
      })
      return false
    }
  },
  //显示发送按钮
  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },
  //隐藏发送按钮
  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },

  //计时器
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  //输入验证码
  addCode: function (e) {

    this.setData({
      code: e.detail.value
    })
    this.activeButton()

  },

  //显示注册按钮
  activeButton: function () {
    let {
      phoneNum,
      code
    } = this.data
    // console.log(code)
    if (phoneNum && code) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },
  //发送验证码
  sendMsg: function () {
    var that = this;
    console.log("请求验证码")
    var phoneNum = this.data.phoneNum;
    
    wx.request({
      url: 'http://192.168.1.224:8081/vc/getCode',
      data: {
        phone: phoneNum
      },
      method: 'GET',
      success: function (res) {
        console.log("解析接收的信息")
        console.log(res)
        that.data.reccode = res.data.data.code
        that.data.recphone = res.data.data.phone

      }
    })
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },
  //校对验证码
  onSubmit: function () {
    console.log("进入验证环节")
    console.log(this.data.phoneNum)
    console.log(this.data.code)
    var phoneNum = this.data.phoneNum;
    var tempphone = this.data.recphone
    var code = this.data.code;
    var tempcode = this.data.reccode


    if (tempcode == code && tempphone == phoneNum) {
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 2000
      });
      this.regist()

    } else {
      wx.showToast({
        title: '验证失败,请重新获取验证码',
        icon: 'none',
        duration: 2000
      });
    }
  },

  //注册
  regist: function () {
    var that = this
    console.log("注册信息")
    console.log(that.data.phoneNum)
    console.log(that.data.openId)
    wx.request({
      url: 'http://192.168.1.224:8081/register/open',
      data: {
        telNumber: that.data.phoneNum,
        openId: that.data.openId,
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.status,
          duration: 2000
        });
        if(res.data.status=="成功")
        {
          //跳转
          wx.reLaunch({
            url: '/pages/main/main',
        })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})