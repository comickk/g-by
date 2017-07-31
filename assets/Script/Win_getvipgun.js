cc.Class({
    extends: require("PopWin"),

    properties: {
        win_vip:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
      
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
        this.win_vip.active =true;
        this.win_vip.emit('showvip',{vip:vip});
    },
});
