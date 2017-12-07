/*
Team Zombie Cat
Dead Cat Audio Manager - Sound Using Howler.js

Author: Kevin Helms
Last Updated 12/16/2017
*/

!function ($w, Howl) {

    //var SoundObj = null;
    var _sounds = null;

    function AudioManager() {
       _sounds = {};
    }

    AudioManager.prototype.loadSound = function(soundfile, looping)
    {
        _sounds[soundfile] = new Howl({  //create the sound from soundfile
            src: [soundfile],
            html5: true,
            loop: looping
        });
    }

    AudioManager.prototype.playSound = function(soundFile) {
        _sounds[soundFile].play();
    }


    AudioManager.prototype.destroy = function () {
        for(var key in _sounds)
        {
            _sounds[key].unload();
            _sounds[key] = null;
        }
    }

    $w._DeadCat_AudioManager = AudioManager;
}(this, Howl);