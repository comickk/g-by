var FishMath = function(){	
	var fishpath = null;

	this.GetAngle=function(px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角     
     
        var x = Math.abs(px-mx);
        var y = Math.abs(py-my);
        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度
		
		//console.log('----angle =' + angle);
		
		//下方炮台-----------------
        if(mx>px && my>py){//鼠标在右上 //0  ~ -90
            angle =  angle-90;
        }		
		if(mx<px && my>py){//鼠标左上//  -90 ~ +-180
            angle = -(90+angle);
        }				
		//上方炮台-------------------       
		 if(mx > px && my<py){//鼠标在右下  0 ~ 90
            angle = 90- angle;
        }		
		 if(mx<px && my<py){//鼠标在左下  +-180 ~ 90
            angle = 90+angle;
		}
		
		/*/--------------
        if(mx>px && my==py){//鼠标在x轴正方向上
            angle = 0;
        }
        if(mx<px && my==py){//鼠标在x轴负方向
            angle = 180;
        }		
		if(mx==px && my>py){//鼠标在y轴负方向上
            angle = 90;
        }
		if(mx==px && my<py){//鼠标在y轴负方向上
            angle = -90;
        }	*/	
        return angle;
    },
	
	//得到发射时子弹在画布边界的目标点
	this.GetFirePos = function(r,sx,sy,cw,ch){	
		
		//console.log('---r= '+r);
		var max_x = 0;
		var max_y = 0;
		var pos=[0,0,0];
		var tan=0;		
		var absr = Math.abs(r);
		tan  =Math.tan( -r * Math.PI/180);
		
		if(absr >90)max_x = -cw - sx;
		else		max_x = cw -sx;
	
		
		if(r > 0) max_y = -ch - sy;
		else 	  max_y = ch -sy;
			
		pos[0]= max_x;
		pos[1] = tan*pos[0];//对边长度		
		
			
		if( Math.abs(pos[1])> Math.abs(max_y)){
			pos[0] = max_y/pos[1] * pos[0];
			pos[1] = max_y;
		}	
		
		pos[2] = Math.sqrt(Math.pow(pos[0],2)+Math.pow(pos[1],2));
		pos[0] +=sx;
		pos[1] +=sy; 		
		
		return pos;				
	},
	
	this.ReBound = function(r,x,y,cw,ch){
	
		//console.log('1----r =' + r+'----x =' + x+'----y =' + y+'----w =' + cw+'----ch =' + ch);
		
		var w=0;
		var h=0;
		
		if(y >= ch-10){//顶部接触向下反弹
			r = -r;
			if( r > 90) {//向左 (90) 右反弹		(90~180)		
				w = -cw-x;	
				h = -Math.tan(r*(Math.PI/180))*w;
			}else{ 				 //(0 ~ 90)
				w = cw  -x;		
				h = -Math.tan(r*(Math.PI/180))*w;
			}		
			if( Math.abs(h) > ch*2)	{
				w = ch*2/Math.abs(h)*w;		
				h = -2*ch;
			}
		} else
		
		if(y <= -ch+10){//底部接触向上反弹
			r = -r;
			if( r < -90) {//向左 (90) 右反弹				
				w = -cw-x;	
				h = Math.tan(-r*(Math.PI/180))*w;
			}else{ 				
				w = cw  -x;		
				h = Math.tan(-r*(Math.PI/180))*w;
			}	
			if( Math.abs(h) > ch*2)	{
				w = ch*2/Math.abs(h)*w;	
				h = 2*ch;
			}
		} else
		
		if( x >= cw-10)	{ //右部接触，向左反弹
			if(r >0)	{ //向左下
				r =180-r;
				h = -ch-y;
				w = Math.tan((r-90)*(Math.PI/180))*h;
			}else{ //向左上
				r= -180 -r;
				h = ch-y;
				w = Math.tan((r+90)*(Math.PI/180))*h;
			}
			if( Math.abs(w) > cw*2)	{
				h = cw*2/Math.abs(w)*h;	
				w = -2*cw;
			}
		} else
		
		if( x <= -cw+10)	{ //左部接触，向右反弹
			if(r >0)	{ //向右下  ( 0~90)
				r =180-r;
				h = -ch-y;
				w = -Math.tan((90-r)*(Math.PI/180))*h;
			}else{ //向右上 ( 0~ -90)
				r= -180 -r;
				h = ch-y;
				w = Math.tan((r+90)*(Math.PI/180))*h;
			}
			if( w > cw*2)	{
				h = cw*2/w*h;	
				w = 2*cw;
			}
		}		
		
		var d = Math.sqrt(Math.pow(w,2)+Math.pow(h,2));						
		
		//console.log('----r =' + r+'----x =' + (x+w)+'----y =' + (y+h));
		//console.log('----------------------------------------');
		return [r,x+w,y+h,d];
		
	}

};
module.exports = new FishMath();