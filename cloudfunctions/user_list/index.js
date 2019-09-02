// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'checkInfo': {
      // 检查用户信息
      return db.collection('user_list').where({
        openid: event.openid
      }).count()
    }
    case 'getInfo': {
      // 获取用户信息
      return db.collection('user_list').where({
        openid: event.openid
      }).get()
    }
    case 'getDetail': {
      // 获取用户详情
      return db.collection('user_list').where({
        _id: event.id
      }).get()
    }
    case 'updateInfo': {
      // 修改用户信息
      return db.collection('user_list').where({
        _id: event.id
      }).update({
        data: event.dataJson
      })
    }
    case 'deleteInfo': {
      // 删除用户信息
      return db.collection('user_list').where({
        _id: event.id
      }).remove()
    }
    case 'createInfo': {
      // 添加用户信息
      return db.collection('user_list').add({
        data: event.dataJson
      })
    }
    default: {
      return event.action + '方法不存在'
    }
  }
}
