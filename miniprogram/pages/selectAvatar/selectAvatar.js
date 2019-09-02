// miniprogram/pages/selectAvatar/selectAvatar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system_avatar: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPresetImages()
  },
  
  // 上传头像
  chooseImage: function(){
    let that = this;
    // 让用户选择一张图片
    wx.chooseImage({
      success: res => {
        // 选择图片后直接上传云存储
        that.uploadFile(res.tempFilePaths[0])
        // let avatar = {
        //   tempFile: true,
        //   path: res.tempFilePaths[0]
        // }
        // wx.setStorageSync('new_user_avatar', avatar)
        // wx.navigateBack({delta: 1})
      }
    })
  },
  // 选择系统头像
  selectImage: function(e){
    // let avatar = {
    //   tempFile: false,
    //   path: e.currentTarget.dataset.path
    // }
    wx.setStorageSync('user_avatar', e.currentTarget.dataset.path)
    wx.navigateBack({ delta: 1 })
  },

  // 上传文件
  uploadFile: function (tempFilePaths){
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径,文件统一以时间戳命名
      cloudPath: 'userAvatar/' + (new Date()).valueOf() + '.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: tempFilePaths,
      // 成功回调
      success: res => {
        console.log('上传成功', res)
        // 保存头像的云空间地址
        wx.setStorage({
          key: 'user_avatar',
          data: res.fileID,
          success: wx.navigateBack({ delta: 1 })
        })
      }
    })
  }, 

  // 获取系统头像列表
  getPresetImages: function(){
    let that = this;
    // 加载提示
    wx.showLoading({title: '加载中'})
    // 调用云函数获取数据
    wx.cloud.callFunction({
      name: 'database',
      data: {
        action: 'getSystemImages',
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        wx.hideLoading()
        console.log('getSystemImages', res)
        let system_avatar = res.result.data;
        that.setData({ system_avatar })
      }, fail: err => {
        wx.hideLoading();
        console.error('[云函数]调用失败', err)
      }
    })
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