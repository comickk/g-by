cc.Class({
    extends: cc.Component,

    properties: {
        light:cc.Node,
        prize:cc.Node,

        poplayer:cc.Node,
        winlotter:cc.Node,
    },


    // use this for initialization
    onLoad: function () {
                                 
        this.light.runAction(cc.repeatForever(cc.rotateBy(1,25)));

    },

    btn_getprize:function(){

        this.poplayer.zIndex =this.winlotter.zIndex-1 ;
        this.poplayer.active = false; 

        this.winlotter.destroy();
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
