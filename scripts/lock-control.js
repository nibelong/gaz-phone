/**
 * Function for remote lock spa.
 */
function lockSpaToggle(){
  var textMessage = "Заблокрироватиь дверь в Бане?"
  var location = "Баня";
  var partName = "Дверной замок";
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.0/2/1 SPA Lock Door FB");

  if(!lock){
    textMessage = "Разблокрироватиь дверь в Бане?"
  }

  Ask(textMessage,location, partName, function() {
    var currentValue = IR.GetVariable("Drivers.iRidium Server.KNX.0/2/1 SPA Lock Door FB");
    server.Set("KNX.0/2/1 SPA Lock Door", !currentValue)
  });

}




// garage Security
function lockSecurityToggle(){
  var textMessage = "Заблокрироватиь дверь на Охране?"
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-security")
  var location = "Гараж";
  var partName = "Замок охраны";

  if(!lock){
    textMessage = "Разблокрироватиь дверь на Охране?"
  }

  Ask(textMessage,location, partName, function() {
    var currentValue = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-security")
    server.Set("KNX.lock-fix-security", !currentValue)
  });
}



// garage door garage
function lockGarageToggle(){
  var textMessage = "Заблокировать дверь в Гараже?"
  var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-gan")
  var location = "Гараж";
  var partName = "Дверной замок";

  if(!lock){
    textMessage = "Разблокрироватиь дверь в Гараже?"
  }

  Ask(textMessage,location, partName, function() {
    var lock = IR.GetVariable("Drivers.iRidium Server.KNX.lock-fix-status-gan")
      server.Set("KNX.lock-fix-gan", !lock)
  });

}
