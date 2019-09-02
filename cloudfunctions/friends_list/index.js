// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getList': {
      // 获取用户的好友列表
      return db.collection('friends_list').field({
        _id: true,
        name: true,
        avatarUrl: true,
        gender: true,
        birthdate: true
      }).where({ openid: event.openid }).get()
    }
    case 'getDetail': {
      // 获取好友详情
      return db.collection('friends_list').where({ 
        _id: event.id 
      }).get()
    }
    case 'updateInfo': {
      // 更新好友信息
      return db.collection('friends_list').where({
        _id: event.id
      }).update({
        data: event.dataJson
      })
    }
    case 'deleteInfo': {
      // 删除好友信息
      return db.collection('friends_list').where({
        _id: event.id
      }).remove()
    }
    case 'createInfo': {
      // 添加好友记录
      return db.collection('friends_list').add({
        data: event.friendInfo
      })
    }
    default: {
      return event.action + '方法不存在'
    }
  }
}







