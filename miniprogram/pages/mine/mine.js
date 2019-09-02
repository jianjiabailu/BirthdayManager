// miniprogram/pages/mine/mine.js

const lunar = require('../../unitl/lunar.js')
const api = require('../../unitl/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mineInfo: {},
    lunar: false,
    avatarUrl: '../../images/user-unlogin.png',
    defaultBg: '../../images/starry-1.jpg',
    male: '../../images/male.png',
    female: '../../images/female.png',
    zodiac: {
      en: {
        "魔羯座": "../../images/zodiac_en/capricorn.png",
        "水瓶座": "../../images/zodiac_en/aquarius.png",
        "双鱼座": "../../images/zodiac_en/pisces.png",
        "牡羊座": "../../images/zodiac_en/aries.png",
        "金牛座": "../../images/zodiac_en/tauruses.png",
        "双子座": "../../images/zodiac_en/gemini.png",
        "巨蟹座": "../../images/zodiac_en/cancer.png",
        "狮子座": "../../images/zodiac_en/leo.png",
        "处女座": "../../images/zodiac_en/virgo.png",
        "天秤座": "../../images/zodiac_en/libra.png",
        "天蝎座": "../../images/zodiac_en/scorpio.png",
        "射手座": "../../images/zodiac_en/sagittarius.png"
      },
      cn: [
        '../../images/zodiac_cn/monkey.png',
        '../../images/zodiac_cn/chicken.png',
        '../../images/zodiac_cn/dog.png',
        '../../images/zodiac_cn/pig.png',
        '../../images/zodiac_cn/rat.png',
        '../../images/zodiac_cn/cow.png',
        '../../images/zodiac_cn/tiger.png',
        '../../images/zodiac_cn/rabbit.png',
        '../../images/zodiac_cn/dragon.png',
        '../../images/zodiac_cn/snake.png',
        '../../images/zodiac_cn/horse.png',
        '../../images/zodiac_cn/sheep.png'
      ]
    },
    // 待上传状态
    uploadding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  // 获取用户信息
  getUserInfo: function () {
    let that = this;
    wx.showLoading({title: '加载中'})
    // 调用云函数获取数据
    wx.cloud.callFunction({
      name: 'user_list',
      data: {
        action: 'getInfo',
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        wx.hideLoading()
        console.log('getInfo', res)
        let mineInfo = res.result.data[0];
        let birthArr = mineInfo.birthdate.split('-');
        // 查询农历生日的中文格式
        mineInfo.birthday = [lunar.chineseYear(birthArr[0]), lunar.chineseMonth(birthArr[1]), lunar.chineseDay(birthArr[2])];
        // 查询阳历生日
        mineInfo.solar = lunar.toSolar(birthArr[0], birthArr[1], birthArr[2])
        // 查询生肖年
        mineInfo.zodiac_cn = lunar.zodiacYear(birthArr[0]);
        mineInfo.zodiac_cn_img = that.data.zodiac.cn[birthArr[0] % 12];
        // 查询星座
        mineInfo.zodiac_en = lunar.zodiac_sign(mineInfo.solar[1], mineInfo.solar[2]);
        mineInfo.zodiac_en_img = that.data.zodiac.en[mineInfo.zodiac_en];
        // 查询下次生日
        mineInfo.nextBirth = api.nextBirthdate(birthArr[0], birthArr[1], birthArr[2])
        that.setData({ mineInfo })
      }, fail: err => { }
    })
  },

  // 选择图片
  chooseImage: function(){
    let that = this;
    // 让用户选择一张图片
    wx.chooseImage({
      success: res => {
        let mineInfo = that.data.mineInfo;
        mineInfo.background = res.tempFilePaths[0];
        that.setData({ mineInfo, uploadding: true })
      }
    })
  },

  // 上传图片
  uploadFile: function () {
    let that = this;
    let tempFilePaths = this.data.mineInfo.background;
    let file = (new Date()).valueOf() + '.png';
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'userBackground/' + file,
      // 指定要上传的文件的小程序临时文件路径
      filePath: tempFilePaths,
      // 成功回调
      success: res => {
        console.log('上传成功', res)
        that.updateInfo(res.fileID)
      }
    })
  },

  // 更新信息
  updateInfo: function(cloudPath){
    let that = this;
    // 调用云函数获取数据
    wx.cloud.callFunction({
      name: 'user_list',
      data: {
        action: 'updateInfo',
        id: that.data.mineInfo._id,
        dataJson: {background: cloudPath}
      },
      success: res => {
        console.log('updateInfo', res)
        that.setData({uploadding: false})
        // 刷新页面数据
        that.onLoad()
      }, fail: err => {
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

  },

  // 查看详情
  toDetail: function(){
    wx.navigateTo({
      url: '../../pages/detail/detail?params=' + JSON.stringify({
        id: this.data.mineInfo._id,
        identity: 'mine'
      })
    })
  },

  // 阴阳历切换
  lunisolar: function(){
    let lunar = this.data.lunar;
    this.setData({lunar: lunar?false:true})
  }
})