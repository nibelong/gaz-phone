// Скрипт для обработки стандартных диалоговых окон
// - MessageBox - выводит в окне информационные сообщения
// - Ask - запрашивает от пользователя подтверждение Ok/Cancel
// Для кнопок Ok, Cancel могут задаваться callbacks

function AbstractDialogBox(pageName, bgName, center) {
  var that = this;
  this.okCallback = null;
  this.cancelCallback = null;
  this.getResult = null;
  this.alignCenter = center;
  this.pageName = pageName;
  this.bgName = bgName;
  this.lifeTime = null;
  this.isInitialized = false;

  this.messageItems = {};

  this.popup = IR.GetItem(pageName);

  if (!this.popup) { return; }

  this.okButton = that.popup.GetItem('Ok_Button');
  this.cancelButton = that.popup.GetItem('Cancel_button');

  that.hideKeyboard = function() {
    IR.ShowKeyboard(false);
  };

  that.showKeyboard = function() {
    IR.ShowKeyboard(true);
  };

  this.setLifetime = function(lifetime, once) {
    if (this.popup && IR.SetLifeTime) {
      if (once) {
        setTimeout(function() {
          var oldLifeTime = that.lifeTime || AbstractDialogBox.lifeTime;
          IR.SetLifeTime(that.pageName, oldLifeTime);
          IR.SetLifeTime(that.bgName, oldLifeTime);
        }, lifetime);
      } else {
        this.lifeTime = lifetime;
      }
      IR.SetLifeTime(that.bgName, lifetime);
      IR.SetLifeTime(this.pageName, lifetime);
    }

    return this;
  };

  this.initialize = function() {
    function centerIt(item) {
      if (!item) { throw Error('Must not be undefined'); }
      var pageWidth = IR.CurrentPage.Width;
      var pageHeight = IR.CurrentPage.Height;

      var box = item.GetItem('box');
      if (!box) { return; }

      var dX = (pageWidth - box.Width) / 2 - box.X;
      var dY = (pageHeight - box.Height) / 2 - box.Y;

      for (var i = 0; i < item.ItemsCount; i++) {
        box = item.GetItem(i);
        box.X += dX;
        box.Y += dY;
      }
    }

    function resizePopup(item) {
      item.X = 0;
      item.Y = 0;
      item.Width = IR.CurrentPage.Width;
      item.Height = IR.CurrentPage.Height;
    }

    if (that.okButton) {
      IR.AddListener(IR.EVENT_ITEM_RELEASE, that.okButton, that.onOkButtonPress, that);
    }
    if (that.cancelButton) {
      IR.AddListener(IR.EVENT_ITEM_RELEASE, that.cancelButton, that.onCancelButtonPress, that);
    }

    // TODO: not sure if resize works properly
    resizePopup(that.popup);

    if (that.alignCenter) {
      centerIt(that.popup);
    }
  };

  this.initLang = function() {
    if (typeof I18n === 'undefined') {
      return;
    }

    function setText(item, text) {
      if (!item) {
        return;
      }

      var stateCount = item.StatesCount;
      for (var i = 0; i < stateCount; i++) {
        var state = item.GetState(i);
        if (state) {
          state.Text = text;
        }
      }
    }

    setText(this.okButton, 'Ok');
    setText(this.cancelButton, 'Отмена');
  };

  this.setIcon = function(icon) {
    var iconItem = that.popup.GetItem('Icon');
    if (iconItem) {
      iconItem.GetState(0).Image = icon;
    }

    return this;
  };

  this.show = function(message, location, partName, okCb, cancelCb) {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.initialize();
      this.initLang();
    }

    if (!that.popup) {
      return new Error('Page/popup not found: ' + that.pageName);
    }

    if (AbstractDialogBox.lifeTime && !this.lifeTime) {
      this.setLifetime(AbstractDialogBox.lifeTime);
    }

    this.setMessage(message);
    this.setLocation(location);
    this.setPartName(partName);

    for (var name in this.messageItems) {
      var item = this.messageItems[name];
      if (item) {
        item.Text = '';
      }
    }

    that.okCallback = okCb;
    that.cancelCallback = cancelCb;
    IR.ShowPopup(that.bgName);
    IR.ShowPopup(that.pageName);
  };

  this.setMessage = function(message) {
    var item = that.popup.GetItem('Message');
    if (item) {
      item.Text = message || '';
    }
  };

  this.setLocation = function(location) {
    var item = that.popup.GetItem('Location');
    if (item) {
      item.Text = location || '';
    }
  }

  this.setPartName = function(partName) {
    var item = that.popup.GetItem('PartName');
    if (item) {
      item.Text = partName || '';
    }
  }

  this.onCancelButtonPress = function() {
    var that = this;
    that.hideKeyboard();
    if (that.cancelCallback) {
      that.cancelCallback();
    }
    IR.HidePopup(that.pageName);
  };

  this.onOkButtonPress = function() {
    var that = this;
    that.hideKeyboard();
    var res = that.okCallback ? that.okCallback(that.getResult ? that.getResult() : null) : false;

    if (res) {
      if (res.item) {
        var item = that.popup.GetItem(res.item);
        if (item) {
          this.messageItems[res.item] = item;
          item.Text = res.message;
        }
      }
    } else {
      IR.HidePopup(that.bgName);
      IR.HidePopup(that.pageName);
    }
  };

  // that.Initialize();
}

