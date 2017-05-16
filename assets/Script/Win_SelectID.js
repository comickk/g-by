cc.Class({
    extends: require("PopWin"),

    properties: {
        scrollview:cc.ScrollView,
        item:cc.Node,
      
    },

    // use this for initialization
    onLoad: function () {
            this.node.on('hide',this.Hide,this);   

            this.node.on('touchend',function(event){ 
                console.log('---'+event.target.name);
            },this);
                
    },
   
    AddItem:function()
    {
        var i = cc.instantiate(this.item);
        i.parent = this.item.parent;
    },

    Btn_Item:function(event){

        console.log(event.target.name);
    },

});
