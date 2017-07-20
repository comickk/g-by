cc.Class({
    extends: require("PopWin"),

    properties: {
        scrollview:cc.ScrollView,
        content:cc.Node,
        item:cc.Prefab,

        selectbg:cc.Prefab,
        _currbg:cc.Node,
      
        login:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('hide',this.Hide,this);   

         this.node.on('touchend',function(event){ 
             console.log('---'+event.target.name);
         },this);

         this.node.on('setcurr',function(event){
           // console.log('---'+event.target.name);
            if(this._currbg ==null){
                this._currbg = cc.instantiate(this.selectbg);
                this._currbg.parent = event.target;
                this._currbg.setSiblingIndex(0);
            }else{
                this._currbg.parent = event.target;
                this._currbg.setSiblingIndex(0);
            }
            event.stopPropagation();
         },this);

        var namelist = JSON.parse(cc.sys.localStorage.getItem('userData'));        
        
        // if(namelist==null){
        //     console.log('无法取得账号记录');
        //     return;
        // }
        if( namelist!=null && namelist.length >0 ){
          
            for(let n of namelist){
               this.AddItem(n.id,n.pass);
            }          
        }                         
    },
   
    //添加一个使用过的名字
    AddItem:function(nick,pass)
    {
        var i = cc.instantiate(this.item);
        i.parent = this.content;
        
        i.emit('setnick',{nick:nick,pass:pass});
    },

    Btn_Ok:function(){
       
        if(this._currbg!= null)
            this.login.emit('selectid');

         this.Hide();
    }
    // //删除一行记录
    // Btn_DelItem:function(){

    // },

    // //
    // Btn_Item:function(event){

    //     console.log(event.target.name);
    // },

});
