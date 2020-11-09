
Page({

  data: {
      onLoad:true,
      listArr:[],
      open_id: "",
      bsId:''
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
//解析上一个页面传来的 bsid 
console.log('解析上一个页面传来的 bsid' )
console.log(options)
this.data.bsId = options.bsId
    this.get_openid()
    this.getRequest()    
  },

  // 网络请求核心函数
  getRequest:function(){
    
    var that=this;
    var newsListArr=[];

    wx.request({
      url: 'http://192.168.1.224:8081/chargepile/restpos',
      data:{"bsId":this.data.bsId},
      method: "GET",
    
      success: function (res) {
        console.log("车棚数据")
        console.log(res)
        console.log('长度')
        console.log(res.data.data.length)

    
     for (var i =0;i<res.data.data.length;i++)
     {
      res.data.data[i].RTNos=String(res.data.data[i].RTNos);
      res.data.data[i].RTNos_num=String(res.data.data[i].RTNos).split(",").length;

      if(i == res.data.data.length-1)
      that.setData({
        onLoad:false
      })
     }
        newsListArr = res.data.data;
       
        // 
        if(!res.data.data.length){
          that.setData({
            onLoad:false
          })
        }
        that.setData({
          listArr: newsListArr,
        })
       
        console.log("展示车棚信息")
        console.log(newsListArr)
        wx.hideLoading()
      }
    })



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
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  that.setData({
                    user_code: res.code
                  })
                  console.log("获取车棚信息的code:" + res.code);
                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx70c5b593e65351a8&secret=69ab78befe069b6a55397d50801f9e72&js_code=' + res.code + '&grant_type=authorization_code',
                    success: res => {
                      // 获取到用户的 openid
                      that.setData({
                        open_id: res.data.openid
                      })
                      console.log("获取车棚信息的openid:" + res.data.openid);
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

})