/*
Team Zombie Cat
Dead Cat KeyboardManagerTest.js

Author: Kevin Helms
Last Updated 12/15/2017
*/

var testKBM;

beforeEach(function() {
    testKBM = new _DeadCat_KeyboardManager();
});

afterEach(function() {
    testKBM.unload();
});
describe('Keyboard Manager', function() {
    it('gets up key input', function() {
        while (testKBM.keysPressed[87] == false) {

        }
        expect(testKBM.keysPressed[87]).toBeTruthy();
    });

    it('gets down key input', function() {
        while (testKBM.keysPressed[83] == false) {

        }
        expect(testKBM.keysPressed[83]).toBeTruthy();
    });

    it('gets left key input', function() {
        while (testKBM.keysPressed[65] == false) {

        }
        expect(testKBM.keysPressed[65]).toBeTruthy();
    });

    it('gets right key input', function() {
        while (testKBM.keysPressed[68] == false) {

        }
        expect(testKBM.keysPressed[86]).toBeTruthy();
    });

    it('gets space key input', function() {
        while (testKBM.keysPressed[32] == false) {

        }
        expect(testKBM.keysPressed[32]).toBeTruthy();
    });
});