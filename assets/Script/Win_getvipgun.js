var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        win_vip:cc.Node,
        gunlock:[cc.Node],
    },

    // use this for initialization
    // onLoad: function () {
      
    // },

    onEnable :function(){
        this._super();
        var vip =global.myinfo.vip+0;
        for(var i=0;i<this.gunlock.length;i++){
            if( i < vip)
                this.gunlock[i].active =false;
            else
                break;
        }
    },

    Btn_GetGun:function(event,customEventData){
         var vip = 0;
       var style=4;
        switch( customEventData){
            case 'vip1':
                vip = 1;      
                style =4;      
            break;         
            case 'vip2':
                vip =2;
                style =5;
            break;
            case 'vip3':
                vip =3;
                style =6;
            break;
            case 'vip4':
                vip =4;
                style =7;
            break;
            case 'vip5':
                vip =5;
                style =8;
            break;
        }
        if(vip  > global.myinfo.vip){
          
            this.win_vip.active =true;
            this.win_vip.emit('showvip',{vip:vip});
        }else{
             
            var p = {
				version: 102,
				method: 5013,				
				seqId: Math.random() * 1000,
				timestamp: new Date().getTime(),
				data:JSON.stringify({level:global.mygunlv ,style:style}),
			};
		    global.socket.ws.send(JSON.stringify(p));	
            this.Hide();
            //发送VIP变炮样式消息
        }        
    },
});
