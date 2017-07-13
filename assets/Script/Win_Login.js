cc.Class({
    extends: require("PopWin"),

    properties: {
        username:cc.EditBox,
        userpass:cc.EditBox,      

        login:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    Send:function(arg){

        var self = this;
        
         var url ="http://192.168.2.173/client/user/login?";
       var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                // console.log(response);
                var s = JSON.parse(response);
               // console.log(s)

                self.login.emit('getauthcode',{code:s.data[0],server:s.data[1],nick:self.username.string.trim(),pass:self.userpass.string.trim()});
            }
        };

        xhr.open("POST", url+arg, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send(arg);
    },

    Btn_OK:function(){      
        
        var arg ="user_name="+this.username.string.trim();
        arg += "&user_pass="+this.userpass.string.trim();        

        this.Send(arg);
    }
   
});
