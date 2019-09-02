// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  attached: function(){
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close: function(){
      this.triggerEvent('close')
    }
  }
})
