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
        this.node.on('chat',function(event){
             var line = cc.instantiate(this.chatline);
             line.getComponent(cc.Label).string =  event.detail.nick +':'+event.detail.msg;
             line.parent = this.layout.node;
        },this);
    },
   
    Btn_Send:function(){
        if(this.input.string=='') return;
        var line = cc.instantiate(this.chatline);
        line.getComponent(cc.Label).string =  global.myinfo.nickname +':'+ this.input.string;
        // console.log( new Date() );可加上日期
        line.parent = this.layout.node;
       
        //发送消息        
        var that = this;
		var p = {
			version: 102,
			method: 2003,
			seqId: Math.random() * 1000,
			timestamp: new Date().getTime(), 
			data: that.input.string,
		};		
		var jsp= JSON.stringify(p);	
		global.socket.ws.send(jsp);  
        
       // global.ui.emit('chat',{seat:global.myseat,msg:this.input.string});
        this.input.string='';
        //
        this.Hide();
    }
});
