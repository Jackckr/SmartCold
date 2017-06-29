/*缩略图轮播*/
foucsbox(2500);
/*生成二维码*/
var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 88,
    height : 88
});

function makeCode () {
    var elText = document.URL;
    if (!elText) {
        alert("二维码生成失败……");
        return;
    }
    qrcode.makeCode(elText);
}
makeCode ();
/*生成二维码 end*/
