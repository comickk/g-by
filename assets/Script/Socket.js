var emag = require('emag');   
function gamesocket(){
    //extends: cc.Component,


}
   gamesocket.prototype.ws=null;
   gamesocket.prototype.msglist=[];

   gamesocket.prototype.Init = function(){
        var self =this;
        this.ws = new WebSocket('ws://118.190.89.153/s/68/');
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function(evt){
           // this.ws.send(req.serializeBinary());
        };

        this.ws.onmessage = function(evt)
        {
            var data = evt.data;
            var type = typeof data;

            
           // console.log(data) 

            var result = proto.gws.ResponseProtobuf.deserializeBinary(data);
            //console.log(result.getVersion())
           
            var _user = proto.gws.model.UserProtobuf;
            self.msglist.push( _user.deserializeBinary(result.getData()) );             
        };

        this.ws.onclose = function(evt){
            console.log('client notified socket has closed.', evt);
        };     

        return this;  
    }

    gamesocket.prototype.Close = function(){
        //console.log('--清空消息队列--');
           this.msglist.splice(0,this.msglist.length);
    }

    gamesocket.prototype.ClearMsg = function(){
            this.ws.close();
    }

var gs = new gamesocket();  
module.exports =gs.Init();
