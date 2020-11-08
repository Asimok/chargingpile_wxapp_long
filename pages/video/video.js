Page({
  data: {
    // src: 'https://tx1.yunchuanglive.com/live/SSAA-147833-DFFEC.m3u8',
    status: '',
    stopVideo: true,
    second: 120
  },
  onLoad: function (e) {
    console.log("带来监控界面的参数")
    console.log(e)
    this.setData({
      second: 120,
      stopVideo: true,
      src: e.url
    })
    this.timer()
  },
  /**
   * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
   */
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
              second: 0,
              stopVideo: false,
              src: "https://tx1.yunchuanglive.com/live/none.m3u8"
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    this.data.status = e.detail.errMsg
    console.log(e.detail.errMsg)

    var error_code = e.detail.errMsg.substring(e.detail.errMsg.indexOf('{'), e.detail.errMsg.length)
    console.log(error_code)
    var code_json = JSON.parse(error_code)
    var code = code_json.code
    var text = code_json.text

    this.change_status(code, text);
  },
  change_status: function (code = "", text = "") {
    this.setData({
      status: code + " : " + text
    })
  }


})