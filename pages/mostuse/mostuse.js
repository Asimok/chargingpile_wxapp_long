
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
                  console.log("最常使用站点的code>>>>:" + res.code);

                  wx.request({

                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx70c5b593e65351a8&secret=69ab78befe069b6a55397d50801f9e72&js_code=' + res.code + '&grant_type=authorization_code' + res.code + '&grant_type=authorization_code',
                    success: res => {

                      that.setData({
                        openId: res.data.openid
                      })
                      var trmp_openId = ""
                      console.log("最常使用站点的openid>>>>" + res.data.openid);
                       trmp_openId = res.data.openid
                      if(trmp_openId!="")
                        that.getRequest()
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
  // 网络请求核心函数
  getRequest:function(){
    
    var that=this;
    var newsListArr=[];
    var temp_json = {"openId":this.data.openId};
    console.log(temp_json)
    wx.request({
      url:'http://192.168.1.224:8081/bikeshed/commonbs?openid='+this.data.openId+'&number=-1',
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