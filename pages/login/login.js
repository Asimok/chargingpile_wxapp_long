//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false,
        user_openid: '',
        user_code: '',
        user_data: ''
    },
    onLoad: function () {
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
                                    console.log("用户的code login:  login界面>>>" + res.code);
                                    wx.request({
                                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx70c5b593e65351a8&secret=69ab78befe069b6a55397d50801f9e72&js_code=' + res.code + '&grant_type=authorization_code' + res.code + '&grant_type=authorization_code',
                                        success: res => {
                                            // 获取到用户的 openid
                                            that.setData({
                                                user_openid: res.data.openid
                                            })

                                            console.log("用户的openid:  login界面>>>" + res.data.openid);
                                            console.log(res)

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
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
                isHide: true
            });
            that.UserLogin();
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    },
    UserLogin: function () {
        var that =this
    
     
        wx.request({
            url: 'http://192.168.1.224:8081/long/login',
            method: "POST",
            data: {
                "openId": that.data.user_openid
            },
            // 解析注册状态
            success: (res) => {
                console.log("登录状态")
                console.log(res)
                var status = res.data.status
                console.log(res.data.status)
                if (status == -1) {
                    // 注册
                    this.register();
                }
                else
                {
                     // 登录 跳转
                     wx.reLaunch({
                        url: '/pages/main/main',
                    })
                }
            }
        })
    },

    register: function () {
        console.log("手机号注册");
        console.log("openid  to verification_code:" + this.data.user_openid);
        wx.navigateTo({
            url: '/pages/verification_code/verification_code?openid=' + this.data.user_openid,
        })
    },

})