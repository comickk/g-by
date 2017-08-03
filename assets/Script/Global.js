var Global = function(){  

    //  玩家数据类
    var myinfo = null;

    var myseat = 0;
    var myid =0;
    var backid =null;
    var mygunlv =1;    

    var roominfo = null;

    var volume =0.5;//音效音量
    var musicid = 0;//背景乐ID
    var musicvol =0.5;//背景乐音量
    
   
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
    var ui = null;//界面控制
    var game=null;//游戏主控
    var broad =null;//公告
    var ac = null;//音频


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
/**
 * 
pro.blast = function(bullet, fishes){
  var self = this;

  var result = [];

  for(let f of fishes){

    var fish = self._fishes[f];

    if(!fish) continue;

    logger.debug('blast 1: %j', fish);

    var bullet_info = cfg.bullet[bullet.level - 1];

    if(!bullet_info) continue;

    logger.debug('blast 2: %j', bullet_info);

    var trail_info = cfg.fishTrail[fish.path];

    if(!trail_info) continue;

    logger.debug('blast 3: %s', trail_info.length);

    var s = trail_info[fish.step];

    if(!s) continue;

    var d = distance(s[0], s[1], bullet.x2, bullet.y2);

    if(d > bullet_info.range) continue;

    logger.debug('blast 4: %s', d);

    if(!(--fish.hp < 1)){
      logger.debug('blast 5: %j', fish);
      continue;
    }

    var r = Math.random();

    if(!(r < cfg.fishType[fish.type].dead_probability)) continue;

    logger.debug('blast 6: %s', r);

    // 根据玩家的幸运值与盈亏比率在进行判断
    // 根据配置表生成特殊物品掉落率

    result.push({
      id:     fish.id 

,
      type:   fish.type,
      money:  cfg.fishType[fish.type].money * bullet.consume,
      tool_1: 0,
      tool_2: 0,
    });

    self.clearFish(fish);
  }

  logger.debug('dead fishes: %j', result);

  return result;
};

 */
