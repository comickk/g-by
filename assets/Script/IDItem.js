cc.Class({
    extends: cc.Component,

    properties: {
      userID:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
      
    },

    Btn_Click:function(){
        
    },

    DelItem:function(){

        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
