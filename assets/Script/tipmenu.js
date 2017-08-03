var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
       
       direct:1,//方向  1在左边  2 在右边

       btn_pop:cc.Node,
       btn_pay:cc.Node,
       btn_poxedex:cc.Node,
       btn_set:cc.Node,
       btn_back:cc.Node,

       paytip:cc.Node,
       paytip_lab:cc.Node,

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
    },

    // use this for initialization
    onLoad: function () {

        //设置 弹出菜单方向
        this.node.on('setdirect',function(event){
            this.direct = event.detail.direct;
            if(this.direct==2) {
                this.node.scaleX = -1;          
                this.btn_pay.scaleX = -1;
                this.btn_poxedex.scaleX = -1;
                this.btn_set.scaleX = -1;
                this.btn_back.scaleX = -1;
                this.paytip_lab.scaleX =-1;
                this.sx = this.node.x = cc.Canvas.instance.node.width/2 + this.node.width/2;
                this.tx = this.sx - this.node.width;                
            }else{
                this.sx= this.node.x = -cc.Canvas.instance.node.width/2 - this.node.width/2;
                this.tx = this.sx + this.node.width;               
            }
        },this);

        //弹出按钮
        // this.btn_pop.on('touchend',function(){
        //     var x= 0;            
        //     var that  = this;

        //     if(this.out) x = this.sx;
        //     else x= this.tx;

        //     this.node.runAction( cc.sequence(cc.moveTo(0.3,x,0),cc.callFunc(function(){
        //         that.btn_pop.scaleX = -that.btn_pop.scaleX;
        //         that.out = !that.out;
        //     })));
        // },this);

        //功能按钮
        this.btn_pay.on('touchend',function(){
            global.ui.emit('shop');
        },this);
        //鱼种类
        this.btn_poxedex.on('touchend',function(){
            global.ui.emit('fishtype');
        },this);
        //设置
        this.btn_set.on('touchend',function(){
             global.ui.emit('setting');
        },this);
       
        this.btn_back.on('touchend',function(){
            // cc.director.preloadScene('hall', function () {
            // cc.director.loadScene('hall');           
            //});
         global.ui.emit('exitgame');
        },this);

        this.node.on('paytip',function(){
            if(!this.out)
                this.Btn_Pop();
            
            this.paytip.active = true;
            this.paytip_lab.active = true;
            this.paytip.runAction(cc.repeatForever(cc.sequence( cc.fadeOut(0.8),cc.fadeIn(0.8) )));

        },this);
    },

    Btn_Pop:function(){
        var x= 0;            
        var that  = this;

        if(this.out) x = this.sx;
        else x= this.tx;

        this.node.runAction( cc.sequence(cc.moveTo(0.3,x,0),cc.callFunc(function(){
            that.btn_pop.scaleX = -that.btn_pop.scaleX;
            that.out = !that.out;

            if(that.paytip.active && !that.out){
                that.paytip.stopAllActions();
                that.paytip.active = false; 
                that.paytip_lab.active = false;
            }

        })));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
