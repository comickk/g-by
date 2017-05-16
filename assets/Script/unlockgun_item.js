cc.Class({
    extends: cc.Component,

    properties: {
       lab_gunlv:cc.Label,//解锁的炮倍数
       sp_gun:cc.Sprite,//中心炮图
       sp_lock:cc.Node, //锁图

       mask:cc.Node,
       lab_gift:cc.Label,//获赠的金币数
       lab_cost:cc.Label,//消耗的钻石数

       icon_unlock:cc.Node,
       icon_lock:cc.Node,

        btn_unlock:cc.Node,

        isunlock:false,
        isselect:true, 
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('setitem',this.setitem,this);//islock  gunlv  isselect gift   cost

        
          this.btn_unlock.on('touchend',function(){

             if(this.isselect) 
              this.node.getComponent(cc.Animation).play();
           },this);
      
    },

    setitem:function(event){
        var msg = event.detail;

        this.lab_gunlv.string = msg.gunlv;
        this.isunlock = !msg.islock;
        this.isselect = msg.isselect;

        if(msg.islock){
          this.icon_lock.active = true;
          this.icon_unlock.active = false;
          this.mask.active = true;
          this.sp_lock.active = true;

          if(msg.isselect){
              this.lab_gift.string = msg.gift;
              this.lab_cost.string = msg.cost;

               this.node.scaleX =1.1;
                this.node.scaleY =1.1;
          }else{
            this.lab_gift.string = this.lab_cost.string =':::';
          }

        }else{
          this.icon_lock.active = false;
          this.icon_unlock.active = true;
           this.mask.active = false;
            this.sp_lock.active = false;

        }
    },

    unlock:function(){

        if(this.isunlocked) return;

    },

    animfinish:function(){

        this.icon_lock.active = false;
        this.icon_unlock.active = true;

        this.node.scaleX =1;
        this.node.scaleY =1;

        this.isselect = false;
        this.isunlock = true;

        this.node.dispatchEvent(new cc.Event.EventCustom('animfinish',true));
    }
});
