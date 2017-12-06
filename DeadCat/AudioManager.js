/*
Team Zombie Cat
Dead Cat Audio Manager - Sound Using Howler.js

Author: Kevin Helms
Last Updated 12/16/2017
*/

!function ($w) {

    var _self = null;
    //var SoundObj = null;

    function AudioManager(soundfile,looping) {
        _self = this;
       _self.SoundObj = new Howl({  //create the sound from soundfile
          src: [soundfile],
            html5: true,
           loop: looping
        });
    }

    AudioManager.prototype.PlaySound = function() {
        _self.SoundObj.play();
    };

    AudioManager.prototype.DestroySound = function() {
        //_self.SoundObj.stop();
        _self.SoundObj.unload();
        _self.SoundObj = null;
    };

    $w._DeadCat_AudioManager = AudioManager;
}(this);