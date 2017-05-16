cc.Class({
    extends: require("PopWin"),

    properties: {
        
      tipmsg:'',   
      tiplabel:cc.Label,     
     
      btn_accept:cc.Node,

      btn_cancel:cc.Node,
      btn_exit:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('settip',function(event){ //type: 弹窗类型1（提示信息） 2确认关闭 msg:
           if(event.detail.type == 1){
                 this.btn_cancel.active = true;
               this.btn_exit.active = true;
               this.btn_accept.active = false;
                this.tiplabel.string = '确定要退出吗？';
           }

           if(event.detail.type == 2){
               this.btn_cancel.active = false;
               this.btn_exit.active = false;
               this.btn_accept.active = true;
            this.tipmsg=event.detail.msg;
            this.tiplabel.string = this.tipmsg;
           }
        },this);   

        
        this.btn_cancel.on('touchend',function(){          
           this.Hide();
        },this);   

        this.btn_exit.on('touchend',function(){
            //退出程序
            cc.game.end();
        });
    },   
});
