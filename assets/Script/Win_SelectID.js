cc.Class({
    extends: require("PopWin"),

    properties: {
        scrollview:cc.ScrollView,
        content:cc.Node,
        item:cc.Prefab,
      
    },

    // use this for initialization
    onLoad: function () {
            this.node.on('hide',this.Hide,this);   

            // this.node.on('touchend',function(event){ 
            //     console.log('---'+event.target.name);
            // },this);
                
    },
   
    //添加一个使用过的名字
    AddItem:function()
    {
        var i = cc.instantiate(this.item);
        i.parent = this.content;
    },

    // //删除一行记录
    // Btn_DelItem:function(){

    // },

    // //
    // Btn_Item:function(event){

    //     console.log(event.target.name);
    // },

});
