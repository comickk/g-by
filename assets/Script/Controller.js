cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // use this for initialization
    onLoad: function () {
        
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.Event_Home, this);
       
    },

    onDestroy:function(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown:function(){
        switch(event.keyCode) {
            case cc.KEY.back:
                console.log('Press back');
                this.Event_Back();
                break;
            case cc.KEY.pause:
                console.log('Press pause');
                this.Event_Pause();
                break;
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
