var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        input:cc.EditBox,
        chatline:cc.Prefab,
        view:cc.ScrollView,
        layout:cc.Layout,
        _linnum:0, 

        _isfirst:true,
      
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('chat',function(event){           
            this.AddChatLine(event.detail.nick +':'+event.detail.msg);
        },this);
    },
   
    Btn_Send:function(){
        if(this.input.string=='') return;
        this.AddChatLine(global.myinfo.nickname +':'+ this.input.string);
        // var line = cc.instantiate(this.chatline);
        // line.getComponent(cc.Label).string =  global.myinfo.nickname +':'+ this.input.string;
        // // console.log( new Date() );可加上日期
        // line.parent = this.layout.node;
       
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
    },
    AddChatLine:function(msg){
         if(this._isfirst){
                this.layout.node.children[0].getComponent(cc.Label).string =msg;
                this._isfirst = false;
            }else{
                var line = cc.instantiate(this.chatline);
                line.getComponent(cc.Label).string =  msg;
                line.parent = this.layout.node;
                //行数超过就删除
                var num = this.layout.node.childrenCount;
               
                if(num > 20)
                    this.layout.node.children[0].destroy();

                if(num> 8)
                    this.view.scrollToBottom();
            }
    }

});
