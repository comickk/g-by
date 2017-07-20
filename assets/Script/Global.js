var Global = function(){  

    //  玩家数据类
    var myinfo = null;

    var myseat = 0;
    var myid =0;
    var backid =null;
    var mygunlv =1;    
    
   
    // get GameController(){
    //     return this.game;
    // }; 
    // set GameController(value){
    //     game = value;
    // };

    //全局通用类    -----------------
    var socket = null;
    var anysdk =null;


    //场景管理类-------------------
    var ui = null;
    var game=null;


    //对象池类------------------
    var pool_bullet = null;
    var pool_net = null
    var pool_coin = null;

   // var guns = [1,2,3,4,5];

   // this.test = function(){
   //     console.log('~~~~~~~~~~~'+guns[0]+'   '+guns[3]);}
   
    var test =0; 
};
module.exports = new Global();
