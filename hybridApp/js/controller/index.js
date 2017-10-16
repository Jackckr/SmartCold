var smartCold = "http://www.smartcold.org.cn/";
var user = {
	"id": 1,
	"roleid": 3,
	"type": 0,
	"email": "110@qq.com",
	"nickname": "老乡鸡",
	"username": "lxj",
	"telephone": "17317582222",
	"realname": "undefined",
	"sex": 0,
	"addressid": 1,
	"address": "北京",
	"hometownid": 34,
	"hometown": "台湾",
	"UpdateTime": "Oct 11, 2017 4:33:41 PM",
	"avatar": "http://139.196.189.93:8089/sharepicture/share/1/share1_1505292165220.jpg",
	"vipType": 2
};

//时间格式化
 var formatTime = function(timeString) {
    if (typeof (timeString) == "string") {
        return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "");
    } else {
        return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "");
    }
};
 function formatTimeToMinute(timeString) {
    return formatTime(timeString).substring(0, 16);
}