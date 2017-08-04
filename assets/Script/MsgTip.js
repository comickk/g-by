cc.Class({
    extends: cc.Component,

    properties: {
        msg:cc.Label,

    },
    
    onLoad: function () {
         this.node.width = this.msg.string.length*24+60;

        this.node.on('settip',function(event){
            this.msg.string = event.detail.msg;
            this.node.width = this.msg.string.length*24+60;
        },this);        
    },

    
    onEnable:function(){
        this.node.width = this.msg.string.length*24+60;
       // cc.log(this.node.width+'----------2');
    }
});
