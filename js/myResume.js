(function () {
    function getEle(ele) {
        return document.querySelector(ele);
    }

    function getEles(ele) {
        return document.querySelectorAll(ele);
    }

    var loading = getEle("#loading");
    var winW = document.documentElement.clientWidth;
    var winH = document.documentElement.clientHeight;
    var desW = 707;
    var desH = 1000;
    if (winW / winH <= desW / desH) {
        loading.style.webkitTransform = "scale(" + winH / desH + ")";
    } else {
        loading.style.webkitTransform = "scale(" + winW / desW + ")";
    }

    var music = getEle("#music");
    var num = 0;
    var center = getEle("#center");
    var flag = -1;

    function isLoad() {
        var progress = getEle(".progress");
        var ary = ['automusic.png', 'bg.jpg', 'bg1.jpg', 'c1.png','c2.png','c3.png','c4.png','c5.png','c6.png','fire.jpg', 'myself1.jpg', 'page1_bg.png','page2_bg.png','page3_bg.png','page4_bg.jpg','page5_bg.jpg', 'round.png', 'round1.png', 'round2.png'];
        window.setTimeout(function () {
            for (var i = 0; i < ary.length; i++) {
                var oImg = new Image;
                oImg.src = "images/" + ary[i];
                oImg.onload = function () {
                    num++;
                    progress.style.width = num / ary.length * 100 + "%";
                    if (num === ary.length && loading) {
                        progress.addEventListener("webkitTransitionEnd", function () {
                            loading.style.opacity = 0;
                            window.setTimeout(function () {
                                center.removeChild(loading);
                                center = null;
                                music.play();
                                flag *= -1;
                            }, 1000);
                        }, false)
                    }
                }
            }
        }, 1500);
    }

    isLoad();

    var auto_btn = getEle(".auto_btn");
    auto_btn.addEventListener("click", onMusic, false);
    function onMusic() {
        if (flag === 1) {
            music.pause();
            auto_btn.style.webkitAnimation = "4s linear";
            flag *= -1;
        } else {
            music.play();
            flag *= -1;
            auto_btn.style.webkitAnimation = "move 4s linear infinite";
        }
    }

    var oLis = getEles("#list>li");

    [].forEach.call(oLis, function () {
        var oLi = arguments[0];
        oLi.index = arguments[1];
        oLi.addEventListener("touchstart", start, false);
        oLi.addEventListener("touchmove", move, false);
        oLi.addEventListener("touchend", end, false);

    });

    function start(e) {
        this.startTouch = e.changedTouches[0].pageY;
    }

    function move(e) {
        this.flag = true;
        var moveTouch = e.changedTouches[0].pageY;
        var pos = moveTouch - this.startTouch;
        var index = this.index;
        [].forEach.call(oLis, function () {
            if (arguments[1] != index) {
                arguments[0].style.display = "none";
            }
            arguments[0].className = "";
        });
        var duration = null;
        if (pos > 0) {
            this.prevSIndex = (index == 0 ? oLis.length - 1 : index - 1);
            duration = -winH + pos;
        } else if (pos) {
            this.prevSIndex = (index == oLis.length - 1 ? 0 : index + 1);
            duration = winH + pos;
        }
        oLis[this.prevSIndex].style.display = "block";
        oLis[this.prevSIndex].style.webkitTransform = "translate(0," + duration + "px)";
        oLis[this.prevSIndex].className = "zIndex";
        oLis[index].style.webkitTransform = "scale(" + (1 - Math.abs(pos) / winH / 2) + ") translate(0," + pos + "px)";
    }

    function end(e) {
        if (this.flag) {
            oLis[this.prevSIndex].style.webkitTransform = "translate(0,0)";
            oLis[this.prevSIndex].style.webkitTransition = "0.7s";
            oLis[this.prevSIndex].addEventListener("webkitTransitionEnd", function () {
                this.style.webkitTransition = "";
            }, false)
        }
    }


})();