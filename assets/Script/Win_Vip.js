cc.Class({
    extends: require("PopWin"),

    properties: {
      view:cc.ScrollView,
      cont:cc.Node,
     // details:cc.Label,

      _currvip:0,

     // _text:[],
    },

    // use this for initialization
    onLoad: function () {
        // this.text =['1.获得专属"皇家守卫"炮台套装\n2.捕鱼成功率提高 2%\n3.礼券获得率提高 25%\n',
        //        '1.获得专属"赤色要塞"炮台套装\n2.捕鱼成功率提高 5%\n3.礼券获得率提高 50%\n',
        //        '1.获得专属"雷霆先锋"炮台套装\n2.捕鱼成功率提高 10%\n3.礼券获得率提高 100%\n',
        //        '1.获得专属"蔷薇幻影"炮台套装\n2.捕鱼成功率提高 15%\n3.礼券获得率提高 200%\n',
        //        '1.获得专属"龙之火焰"炮台套装\n2.捕鱼成功率提高 20%\n3.礼券获得率提高 500%\n',
        // ];
        
        var that  = this;
        this.cont.on('size-changed',function(){            
             var x = 179 * (that._currvip-1);
             if(x<0) x =0;
                that.view.scrollToOffset(cc.v2(x,0));  

           // that.cont.children[that._currvip-1].getChildByName('vipbg').active = true; 
            //this._currvip =0; 
        },this);

        this.node.on('showvip',function(event){
            this.OpenContent(event.detail.vip-0);
        },this)
    },
    OpenContent:function(vip){       

         if(this._currvip != vip){                        //展开一个详细页 

            if(this._currvip != 0){
                this.cont.children[this._currvip-1].width = 179;
                this.cont.children[this._currvip-1].getChildByName('vipbg').active = false;  

                var x = 179 * (vip-1);
                this.view.scrollToOffset(cc.v2(x,0));                  
            }

            this._currvip = vip;
            this.cont.children[vip-1].width =748;   
            this.cont.children[vip-1].getChildByName('vipbg').active = true;  
                         
        }else{//收起详细页
            this.cont.children[vip-1].width =179;                      
            this.cont.children[this._currvip-1].getChildByName('vipbg').active = false;     

            this._currvip =0;   
        }     
    },

    Btn_content:function(event, customEventData){

        var vip = 0;
       
        switch( customEventData){
            case 'vip1':
                vip = 1;            
            break;         
            case 'vip2':
                vip =2;
            break;
            case 'vip3':
                vip =3;
            break;
            case 'vip4':
                vip =4;
            break;
            case 'vip5':
                vip =5;
            break;
        }

        this.OpenContent(vip);
    }
});
