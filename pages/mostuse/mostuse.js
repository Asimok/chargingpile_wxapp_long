
Page({

  data: {
      onLoad:true,
      listArr:[],
      openId: "",
     
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.get_openid()
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
            openId: openid
          })
          that.getRequest()
        } else {
          that.setData({
            openId: ""
          })
          that.get_openid()
        }
      }
    });

  },

  // 网络请求核心函数
  getRequest:function(){
    
    var that=this;
    var newsListArr=[];
    var temp_json = {"openId":this.data.openId};
    console.log(temp_json)
    wx.request({
      url:'https://www.hzsmartnet.com/bikeshed/commonbs?openid='+this.data.openId+'&number=-1',
      method: "GET",
  
      success: function (res) {
        console.log("常用站点")
        console.log(res)
        newsListArr = res.data.data;
        
        that.setData({
          listArr: newsListArr,
        })
         that.setData({
            onLoad:false
          })
        console.log("展示常用站点信息")
        console.log(that.data.listArr)
        wx.hideLoading()
      }
    })



  },

})