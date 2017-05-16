cc.Class({
    extends: cc.Component,

    properties: {

        bglay:cc.Node,
        btn_start:cc.Node,
        rotary:cc.Node,
       
        light:[cc.Node],

        selectlight:cc.Node,

        win_prize:cc.Node,

        isstart:{
            default:false,
            visible:false,
        },

        prizeid:{
            default:3,
            visible:false,
        }
    },

    // use this for initialization
    onLoad: function () {

        this.bglay.active = true;
        //this.node.zIndex = this.bglay.zIndex-1;

        this.btn_start.on('touchend',function(){
          
             if(this.isstart) return;
                this.isstart = true;

             var act =  cc.rotateBy(8,360*12+45*this.prizeid).easing(cc.easeQuarticActionInOut());
             var act1= cc.repeat(cc.sequence(cc.fadeTo(0.3,50),cc.fadeTo(0.3,255)),2);
             
             var finished1 = cc.callFunc(function () {               
               
               this.bglay.zIndex =this.node.zIndex+1 ;

               this.win_prize.active = true;
               this.win_prize.zIndex = this.bglay.zIndex+1;
               this.win_prize.scaleX = this.win_prize.scaleY=0.3;
               this.win_prize.runAction( cc.scaleTo(0.2,1,1));
            }, this);
            
            var finished = cc.callFunc(function () {
               
                this.selectlight.active = true;               
               this.selectlight.runAction(cc.sequence(act1,finished1));              
            }, this);

            this.rotary.runAction(  cc.sequence(act,finished)   );
        },this);

        this.schedule(function() {  
            this.light[0].active = !this.light[0].active;
            this.light[1].active = !this.light[1].active;
        }, 0.3);
    },
});
