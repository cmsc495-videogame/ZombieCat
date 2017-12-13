/*
Team Zombie Cat
Dead Cat Audio Manager - Sound Using Howler.js

Authors: William Kendall, John Sakosky, Kevin Helms, Vladimir Roman, Benjamin Sheren
Last Updated 12/16/2017
*/

!function ($w, Howl) {

    //var SoundObj = null;
    var _sounds = null;

    function AudioManager() {
       _sounds = {};
    }

    AudioManager.prototype.loadSound = function(name, soundfile, looping, s_vol, s_rate)
    {
        if(!looping) //just if someone forgot to add it to the map file
            looping = false;

        _sounds[name] = new Howl({  //create the sound from soundfile
            src: [soundfile],
            html5: true,
            loop: looping,
            volume: s_vol,
            rate: s_rate
        });
    }

    AudioManager.prototype.pauseSound = function(soundFile) {
        _sounds[soundFile].pause();
    }
    AudioManager.prototype.playSound = function(soundFile) {
        if(_sounds[soundFile])
            _sounds[soundFile].play();
    }
    AudioManager.prototype.resumeSound = function(soundFile) {
        if(!_sounds[soundFile].playing())
            _sounds[soundFile].play();
    }
    AudioManager.prototype.stopSound = function(soundFile) {
        _sounds[soundFile].stop();
    }
    AudioManager.prototype.toggleSound = function(soundFile) {
        if(_sounds[soundFile].playing())
            _sounds[soundFile].pause();
        else
            _sounds[soundFile].play();
    }



        AudioManager.prototype.destroy = function () {
        for(var key in _sounds)
        {
            _sounds[key].unload();
            _sounds[key] = null;
        }
        _sounds = null;
    }

    $w._DeadCat_AudioManager = AudioManager;
}(this, Howl);