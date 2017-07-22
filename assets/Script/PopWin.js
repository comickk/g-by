var PopWin = cc.Class({
    extends: cc.Component,

    properties: {
        sound:[cc.AudioClip],
        BGlayer:cc.Node,    

        // hidebg:{
        //     default:true,      
        //     visible:false
        // }
    },

   
    onLoad: function () {

        this.node.scaleX=0.5;
        this.node.scaleY=0.5;  
        //this.node.on('hide',this.Hide,this);   
        //if(this.BGlayer)
         //   this.BGlayer.on('touchend',function(){event.stopPropagation();});  
       // this.node.on('touchend',function(){event.stopPropagation();});   
    },    

    Hide:function(){
  
        //this.hidebg = true;

        if(this.sound[1])
            cc.audioEngine.play(this.sound[1]);
       this.node.runAction( cc.sequence(cc.scaleTo(0.15,0.3,0.3),
            cc.callFunc(function(){  this.node.active = false; },this )));
    },    

    onEnable :function(){
        if(this.BGlayer)
            this.BGlayer.active = true;
            //this.BGlayer.color  = cc.Color.GRAY;

        this.node.scaleX=0.5;
        this.node.scaleY=0.5;
        if(this.sound[0])
            cc.audioEngine.play(this.sound[0]);
       this.node.runAction( cc.sequence(cc.scaleTo(0.12,1.1,1.1),cc.scaleTo(0.18,1,1)));

    },
    onDisable:function(){

        if(this.BGlayer)
            this.BGlayer.active = false;
           // this.BGlayer.color  = cc.Color.WHITE;

    }
    
});
module.exports = PopWin;
