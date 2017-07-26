var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        nick:cc.EditBox,
        psw1:cc.EditBox,
        psw2:cc.EditBox,
        btnok:cc.Button,
        login:cc.Node,
        tip:cc.Node,
      
    },

    // use this for initialization
    onLoad: function () {

    },

    Btn_OK:function(){
       
      //   cc.log('----------');
     

      var nick = this.nick.string.trim();
      var psw1= this.psw1.string.trim();
       var psw2 =   this.psw2.string.trim();

         this.tip.action= true;
        this.tip.emit('settip',{type:2,msg:'信息不完整!'});

        if( nick =='' || psw1 =='' || psw2 =='' ){

            this.tip.active= true;
            this.tip.emit('settip',{type:2,msg:'信息不完整!'});
            return;
        }

         if( psw1 != psw2 ){

            this.tip.active= true;
            this.tip.emit('settip',{type:2,msg:'密码不一致!'});
            return;
        }


        var arg ="user_name="+nick;
        arg += "&user_pass="+psw1;        

        var self = this;
        var url ='http://'+global.socket.URL +'/client/user/register?';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;           
                var s = JSON.parse(response);            

                cc.log(s);
                if(cc.isValid(s.error)){
                     self.tip.active= true;
                     self.tip.emit('settip',{type:2,msg:s.msg});
                }else{
                     self.login.emit('createid',{nick:nick,pass:psw1});
                    self.Hide();
                }
                
                // self.node.emit('getauthcode',{code:s.data[0],server:s.data[1],
                //         nick:self._lastnick,
                //         pass:self._lastpass});   
            }
        };

        xhr.open("POST", url+arg, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send(arg);     
    }   
});
