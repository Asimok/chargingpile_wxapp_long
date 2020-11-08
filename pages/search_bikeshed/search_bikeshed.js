const type =3
Page({

  data: {
    onLoad: false,
    listArr: [],
    open_id: "",
    bsName: '',

  },

  onLoad: function (options) {

  },
  // 网络请求核心函数
  getRequest: function () {
    var that = this;
    var newsListArr = [];

    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      onLoad: true
    })

    console.log("要搜索的车棚名称")
    console.log(that.data.bsName)
    wx.request({
      url: 'http://192.168.1.224:8081/bikeshed/' + that.data.bsName,
      method: "GET",
      success: function (res) {
        console.log("车棚数据")
        console.log(res)
        // console.log('长度')
        // console.log(res.data.data.length)

        var templist = []
        for (var i = 0; i < res.data.data.length; i++) {
        if(res.data.data[i].type == type)
        {
          templist.push(res.data.data[i])
        }
        }
        // console.log("首页——获取的附近车棚数据>>>>>>>处理后数据")
        // console.log(templist)
        newsListArr = templist;
        
        if (!res.data.data.length) {
          that.setData({
            onLoad: false
          })
        }

        that.setData({
          listArr: newsListArr,
        })

        console.log("展示车棚信息")
        console.log(newsListArr)
        that.setData({
          onLoad: false
        })
        wx.hideLoading()
      }
    })



  },

  //获取用户输入的车棚名
  bsidInput: function (e) {
    this.setData({
      bsName: e.detail.value
    })
    //  this.getRequest()  
  },
  get_bikeshed: function () {

    this.getRequest()
  }

})