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

    $w._DeadCat_KeyboardManager = KeyboardManager;
}(this);