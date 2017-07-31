cc.Class({
    extends: cc.Component,

    properties: {
      
      bg:cc.Node,
      num:cc.Label,   
      fishname:cc.Sprite,   
      fishid:1,
      fishspf:[cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('show',function(event){

            this.num.string = event.detail.num;
            this.fishid = event.detail.id -18;

            this.fishname.spriteFrame  = this.fishspf[this.fishid];

            this.bg.runAction(cc.sequence (cc.rotateBy(4.8,360*9.6),
                cc.callFunc(function() {
                        this.node.destroy();                   
                    }, this,) ) );

            this.num.node.runAction(   cc.repeatForever(
                                                cc.sequence(
                                                    cc.rotateTo(0.8, 25), 
                                                    cc.rotateTo(0.8, -25)
             )) );

        },this);

    },

    // onEnable:function(){


    //     this.node.emit('show',{num:2000,id:3});

    // },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
