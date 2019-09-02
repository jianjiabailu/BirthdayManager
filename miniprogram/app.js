//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'openapi',
      data: { action: 'getOpenid' },
      success: res => {
        let openid = res.result.openid;
        wx.setStorageSync('openid', openid)
      }, fail: err => {
        console.error('[云函数] [openapi] 调用失败', err)
      }
    })
  }
})
