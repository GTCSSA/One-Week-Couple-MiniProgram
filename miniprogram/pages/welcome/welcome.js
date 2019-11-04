// pages/welcome/welcome.js

const app = getApp()
var util = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready: false
  },
  bindGetUserInfo: function (e) {
    var that = this
    app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
    console.log(e.detail.userInfo.avatarUrl)
    wx.reLaunch({
      url: '../register/register',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    var time = util.formatTime(new Date());
    // console.log(new Date('2002-01-01 00:00:00').getTime())
    console.log(time)
    // var arr = time.split("/")
    // console.log(arr[2])
    var month = parseInt(time.substring(5, 7))
    var date = parseInt(time.substring(8, 10))
    //console.log(date)
    //if (time > new Date('2002-01-01 00:00:00').getTime()) {
    if (month > 0 && date > 0 || month > 0 && date > 0) {
      //console.log('time')
      wx.reLaunch({
        url: '../cantRegister/cantRegister',
      })
    } else {
      //console.log('notimetime')
    

    //获取数据库中user信息
    setTimeout(function () {
      wx.cloud.callFunction({
        name: 'login', data: {}, success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)

          // 初始化app.globaldata
          app.globalData.openid = res.result.openid

          const db = wx.cloud.database()
          db.collection('user').where({
            _openid: app.globalData.openid
          })
            .get({
              success: function (res) {

                //如果user已经register, 进入index界面, 未注册进入register界面
                if (res.data.length) {
                  app.globalData.myData = res.data[0]
                  app.globalData.update_user_info = true
                  app.globalData.images = {}
                  console.log(res.data[0])
                  if (res.data[0].cp == '') {
                    wx.reLaunch({
                      url: '../user_info_display/user_info_display',
                    })
                  } else {
                    wx.reLaunch({
                      url: '../cp_info_display/cp_info',
                    })
                  }
                } else {
                  that.setData({
                    ready: true
                  })
                }
              }
            })
        }, fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url: '../deployFunctions/deployFunctions',
          })
        }
      })
    }, 1500)
    }

    //如果user没有register, 进入register页面
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})