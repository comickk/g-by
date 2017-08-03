cc.Class({
    extends: cc.Component,

    properties: {
      
        headImg:cc.Sprite,
        glod:cc.Label,
        diamond:cc.Label,
        gunlevel:cc.Label,
        online:cc.Node,
        wait:cc.Node, 
        infobg:cc.Node,
        chat:cc.Node,
        icetip:cc.Node,

        bankruptcy:cc.Node,

        vipicon:cc.Sprite,
        vip_spf:[cc.SpriteFrame],
        //_nick:'',
        //_level:'',
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('playercome',function(event){
            var msg = event.detail;
            this.wait.active = false;
            //set head Img
            this.online.active = true;

            //设定VIP等级及图标
            this.vipicon.spriteFrame = null;
            this.diamond.string = '普通会员';
            if(msg.vip-0 >0){
                if(msg.vip-0 < 6 ){
                    this.vipicon.spriteFrame = this.vip_spf[msg.vip-1];
                    this.diamond.string = 'VIP '+ msg.vip + '级';
                }                
            }

           // this.playername.string = event.detail.name;
            this.glod.string = msg.gold.toString();
            //this.diamond.string = event.detail.diamond.toString();

            this.gunlevel.string = msg.lv_curr;

              if(msg.gold-0 == 0){
                if(!this.bankruptcy.active)
                    this.bankruptcy.active = true;
            }

            this.infobg.getChildByName('nick').getComponent(cc.Label).string =   msg.name; 
            this.infobg.getChildByName('level').getComponent(cc.Label).string =   '等  级: '+msg.lv_max; 
            this.infobg.getChildByName('gun').getComponent(cc.Label).string =   '炮等级: '+msg.lv_max;             

        },this);

        this.node.on('playerquit',function(){
           this.wait.active = true;
           this.online.active = false;
        },this);


        this.node.on('freeze',function(){
            this.icetip.active = true;
            var that = this;
            this.scheduleOnce( function() {	that.icetip.active = false;}, 3);
        },this);

        this.node.on('setgunlevel',function(event){ this.gunlevel.string = event.detail.level},this);

        this.node.on('changegold',function(event){
            this.glod.string = event.detail.gold.toString();

            if(event.detail.gold-0 == 0){
                if(!this.bankruptcy.active)
                    this.bankruptcy.active = true;
            }
            else{
                if(this.bankruptcy.active)
                    this.bankruptcy.active = false;
            }
        },this);

        this.node.on('showinfo',function(){
            //cc.log('马上要显示玩家信息了哦');
             if(!this.infobg || this.infobg.active) return;
             var  that  =this;
             that.infobg.active = true;	
			this.scheduleOnce(function() {
				that.infobg.active = false;				
			}, 5);
        },this);

        this.node.on('chat',this.PlayerChat,this);
    }, 

    PlayerChat:function(event){
        if(this.chat.active) return;
        this.chat.active = true;
        this.chat.getChildByName('label').getComponent(cc.Label).string = event.detail.msg;
        this.chat.scaleX = this.chat.scaleY = 0.2;
        this.chat.runAction(cc.scaleTo(0.4,1));

        var that =this;
        this.scheduleOnce(function() {
				that.chat.active = false;				
		}, 5);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
