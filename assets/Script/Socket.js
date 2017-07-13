var emag = require('emag');   
function gamesocket(){
    //extends: cc.Component,


}
   gamesocket.prototype.ws=null;
   gamesocket.prototype.msglist=[];

   gamesocket.prototype.Init = function( server,code  ){
        var self =this;
        this.ws = new WebSocket('ws://192.168.2.173/s/'+server+'/');
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function(evt){

           // this.ws.send(req.serializeBinary());

                 // first
            var p = {
                version: 102,
                seqId: Math.random() * 1000,
                timestamp: new Date().getTime(),
                data: JSON.stringify({
                    code: code
                })
            };
           this.send(JSON.stringify(p));

           // console.log(this.ws);
        };

        this.ws.onmessage = function(evt)
        {
            var data = evt.data;
            var type = typeof data;

            data = JSON.parse(data);

          //  console.log(data);

        //     var data = evt.data;
        //     var type = typeof data;

            
        //    // console.log(data) 

        //     var result = proto.gws.ResponseProtobuf.deserializeBinary(data);
        //     //console.log(result.getVersion())
           
        //     var _user = proto.gws.model.UserProtobuf;
        //     self.msglist.push( _user.deserializeBinary(result.getData()) );  
         self.msglist.push( data);           
        };

        this.ws.onclose = function(evt){
            console.log('client notified socket has closed.', evt);
        };     

        return this;  
    }

    // gamesocket.prototype.Send = function(){

    // }

    gamesocket.prototype.Close = function(){
        //console.log('--清空消息队列--');
           this.msglist.splice(0,this.msglist.length);
    }

    gamesocket.prototype.ClearMsg = function(){
            this.ws.close();
    }

var gs = new gamesocket();  
module.exports =gs;
//module.exports =gs.Init();
