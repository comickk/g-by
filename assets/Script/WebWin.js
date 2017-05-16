cc.Class({
    extends: cc.Component,

    properties: {

         top:0,
         bottom:0,
         web:cc.Node,

         title:cc.Label,
         weburl:'',
       
    },

    // use this for initialization
    onLoad: function () {
         this.node.width = this.node.parent.width;

         this.top = this.node.parent.height/2;
         this.bottom= -this.top;

        this.web.on('error',function(event){},this);
        
        this.web.width = this.node.width;
        this.web.height = this.node.height-50;

        //this.web.getComponent(cc.WebView).url = this.weburl;       
      
    },

     Hide:function(){
       
       this.web.active = false;
       this.node.runAction( cc.sequence(cc.moveTo(0.5,0,this.bottom),
        cc.callFunc(function(){  this.node.active = false; },this )));
    },

  
    onEnable :function(){
       
        //this.title.active = true;

       this.node.y = -this.node.parent.height/2;

       this.node.runAction(  cc.sequence(cc.moveTo(0.5,0,this.top),
        cc.callFunc(function(){   this.web.active = true;  
                                this.web.getComponent(cc.WebView).url = this.weburl;  
        },this ))); 

      //this.web.getComponent(cc.WebView).url = this.weburl; //"http://www.163.com";
    },
});
