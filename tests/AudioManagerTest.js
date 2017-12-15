/*
Team Zombie Cat
Dead Cat AudioManagerTest.js

Author: Kevin Helms
Last Updated 12/11/2017
*/

var testAM;

beforeEach(function() {
    testAM = new _DeadCat_AudioManager();
    testAM.loadSound("test","C:\\Users\\kevin\\WebstormProjects\\ZombieCat\\audio\\sfx_cat_meow-reg.wav",true,1.0,1.0);
});

afterEach(function() {
    testAM.stopSound("test");
    testAM.destroy();
});

describe('Audio Manager' , function() {
    it('Plays a sound', function() {
        testAM.playSound("test");
        expect(testAM.isPlaying("test")).toBeTruthy();
    });

    it('Stops a sound', function() {
        testAM.playSound("test");
        testAM.stopSound("test");
        expect(testAM.isPlaying("test")).toBeFalsy();
    });

    it('Loads a sound', function() {
        expect(testAM.getState("test")).toMatch("loaded");
    });

    it('Unloads a sound', function() {
        testAM.unload();
        expect(testAM.getState("test")).toMatch("unloaded");
    });

});

