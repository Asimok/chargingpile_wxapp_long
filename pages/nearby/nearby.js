const type =3
Page({

  data: {
    onLoad: true,
    listArr: [],
    latitude: '',
    longitude: ''
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    this.getloc()

  },
  getloc: function () {
    var that = this;
    wx.getLocation({

      type: 'wgs84',
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        console.log("that");
        console.log(that.data.longitude);
        that.getRequest()
      },
      fail: function (res) {
        console.log(res);
      }

    })

  },
  // 网络请求核心函数  
  getRequest: function () {

    var that = this;
    var newsListArr = [];
    console.log("that2");
    console.log(that.data.longitude);
    wx.request({

      url: 'http://192.168.1.224:8081/bikeshed/closebs?longitude=' + that.data.longitude + '&latitude=' + that.data.latitude + '&number=-1',
      // url: 'http://192.168.1.224:8081/chargepile/closebs?longitude=125.160005&latitude=46.595538&number=2',
      method: "GET",

      success: function (res) {
        console.log("获取的附近车棚数据")
        console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          var tempd = parseFloat(res.data.data[i].distance).toFixed(0);

          if (tempd < 1000) {
            //  console.log( parseInt(res.data.data[i].distance) );
            res.data.data[i].distance = String(tempd) + "m"
          } else {
            res.data.data[i].distance = String((tempd / 1000).toFixed(2)) + "km"

          }

          if (i == res.data.data.length - 1)
            that.setData({
              onLoad: false
            })
        }

        var templist = []
        for (var i = 0; i < res.data.data.length; i++) {
        if(res.data.data[i].type == type)
        {
          templist.push(res.data.data[i])
        }
        }
        console.log("获取的附近车棚数据>>>>>>>处理后数据")
        console.log(templist)
        newsListArr = templist;

        if (!res.data.length) {
          that.setData({
            onLoad: false
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

})