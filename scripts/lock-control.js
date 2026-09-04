function lockSpaToogle(){
  var textMessage = "Заблокрироватиь дверь в Бане?"
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.0/2/1 SPA Lock Door FB");
  if(!lock){
    textMessage = "Разблокрироватиь дверь в Бане?"
  }
  IR.GetPopup("ConfiramationBox").GetItem("Message").Text = textMessage
  IR.ShowPopup('ConfiramationBox');
}


function pressSaveSpaMessageBox(){
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.0/2/1 SPA Lock Door FB");
  IR.HidePopup('ConfiramationBox');
  IR.GetDevice("iRidium Server").Set("KNX.0/2/1 SPA Lock Door", !lock)
}



// garage Security
function lockSecurityToggle(){
  var textMessage = "Заблокрироватиь дверь на Охране?"
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-security")
  if(!lock){
    textMessage = "Разблокрироватиь дверь на Охране?"
  }
  IR.GetPopup("ConfiramationBox 1").GetItem("Message").Text = textMessage
  IR.ShowPopup('ConfiramationBox 1');
}



function pressSaveSecurityMessageBox(){
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-security")
  IR.GetDevice("iRidium Server").Set("KNX.lock-fix-security", !lock)
  IR.HidePopup('ConfiramationBox 1');
}




// garage door garage
function lockGarageToggle(){
  var textMessage = "Заблокировать дверь в Гараже?"
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-gan")

  if(!lock){
    textMessage = "Разблокрироватиь дверь в Гараже?"
  }
  IR.GetPopup("ConfiramationBox 2").GetItem("Message").Text = textMessage
  IR.ShowPopup('ConfiramationBox 2');
}


function pressSaveGarageMessageBox(){
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-gan")
  IR.GetDevice("iRidium Server").Set("KNX.lock-fix-gan", !lock)
  IR.HidePopup('ConfiramationBox 2');
}
