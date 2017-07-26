var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        
      tipmsg:'',   
      tiplabel:cc.Label,     
     
      btn_accept:cc.Node,

      btn_cancel:cc.Node,
      btn_exit:cc.Node,

      _scene:'',
    },

    // use this for initialization
    onLoad: function () {
        this._scene = '';
        this.node.on('settip',function(event){ //type: 弹窗类型2（提示信息） 1确认关闭 msg:
           if(event.detail.type == 1){
               this._scene = event.detail.msg;
               
                 this.btn_cancel.active = true;
               this.btn_exit.active = true;
               this.btn_accept.active = false;
                this.tiplabel.string = '确定要退出吗？';
           }

           if(event.detail.type == 2){
               this._scene='';
               this.btn_cancel.active = false;
               this.btn_exit.active = false;
               this.btn_accept.active = true;
                this.tipmsg=event.detail.msg;

               // if( typeof(event.detail.scene) != 'undefine')
               if(cc.isValid(event.detail.scene))
                 this._scene = event.detail.scene;

            this.tiplabel.string = this.tipmsg;
           }
        },this);   

        
        this.btn_cancel.on('touchend',function(){          
           this.Hide();
        },this);   

        this.btn_exit.on('touchend',function(){
            //退出程序                     
           var that = this;
            if(this._scene =='')
                cc.game.end();
            else{             
                    var p = {
                        version: 102,
                        method: 3005,                       
                        seqId: Math.random() * 1000,
                        timestamp: new Date().getTime(),                     
                    };
                    global.socket.ws.send(JSON.stringify(p));	
        
                    cc.director.preloadScene(that._scene, function () {
                        cc.audioEngine.stopAll();
                        cc.director.loadScene(that._scene);   
                    })
            } 
        },this);
    },   

    BtnOK:function(){

        console.log(this._scene);
        if(this._scene!= ''){
            var that = this;
             cc.director.preloadScene(that._scene, function () {
                    cc.audioEngine.stopAll();
                    cc.director.loadScene(that._scene);   
            })
        }
        this.Hide();
    },
});
