cc.Class({
    extends: cc.Component,

    properties: {
        light:cc.Node,
        prize:cc.Node,

        poplayer:cc.Node,
        winlotter:cc.Node,

        gold_num:cc.Label,

        room:cc.Node,
    },


    // use this for initialization
    onLoad: function () {
                                 
        this.node.on('setnum',function(event){
            this.gold_num.string =event.detail.num;
        },this);

        this.light.runAction(cc.repeatForever(cc.rotateBy(1,25)));

    },

    btn_getprize:function(){

        this.room.emit('getprize');
        this.poplayer.zIndex =this.winlotter.zIndex-1 ;
        this.poplayer.active = false; 

        this.winlotter.destroy();
        this.node.destroy();

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
