cc.Class({
    extends: cc.Component,

    properties: {       
		labelnode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    	this.node.on('settext',this.SetText,this);

        this.node.emit('settext',{text:'11111111111111111111111111111111111111111111111111111'});

        cc.game.addPersistRootNode(this.node);
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
