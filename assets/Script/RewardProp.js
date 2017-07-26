cc.Class({
    extends: cc.Component,

    properties: {
        
        lab:cc.Label,
        spf:[cc.SpriteFrame], //0-钻石  1-冰冻  2-锁定
        // _type:1,
        // _num:1,
        // _x:0.0,
        // _y:0.0
    },

    // use this for initialization
    onLoad: function () {
        this.node.scaleX = this.node.scaleY =0.5;

        this.node.on('pop',function(event){
            //设定数量
            if(event.detail.num <=1 ) this.lab.node.active = false;
            else this.lab.string = event.detail.num;
            //设定道 具类型
            this.node.getComponent(cc.Sprite).SpriteFrame = this.spf[event.detail.type-1];
            //结束处理（消毁）
            var finished = cc.callFunc(this.PopFinish, this);
            //顺序动作
            var act =cc.sequence(
                cc.spawn(
                    cc.moveBy(0.2,0,50),
                    cc.scaleTo(0.2,1.2)
                ),
                cc.spawn(
                    cc.moveBy(0.15,0,-25),
                    cc.scaleTo(0.15,1)
                ),
                cc.delayTime(0.7),
                cc.moveTo(1,event.detail.x,event.detail.y ),
                finished
            );
            //执行动作
            this.node.runAction(act);
        },this);
    },

    PopFinish:function(){
        this.node.destroy();
    },

    // test:function(){
    //     this.node.emit('pop',{type:1,num:2,x:0,y:0});
    // }


    
});
