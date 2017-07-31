var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {       
		labelnode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        global.broad = this.node;
    	this.node.on('settext',this.SetText,this);

        this.node.emit('settext',{text:'我是一个公告条，不要在意我，我只会时不时的发一些垃圾信息而已，快点开始捕你的鱼吧~~~~'});

      //  cc.game.addPersistRootNode(this.node);
    },	

    SetText:function(event){
        this.labelnode.getComponent("cc.RichText").string = event.detail.text;        
         this.node.runAction(cc.show());
       
        //this.scheduleOnce( function(dt) {  
            this.labelnode.runAction( cc.sequence( cc.moveBy(event.detail.text.length/3,-this.labelnode.width*2.2,0), 
            cc.callFunc(function() {
               this.node.runAction(cc.hide());
            }, this) ));
        //}, 2);
    }
});
