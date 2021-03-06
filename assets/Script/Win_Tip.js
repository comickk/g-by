var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        
      tipmsg:'',   
      tiplabel:cc.Label,     
     
      btn_accept:cc.Node,

      btn_cancel:cc.Node,
      btn_exit:cc.Node,     

      _ok_callback:null,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this._scene = '';
        this.node.on('settip',function(event){ //type: 弹窗类型2（提示信息） 1确认关闭 msg:

             if(cc.isValid(event.detail.callback))
                    this._ok_callback = event.detail.callback;
             
           if(event.detail.type == 1){
              // this._scene = event.detail.msg;
               
                this.btn_cancel.active = true;
               this.btn_exit.active = true;
               this.btn_accept.active = false;
                this.tiplabel.string = '确定要退出吗？';
           }

           if(event.detail.type == 2){
               //this._scene='';
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
           var that = this;

           this.BtnOK();
            // if(this._scene ==''){
            //     	//结束统计
            //     // if( cc.isValid( global.anysdk))
            //     //     global.anysdk.stopSession();

            //     cc.game.end();                
            // }else{             
            //         var p = {
            //             version: 102,
            //             method: 3005,                       
            //             seqId: Math.random() * 1000,
            //             timestamp: new Date().getTime(),                     
            //         };
            //         global.socket.ws.send(JSON.stringify(p));	
        
            //         cc.director.preloadScene(that._scene, function () {
            //             cc.audioEngine.stopAll();
            //             cc.director.loadScene(that._scene);   
            //         })
            // } 
        },this);
    },   

    BtnOK:function(){      
       
        if( cc.isValid( this._ok_callback) ){
            this._ok_callback();
            this._ok_callback = null;
        }
        this.Hide();
    },
});
