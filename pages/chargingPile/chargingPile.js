
Page({

  data: {
      onLoad:true,
      chargeName:"",
      chargePort:"",
      bsName:"",
      listArr:[]
  },

  onLoad: function (e) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    console.log("车棚带来的参数");
    //跳转页面带过来的参数
    console.log(e);
    this.setData({
      bsName:e.bsName,
      bsId:e.bsId,
      chargeName:e.no,
      chargePort:e.RTNos,
      cpId:e.cpId,
      grp:e.grp

    })
   this.generateData();

  },

  generateData:function () {
    var that =this;
    var newsListArr=[];
   
   var tempPort = this.data.chargePort.split(",")
   console.log(tempPort)
   
    for (var i=0;i< tempPort.length;i++ )
  {
    var tempName=this.data.chargeName
    var temp_json = {
      "chargePort": tempPort[i],
      "chargeName": tempName,
      "bsName":this.data.bsName,
      "bsId":this.data.bsId,
      "cpId":this.data.cpId,
      "grp":this.data.grp
    }


    newsListArr.push(temp_json)
  }
  that.setData({
    listArr: newsListArr,
  })

  console.log("生成的参数")
   console.log(newsListArr)
   
    that.setData({
      onLoad:false
    })
  
  wx.hideLoading()
  }


})