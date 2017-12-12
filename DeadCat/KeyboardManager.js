!function ($w) {

    var _kbm = null;
    KeyboardManager.prototype.keysPressed = null;

    function KeyboardManager() {
        _kbm = this;
        _kbm.keysPressed = [];
        _kbm.justPressed = [];
        _kbm._justPressed = [];
        $w.addEventListener("keyup", keyUp, false);
        $w.addEventListener("keydown", keyDown, false);
    }

    function keyUp(key) {
        _kbm.keysPressed[key.which] = false;
        _kbm.justPressed[key.which] = false;
        _kbm._justPressed[key.which] = false;

    }

    function keyDown(key) {
        _kbm.keysPressed[key.which] = true;
    }


    KeyboardManager.prototype.update = function()
    {
        for(var key in _kbm.keysPressed)
        {
            if(_kbm.keysPressed[key])
            {
                if(!_kbm._justPressed[key])
                {
                    _kbm.justPressed[key] = true;
                    _kbm._justPressed[key] = true;
                }
                else
                {
                    _kbm.justPressed[key] = false;
                }
            }
        }


    }




    $w._DeadCat_KeyboardManager = KeyboardManager;
}(this);