function MessageDialogBox(pageName, bgName, center) {
  AbstractDialogBox.call(this, pageName, bgName, center);
  // var that = this;
}

function EditDialogBox(pageName, bgName, center) {
  AbstractDialogBox.call(this, pageName, bgName, center);
  var that = this;

  if (!that.popup) {
    return;
  }

  this.editBox = that.popup.GetItem('Edit');

  function onClearText() {
    that.editBox.Text = '';
  }

  IR.AddListener(IR.EVENT_ITEM_PRESS, that.editBox, that.showKeyboard, that);
  // IR.AddListener(IR.EVENT_ITEM_LOST_FOCUS, that.editBox, that.hideKeyboard, that);
  IR.AddListener(IR.EVENT_ITEM_RELEASE, that.popup.GetItem('ClearText'), onClearText);

  this.setDefaultValue = function(defValue) {
    that.editBox.Text = defValue;
    return this;
  };

  this.setPasswordMode = function(mode) {
    this.editBox.PasswordChar = mode ? '\u2022' : '';
    return this;
  };

  this.getResult = function() {
    return { text: that.editBox ? that.editBox.Text : null };
  };
}

function AskPasswordDialogBox(pageName, bgName, center) {
  AbstractDialogBox.call(this, pageName, bgName, center);
  var that = this;

  if (!that.popup) { return; }

  this.passEdit = that.popup.GetItem('Password');

  if (that.passEdit) {
    that.passEdit.PasswordChar = '\u2022';
  }

  function onPopupShow() {
    if (that.passEdit) {
      that.passEdit.Text = '';
    }
  }

  IR.AddListener(IR.EVENT_ITEM_PRESS, that.passEdit, that.showKeyboard, that);
  // IR.AddListener(IR.EVENT_ITEM_LOST_FOCUS, that.passEdit, that.hideKeyboard, that);

  IR.AddListener(IR.EVENT_ITEM_SHOW, that.popup, onPopupShow);

  this.getResult = function() {
    return { password: that.passEdit ? that.passEdit.Text : null };
  };
}

function AskNewPasswordDialogBox(pageName, bgName, center) {
  AbstractDialogBox.call(this, pageName, bgName, center);
  var that = this;

  if (!that.popup) { return; }

  this.passEdit = that.popup.GetItem('Password');
  this.passEdit2 = that.popup.GetItem('PasswordRepeat');

  if (that.passEdit) {
    that.passEdit.PasswordChar = '\u2022';
  }
  if (that.passEdit2) {
    that.passEdit2.PasswordChar = '\u2022';
  }

  function onPopupShow() {
    if (that.passEdit) {
      that.passEdit.Text = '';
    }
    if (that.passEdit2) {
      that.passEdit2.Text = '';
    }
  }

  IR.AddListener(IR.EVENT_ITEM_PRESS, that.passEdit, that.showKeyboard, that);
  // IR.AddListener(IR.EVENT_ITEM_LOST_FOCUS, edit_item, that.hideKeyboard, that);
  IR.AddListener(IR.EVENT_ITEM_PRESS, that.passEdit2, that.showKeyboard, that);
  // IR.AddListener(IR.EVENT_ITEM_LOST_FOCUS, edit_item2, that.hideKeyboard, that);
  IR.AddListener(IR.EVENT_ITEM_SHOW, that.popup, onPopupShow);

  this.getResult = function() {
    return {
      password: that.passEdit ? that.passEdit.Text : null,
      password_repeat: that.passEdit2 ? that.passEdit2.Text : null
    };
  };
}

