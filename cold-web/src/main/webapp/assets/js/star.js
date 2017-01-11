//兼容requestAnimFrame
window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ) {
                    window.setTimeout( callback, 1000 / 60 );
                };
})();
//背景绘制函数
 function drawBg(cvs)
  {
    cvs.beginPath();
    cvs.fillStyle="#020215";
    cvs.fillRect(0,0,wW,wH);
    cvs.save();
  }
//随机数0-255（rgb）
function ran255(){
    return Math.round(Math.random()*255);
}
//随机颜色构造函数
function Color(){
    this.r=ran255();
    this.g=ran255();
    this.b=ran255();
    this.rgb="rgba("+this.r+","+this.g+","+this.b+",1)";
}
window.onload=function()
{
  var can=document.getElementById("mycanvas");
  can.width=wW=window.innerWidth;
  can.height=wH=window.innerHeight;      
  var cvs=can.getContext("2d");
  //绘制背景     
  drawBg(cvs);
  //创建粒子配置（总体）,静态类
  var Dots=
  {
    n:300,
    minDis:50,
    d_mouse:100,
    array:[],
    radiusArr:[]
  }
  //每个粒子的配置
  function Dot()
  {
    this.color = new Color();//创建随机颜色
    //圆心坐标
    this.x = Math.round(Math.random()*wW);
    this.y = Math.round(Math.random()*wH);
    //速度(不同方向)
    this.vx = (Math.random()-0.5)*3;
    this.vy = (Math.random()-0.5)*3;
    //随机半径
    this.radius = Math.round(Math.random()*5);
  }
  //初始化
  Dot.prototype.draw = function() {
    cvs.beginPath();
    cvs.fillStyle = this.color.rgb;
    cvs.arc(this.x,this.y,this.radius,0,360,false);
    cvs.fill();
  };
  //创建粒子并放入数组
  for(var i=0;i<Dots.n;i++)
  {
    var dotObj = new Dot();
    Dots.array.push(dotObj);
    Dots.radiusArr.push(dotObj.radius);
  }

  //画出粒子
  function drawDots()
  {
    drawBg(cvs);
    for(var i=0;i<Dots.n;i++)
      {
        Dots.array[i].draw();
      }
  }
  drawDots();
  //移动粒子
  function moveDots(){          
    for(var i=0;i<Dots.n;i++)
      {
        var dot = Dots.array[i];
        //反弹判断
        if(dot.x <0 || dot.x>wW)
            {
                dot.vx=-dot.vx;
            }
        if(dot.y <0 || dot.y>wH)
            {
                dot.vy=-dot.vy;
            }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
  }
 //混合颜色

 //连线
 function connect()
 {
     function mixColor(dot1,dot2)
     {
        var color1=dot1.color;
        var color2=dot2.color;
        var r1=dot1.radius;
        var r2=dot2.radius;
        var r=Math.floor((color1.r*r1+color2.r*r2)/(r1+r2));
        var g=Math.floor((color1.g*r1+color2.g*r2)/(r1+r2));
        var b=Math.floor((color1.b*r1+color2.b*r2)/(r1+r2));
        return "rgba("+r+","+g+","+b+",1)"
     }
    for(var i=0;i<Dots.n;i++)
    {           
        for(var j=0;j<Dots.n;j++)
        {
            var dot1 = Dots.array[i];
            var dot2 = Dots.array[j];
            var color=mixColor(dot1,dot2);
            if(Math.abs(dot1.x-dot2.x)<Dots.minDis && Math.abs(dot1.y-dot2.y)<Dots.minDis)
            {
                cvs.lineWidth=0.2;
                cvs.beginPath();
                cvs.strokeStyle=color;
                cvs.moveTo(dot1.x,dot1.y);
                cvs.lineTo(dot2.x,dot2.y);
                cvs.stroke();
            }
        }
    }
 }
 can.onmousemove=function(ev)
 {
    var ev=window.event || ev;
    var pX=ev.pageX;
    var pY=ev.pageY;        
    for(var i=0;i<Dots.n;i++)
    {  
        
        if(Math.abs(Dots.array[i].x-pX)<Dots.d_mouse && Math.abs(Dots.array[i].y-pY)<Dots.d_mouse)
        {
            var r=Dots.radiusArr[i]*3;
            Dots.array[i].radius=r;
        }
        else{
            Dots.array[i].radius=Dots.radiusArr[i];
        }
     }

 }
 //无限运动
 function infinateDot()
 {
    cvs.clearRect(0,0,wW,wH);
    moveDots();
    drawDots();
    connect();
    requestAnimationFrame(infinateDot)
 }
 infinateDot();
}