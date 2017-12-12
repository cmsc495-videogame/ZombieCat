!function ($w) {

    var _kbm = null;
    KeyboardManager.prototype.keysPressed = null;

    function KeyboardManager() {
        _kbm = this;
        _kbm.keysPressed = [];
        $w.addEventListener("keyup", keyUp, false);
        $w.addEventListener("keydown", keyDown, false);
    }

    function keyUp(key) {
        _kbm.keysPressed[key.which] = false;
    }

    function keyDown(key) {
        _kbm.keysPressed[key.which] = true;
    }

    KeyboardManager.prototype.keyClicked = function(key) {
        if(_kbm.keysPressed[key]){
            _kbm.keysPressed[key]=false;
            return true;
        }
        return false;
    }

    $w._DeadCat_KeyboardManager = KeyboardManager;
}(this);