var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        input:cc.EditBox,
        chatline:cc.Prefab,
        layout:cc.Layout,
        _linnum:0, 
      
    },

    // use this for initialization
    onLoad: function () {

    },
   
    Btn_Send:function(){
        if(this.input.string=='') return;
        var line = cc.instantiate(this.chatline);
        line.getComponent(cc.Label).string =  global.myinfo.nickname +':'+ this.input.string;
        // console.log( new Date() );可加上日期
        line.parent = this.layout.node;
       
        //发送消息
        
        global.ui.emit('chat',{seat:global.myseat,msg:this.input.string});
        this.input.string='';
        //
        this.Hide();
    }
});
