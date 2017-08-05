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
       
        switch( customEventData){
            case 'vip1':
                vip = 1;            
            break;         
            case 'vip2':
                vip =2;
            break;
            case 'vip3':
                vip =3;
            break;
            case 'vip4':
                vip =4;
            break;
            case 'vip5':
                vip =5;
            break;
        }
        if(customElements+0  > global.myinfo.vip){
            this.win_vip.active =true;
            this.win_vip.emit('showvip',{vip:vip});
        }else{
            this.Hide();
            //发送VIP变炮样式消息
        }        
    },
});
