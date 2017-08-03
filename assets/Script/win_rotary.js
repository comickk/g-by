cc.Class({
    extends: cc.Component,

    properties: {

        bglay:cc.Node,
        btn_start:cc.Node,
        rotary:cc.Node,
       
        light:[cc.Node],

        selectlight:cc.Node,

        win_prize:cc.Node,

        sound:[cc.AudioClip],

        isstart:{
            default:false,
            visible:false,
        },

        _isend :false,
        _prizeid:3,
        _prizenum:100,

        _lastrot:0,
    },

    // use this for initialization
    onLoad: function () {

        this.bglay.active = true;
        //this.node.zIndex = this.bglay.zIndex-1;

        this.node.on('setprize',function(event){
            this._prizeid = event.detail.id;
            this._prizenum = event.detail.num;
        },this);

        this.btn_start.on('touchend',function(){
          
             if(this.isstart) return;
                this.isstart = true;               
           
            //转盘旋转动作
             var act =  cc.rotateBy(8,360*12+45*(this._prizeid-1)).easing(cc.easeQuarticActionInOut());
            //弹出奖励品界面动作
             var act1= cc.repeat(cc.sequence(cc.fadeTo(0.3,50),cc.fadeTo(0.3,255)),2);
            
             
             var finished1 = cc.callFunc(function () {               
               
               this.bglay.zIndex =this.node.zIndex+1 ;

               this.win_prize.active = true;
               this.win_prize.emit('setnum',{num:this._prizenum});
               this.win_prize.zIndex = this.bglay.zIndex+1;
               this.win_prize.scaleX = this.win_prize.scaleY=0.3;
               this.win_prize.runAction( cc.scaleTo(0.2,1,1));
               this.unscheduleAllCallbacks();              
            }, this);
            
            var finished = cc.callFunc(function () {               
                this.selectlight.active = true;  
               
                //sound
               // cc.audioEngine.play(this.sound[1], false,global.volume);
                this.node.emit('rotaryendsound',this);

                this._isend =true;
                this.selectlight.runAction(cc.sequence(act1,finished1));              
            }, this);

             this._lastrot = this.rotary.rotation;
           
             //sound
            // cc.audioEngine.play(this.sound[0], false,global.volume);
            this.node.emit('rotarysound',this);    
              
            this.rotary.runAction(  cc.sequence(act,finished)   );//开启转 盘       
            
            //this.node.emit('rotarysound',this);

        },this);

        this.node.on('rotarysound',function(){
             //sound
             cc.audioEngine.play(this.sound[0], false,0.8);   
        },this);

        this.node.on('rotaryendsound',function(){
             //sound
             cc.audioEngine.play(this.sound[1], false,0.8);   
        },this);
        

        this.schedule(function() {  
            this.light[0].active = !this.light[0].active;
            this.light[1].active = !this.light[1].active;
        }, 0.3);
    },

    update:function(){
        if(this._isend) return;
        if(!this.isstart) return;       
       
        if(this.rotary.rotation > (this._lastrot +360) ){
            //sound
           // cc.audioEngine.play(this.sound[0], false,global.volume);  
           this.node.emit('rotarysound',this);

            this._lastrot =this.rotary.rotation;
        }   
    },    
});
