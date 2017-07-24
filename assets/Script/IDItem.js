cc.Class({
    extends: cc.Component,

    properties: {
    //    bg:cc.Node,
     // selectwin:cc.Node,
      userID:cc.Label,
      _pass:'',
    },

    // use this for initialization
    onLoad: function () {
      this.node.on('setnick',function(event){
        this.userID.string = event.detail.nick;
        this._pass = event.detail.pass;
      },this);
    },

    Btn_Click:function(){

       this.node.dispatchEvent( new cc.Event.EventCustom('setcurr',true) );
        cc.find('LoginController').emit('setlastnick',{nick:this.userID.string,pass:this._pass});
    },   

    DelItem:function(){

        var namelist = JSON.parse(cc.sys.localStorage.getItem('userData'));

        if(namelist.length >0 ){
          
            var i=0;
            //for(let n of namelist){
            for( i=0;i<namelist.length;i++){
                let n = namelist[i];
                if(n.id == this.userID.string){                    
                   // i++;
                    break;
                }
            }     
            var lastnick = cc.sys.localStorage.getItem('usernick');
            if(lastnick == namelist[i].id){
                namelist.splice(i,1);     
                if(namelist.length >0){
                    cc.sys.localStorage.setItem('usernick', namelist[0].id);
                    cc.sys.localStorage.setItem('userpass', namelist[0].pass);
                }
            }
            else
                namelist.splice(i,1);     
        }      
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
