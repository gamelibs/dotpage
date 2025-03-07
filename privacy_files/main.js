
$(document).ready(function() {
    if ( $("img.lazy").length) {
        new LazyLoad({})
    };
});
// fastclick
window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

if ($('.top_lea').length>0){
    document.addEventListener('scroll',function(){
        var scrollTop=document.documentElement.scrollTop;
        if(scrollTop>200){
            $('.top_lea').css('display','flex')
        }
        else{
            $('.top_lea').css('display','none')
        }
    });
    $('.top_lea').click(function () {
        document.documentElement.scrollTop="0px";
    })
}
