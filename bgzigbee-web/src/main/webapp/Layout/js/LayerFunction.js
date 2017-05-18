document.write("<script language=\"javascript\" src=\"js/layer/layer.min.js\"></script>")

function Tips(ncontent, htmlname) {
    layer.tips(ncontent,
     $("#" + htmlname),
     {
         guide: 1,
         style: ['background-color:#e86125; color:#fff', '#e86125']
     });
}

function TipsRight(ncontent, htmlname) {
    layer.tips(ncontent,
     $("#" + htmlname),
     {
         guide: 1,
         style: ['background-color:#23bc3d; color:#fff', '#23bc3d']
     });
}
