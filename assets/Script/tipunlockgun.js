cc.Class({
    extends: cc.Component,

    properties: {
      
      direct:1,
      tipbg:cc.Node,
      light:cc.Node,
      title:cc.Node,
      frame1:cc.Node,
      frame2:cc.Node,
      prog:cc.ProgressBar,
      icon:cc.Node,

      l_gunlv:cc.Label,
      l_pay:cc.Label,
      l_cost:cc.Label,

      islock:{
        default:true,       // 1弹出未达到条件   2弹出达到条件
        visible:false
      },

        sx:{
        default:0,      
        visible:false
       },
       tx:{
        default:0,      
        visible:false
       },

       out:{    //是否弹出了
            default:false,      
            visible:false
       },

       _enable:true,
    },

    // use this for initialization
    onLoad: function () {

         this.node.on('setdirect',function(event){
            this.direct = event.detail.direct;
            if(this.direct==2) {//右
                
                this.node.x = cc.Canvas.instance.node.width/2 -42 ;
                this.tipbg.x = -60;
               
            }else{
               this.node.x = -cc.Canvas.instance.node.width/2 + 42;  
               this.tipbg.x = 60;  
               this.tipbg.scaleX = -1;
               //反向内容
              // this.frame1.x-=95;
               //this.frame2.x-=95;
                this.title.scaleX = -1;
                this.frame1.scaleX = -1;
                this.frame2.scaleX = -1;
            }
        },this);

         //设置 状态和文字
         this.node.on('setstatus',function(event){
            this.islock = event.detail.islock;    
            if(!this.islock )
            {
                this.light.active = true;
                this.light.runAction(cc.repeatForever(  cc.sequence(cc.fadeIn(0.8),cc.fadeOut(0.8) )));
            }       
            else
                this.light.active = false;
         },this);

         this.icon.on('touchend',function(){
             if(!this._enable) return;
             this._enable = false;
            var bx=-175;
            if(this.direct==1) bx= -bx;
            if(this.out) bx = -bx;
            var that = this;
            var frame;
            if(this.islock) frame = this.frame1;
            else frame = this.frame2;

            frame.active = !frame.active;
            this.title.active = !this.title.active;
            this.tipbg.runAction( cc.sequence(cc.moveBy(0.3,bx,0),cc.callFunc(function(){
                that.out = !that.out;   
                that._enable = true;             
            })));
         },this);

         this.frame2.on('touchend',function(){

          //点击解锁炮台
         });
         
         this.prog.progress = 2/10;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
