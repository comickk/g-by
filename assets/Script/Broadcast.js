var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {       
        labelnode:cc.Node,
        _msg:[],
        _show:false,
    },

    // use this for initialization
    onLoad: function () {

        global.broad = this.node;
        this.node.on('settext',this.SetText,this);
        // this.node.on('show',this.ShowBroad,this);
        // this.node.on('showend',function(){
        //      if(this._msg.length >0 )
        //             this.node.emit('show',{text:this._msg.shift()});        
        //         else{
        //             this.node.runAction(cc.hide());  
        //             this.labelnode.x=this.node.width/2;
        //             this._show = false; 
        //         }
        // },this);


        this.node.emit('settext',{text:'欢迎来到老猫捕鱼'});       
      //  cc.game.addPersistRootNode(this.node);

      this.ShowBroad();
      this.schedule( this.ShowBroad,5);
       
    },	

    SetText:function(event){                
         this._msg.push(event.detail.text);                
    },

    ShowBroad:function(){        
        if(this._show) return;
        if(this._msg.length <1 ){
            this.node.runAction(cc.hide());  
            return ;
        }

        var text = this._msg.shift();

         var rt =this.labelnode.getComponent(cc.RichText);
          //var rt =this.labelnode.getComponent(cc.labelnode);         
          if(!cc.isValid(rt)) return;   
          this._show = true;           
         
          this.node.runAction(cc.show());
            
            var width = this.node.width + text.length*30;
            this.labelnode.runAction( cc.sequence(  cc.callFunc(function() {
                                                         rt.string = text;                               
                                                    }, this),//设置 消息

                                                    cc.moveBy(width/90, -width , 0), //执行滚屏动作

                                                    cc.callFunc(function() {                                                       
                                                        this._show = false;   
                                                         this.labelnode.x=this.node.width/2;                                                                                                         
                                                    }, this) ));        //动作结束
    },
});
