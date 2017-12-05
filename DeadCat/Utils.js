/*
Team Zombie Cat
Dead Cat Game Engine - helper functions

Author: William Kendall
*/


!function ($w) {

    function Utils() {
    }

    Utils.prototype.loadJSON = function (fileName, callback) {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callback(JSON.parse(xhttp.responseText));
            }
        };

        xhttp.overrideMimeType("text/plain; charset=x-user-defined");
        xhttp.open("GET", fileName, true);
        xhttp.send();
    };


    Utils.prototype.extend = function (obj, src) {
        if(obj == null) return src;
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }


    //export module
    $w.Utils = Utils;
}(this);