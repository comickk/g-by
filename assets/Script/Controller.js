cc.Class({
    extends: cc.Component,

    properties: {
      _running:true,     
    },

    // use this for initialization
    onLoad: function () {

         var that = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {           
            if(that._running){
                //cc.log('----------game hide');
                that._running =false;
                that.onHide();
            }            
        });

         cc.game.on(cc.game.EVENT_SHOW, function () {
           
            if(!that._running){
                //cc.log('----------game show');
                that._running = true;
                that.onShow();
            }
        });

        
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.Event_Home, this);
       
    },

    onDestroy:function(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onHide:function(){

    },
    onShow:function(){

    },

    onKeyDown:function(event){
        /**
         * android  home 3   back 4
         */
        
        if(!cc.sys.isMobile ) return;
        switch(event.keyCode) {
            case cc.KEY.back:
                console.log('Press back');
                this.Event_Back();
                break;
            // case cc.KEY.pause:
            //     console.log('Press pause');
            //     this.Event_Pause();
            //     break;
            case cc.KEY.home:
                 console.log('Press home');
                 this.Event_Home();
                break;
            } 
    },   
    Event_Back:function(){

    },
    Event_Pause:function(){

    },
    Event_Home:function(){

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