function AskPinDialogBox(pageName, bgName, center) {
  AbstractDialogBox.call(this, pageName, bgName, center);
  var that = this;
  if (!that.popup) return;

  this.passEdit = that.popup.GetItem('Password');
  if (that.passEdit) that.passEdit.PasswordChar = '\u2022';

  function onClearText() {
    if (that.passEdit) that.passEdit.Text = '';
  }
  function onPopupShow() {
    if (that.passEdit) that.passEdit.Text = '';
  }

  IR.AddListener(IR.EVENT_ITEM_RELEASE, that.popup.GetItem('ClearText'), onClearText);
  IR.AddListener(IR.EVENT_ITEM_SHOW, that.popup, onPopupShow);

  this.getResult = function() {
    return { password: that.passEdit ? that.passEdit.Text : null };
  };

  this.clearError = function() {
    var item = this.popup.GetItem('Error');
    if (item) {
      item.Text = '';
    }
  };

  /**
   * @this
   */
  function onKeyRelease() {
    if (that.passEdit) {
      var text = that.passEdit.Text;
      text += this.key;
      that.passEdit.Text = text;
    }
  }

  for (var i = 0; i < 10; i++) {
    var item = this.popup.GetItem('Key ' + i);
    if (item) {
      IR.AddListener(IR.EVENT_ITEM_RELEASE, item, onKeyRelease, { key: i });
    }
  }

  function onBackSpaceRelease() {
    if (that.passEdit) {
      var text = that.passEdit.Text;
      if (text.length) {
        text = text.slice(0, -1);
        that.passEdit.Text = text;
      }
    }
  }

  IR.AddListener(IR.EVENT_ITEM_RELEASE, this.popup.GetItem('KeyBackspace'), onBackSpaceRelease);
}

// eslint-disable-next-line no-unused-vars
function SetStdDialogLifetime(lifetime) {
  AbstractDialogBox.lifeTime = lifetime;

  // if (!Ask.box) {
  //     Ask.box = new MessageDialogBox('Confirmation');
  // }
  // if (!AskText.box) {
  //     AskText.box = new EditDialogBox('EditBox');
  // }
  // if (!ShowMessageBox.box) {
  //     ShowMessageBox.box = new MessageDialogBox('MessageBox');
  // }
  // if (!AskPassword.box) {
  //     AskPassword.box = new AskPasswordDialogBox('AskPasswordBox');
  // }
  // if (!AskNewPassword.box) {
  //     AskNewPassword.box = new AskNewPasswordDialogBox('NewPasswordBox');
  // }
}

// eslint-disable-next-line no-unused-vars
function Ask(message, location, partName, okCb, cancelCb, icon) {
  if (typeof cancelCb !== 'function') {
    icon = cancelCb;
    cancelCb = null;
  }

  if (!Ask.box) {
    Ask.box = new MessageDialogBox('Confirmation', 'bg-popup-darkBlur');
  }

  var box = Ask.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }
  box.setIcon(icon);
  box.show(message, location, partName, cancelCb);
  return box;
}

// eslint-disable-next-line no-unused-vars
function AskText(message, defValue, okCb, cancelCb, icon) {
  if (typeof cancelCb !== 'function') {
    icon = cancelCb;
    cancelCb = null;
  }

  if (!AskText.box) {
    AskText.box = new EditDialogBox('EditBox', 'bg-popup-darkBlur');
  }

  var box = AskText.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }
  box
    .setIcon(icon)
    .setDefaultValue(defValue)
    .setPasswordMode(false)
    .show(message, okCb, cancelCb);

  return box;
}

// eslint-disable-next-line no-unused-vars
function AskPasswordText(message, defValue, okCb, cancelCb, icon) {
  if (typeof cancelCb !== 'function') {
    icon = cancelCb;
    cancelCb = null;
  }

  if (!AskText.box) {
    AskText.box = new EditDialogBox('EditBox', 'bg-popup-darkBlur');
  }

  var box = AskText.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }
  box
    .setIcon(icon)
    .setPasswordMode(true)
    .setDefaultValue(defValue)
    .show(message, okCb, cancelCb);

  return box;
}

// eslint-disable-next-line no-unused-vars
function ShowMessageBox(message, okCb, icon) {
  if (typeof okCb !== 'function') {
    icon = okCb;
    okCb = null;
  }

  if (!ShowMessageBox.box) {
    ShowMessageBox.box = new MessageDialogBox('MessageBox', 'bg-popup-darkBlur');
  }

  var box = ShowMessageBox.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }
  box
    .setIcon(icon)
    .show(message, okCb);
  return box;
}

// eslint-disable-next-line no-unused-vars
function AskPassword(okCb, cancelCb) {
  if (!AskPassword.box) {
    AskPassword.box = new AskPasswordDialogBox('AskPasswordBox', 'bg-popup-darkBlur');
  }
  var box = AskPassword.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }
  box.show(null, okCb, cancelCb);
  return box;
}

// eslint-disable-next-line no-unused-vars
function AskNewPassword(okCb, cancelCb) {
  if (!AskNewPassword.box) {
    AskNewPassword.box = new AskNewPasswordDialogBox('NewPasswordBox', 'bg-popup-darkBlur');
  }

  var box = AskNewPassword.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }
  box.show(null, okCb, cancelCb);
  return box;
}

// eslint-disable-next-line no-unused-vars
function AskPin(message, okCb, cancelCb) {
  if (!AskPin.box) {
    AskPin.box = new AskPinDialogBox('AskPinBox', 'bg-popup-darkBlur');
  }

  var box = AskPin.box;
  if (!box.popup) {
    throw new Error('Popup not found: ' + box.pageName);
  }

  box.clearError();
  box.show(message, okCb, cancelCb);
}
