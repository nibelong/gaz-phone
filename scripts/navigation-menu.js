/**
 * Remote menu on main page - main, service, garage, spa, house
 * @constructor
 */
function MainMenuShowPage(){
  IR.HideGroup('addMenu')
  var name = this.Name
  IR.ShowPopup(name + "_Title");
  IR.ShowPopup(name + "_UpMenu");
  IR.ShowPopup(name + "_DownMenu");
  IR.ShowPopup(name + "_RemotePage");
  IR.SetVariable("Tokens.isVisibleFanButton", 0);
}


/**
 * Service menu
 * @constructor
 */
function ServiceMenuShowPage(){
  IR.ShowPopup("service_" + this.Name);
  IR.SetVariable("Tokens.serviceManuValue",this.Value);
}

function showMenuHouse(){
  var menuValue = IR.GetVariable("Tokens.menuHouse");
  if (menuValue === undefined) menuValue = 1
  var namePopup = 'Floor_' + menuValue + '_RemotePage';
  IR.SetVariable("Tokens.subMenuHouse", 2);
  IR.ShowPopup(namePopup);
}

function showSubMenuHouse(){
  var menuValue = IR.GetVariable("Tokens.menuHouse");
  if (menuValue === undefined) menuValue = 1
  IR.Log(menuValue)
  var namePopup = 'Floor_' + menuValue
  var subMenuValue = IR.GetVariable("Tokens.subMenuHouse");
  switch(subMenuValue) {
    case 1:
      namePopup = namePopup + '_Room'
      break;
    case 2:
      namePopup = namePopup + '_RemotePage'
      break;
    case 0:
      namePopup = namePopup + '_RemotePlan'
      break;
    default:
      namePopup = namePopup + '_RemotePage'
      break;
  }
  IR.ShowPopup(namePopup);
}


function backFromRoom(){
  var currentMainMenu = IR.GetVariable("Tokens.mainMenuValue"); // 1-house 2 - garage 3-spa
  var currentPopup = IR.GetVariable("Tokens.subMenuHouse");
  var currentFloor = IR.GetVariable("Tokens.menuHouse");
  var floorValue = 1;
  if(currentMainMenu === 2){
    floorValue = 4
    currentFloor = 4
    currentPopup = IR.GetVariable("Tokens.planGarage");
  }else if(currentMainMenu === 3){
    floorValue = 3
    currentFloor = 3
    currentPopup = IR.GetVariable("Tokens.planBanya");
  }

  IR.HideGroup('addMenu')
  IR.ShowPopup('Floor_' + floorValue +  '_Title');
  IR.ShowPopup("Floor_" + floorValue + "_UpMenu");
  IR.ShowPopup("Floor_" + floorValue + "_DownMenu");

  if(currentPopup === 0) {
    IR.ShowPopup("Floor_" + currentFloor + "_RemotePlan");
    return
  }
  if(currentPopup === 1){
    IR.ShowPopup("Floor_" + currentFloor +  "_Room");
    return
  }
  IR.ShowPopup("Floor_" + currentFloor + "_RemotePlan");

}


function openRoom(){
  var name = this.Name
  var matchRoom = name.match(/\d+/); // ищет первую последовательность цифр
  var roomNumber = matchRoom ? parseInt(matchRoom[0], 10) : NaN;
  IR.HideGroup('MainFunction')
  IR.ShowPopup("Room " + roomNumber);
  IR.SetVariable("Tokens.roomMenuValue",0);
}
