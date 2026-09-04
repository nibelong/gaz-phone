var hoursItems = [];

for(var i = 0; i <= 23; i++){
  var hour = i;
  if( i < 10){
    hour = '0' + i.toString();
  };
  hoursItems.push(hour)
}


var minutesItems = [];

for(var i = 0; i <= 59; i++){
  var minute = i;
  if( i < 10){
    minute = '0' + i.toString();
  };
  minutesItems.push(minute)
}


var pickerPopup = IR.GetItem('gardenSetTime');
var leftP1 = pickerPopup.GetItem('_Left1');
var leftP2 = pickerPopup.GetItem('_Left2');
var rightP1 = pickerPopup.GetItem('_Right1');
var rightP2 = pickerPopup.GetItem('_Right2');

var LeftPicker1 = pickerPopup.CreateItem(IR.ITEM_PICKER, 'leftPicker1', {
  X: leftP1.X,
  Y: leftP1.Y,
  Items: hoursItems, // Элементы
  VisibleCount: 3, // 3,5,7,...
  Template: IR.GetPopup('Template Picker1')
});

var LeftPicker2 = pickerPopup.CreateItem(IR.ITEM_PICKER, 'leftPicker2', {
  X: leftP2.X,
  Y: leftP2.Y,
  Items: minutesItems,
  VisibleCount:3,
  Template: IR.GetPopup('Template Picker1')
});

var RightPicker1 = pickerPopup.CreateItem(IR.ITEM_PICKER, 'rightPicker1', {
  X: rightP1.X,
  Y: rightP1.Y,
  Items: hoursItems, // Элементы
  VisibleCount: 3,
  Template: IR.GetPopup('Template Picker1')
});

var RightPicker2 = pickerPopup.CreateItem(IR.ITEM_PICKER, 'rightPicker2', {
  X: rightP2.X,
  Y: rightP2.Y,
  Items: minutesItems,
  VisibleCount: 3,
  Template: IR.GetPopup('Template Picker1')
});

IR.AddListener(IR.EVENT_PICKER_SCROLL, LeftPicker1, function() {
  var startHour = pickerPopup.GetItem('leftPicker1').Value;
  IR.SetVariable("Tokens.hourOn", startHour );
});

IR.AddListener(IR.EVENT_PICKER_SCROLL, LeftPicker2, function(in_position) {
  IR.Log(in_position)
  var startMin = pickerPopup.GetItem('leftPicker2').Value;
  IR.SetVariable("Tokens.minOn", startMin );
});

IR.AddListener(IR.EVENT_PICKER_SCROLL, RightPicker1, function() {
  var endHour = pickerPopup.GetItem('rightPicker1').Value;
  IR.SetVariable("Tokens.hourOff", endHour );
});

IR.AddListener(IR.EVENT_PICKER_SCROLL, RightPicker2, function() {
  var endMin = pickerPopup.GetItem('rightPicker2').Value;
  IR.SetVariable("Tokens.minOff", endMin);
});

var pLeft1 = pickerPopup.GetItem('leftPicker1');
var pLeft2 = pickerPopup.GetItem('leftPicker2');
var pRight1 = pickerPopup.GetItem('rightPicker1');
var pRight2 = pickerPopup.GetItem('rightPicker2');




function setBitValueSafe(value, position, bitValue) {
  // Ограничиваем исходное число 16 битами
  value = value & 0xFFFF;

  if (position < 0 || position > 15) {
    return value;
  }

  var result;
  if (bitValue) {
    result = value | (1 << position);
  } else {
    result = value & ~(1 << position);
  }

  // Ограничиваем результат 16 битами
  return result & 0xFFFF;
}

function setWeekDayZone1(){
  var day = this.Name.split('_');
  var dayValue = this.Value;
  var weekList = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  var name = day[0];
  for(var i = 0; i < weekList.length; i++){
    if(name === weekList[i]){
      var currentDayValue = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.weekDayZone 1")
      var newDayWeek = setBitValueSafe(currentDayValue, i, dayValue);
      IR.SetVariable("Drivers.iRidium Server.Modbus RTU.weekDayZone 1", newDayWeek)
      IR.GetDevice("iRidium Server").Set("Modbus RTU.weekDayZone 1", newDayWeek)
    }
  }
}


function setWeekDayZone2(){
  var day = this.Name.split('_');
  var dayValue = this.Value;
  var weekList = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  var name = day[0];
  for(var i = 0; i < weekList.length; i++){
    if(name === weekList[i]){
      var currentDayValue = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.weekDayZone 2")
      var newDayWeek = setBitValueSafe(currentDayValue, i, dayValue);
      IR.SetVariable("Drivers.iRidium Server.Modbus RTU.weekDayZone 2", newDayWeek)
      IR.GetDevice("iRidium Server").Set("Modbus RTU.weekDayZone 2", newDayWeek)
    }
  }
}

function setWeekDayZone3(){
  var day = this.Name.split('_');
  var dayValue = this.Value;
  var weekList = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  var name = day[0];
  for(var i = 0; i < weekList.length; i++){
    if(name === weekList[i]){
      var currentDayValue = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.weekDayZone 3")
      var newDayWeek = setBitValueSafe(currentDayValue, i, dayValue);
      IR.SetVariable("Drivers.iRidium Server.Modbus RTU.weekDayZone 3", newDayWeek)
      IR.GetDevice("iRidium Server").Set("Modbus RTU.weekDayZone 3", newDayWeek)
    }
  }
}


var lastCallfunctionTime = undefined;

function callTimeSelector(){
  var namesection = this.Name;
  IR.Log(namesection)
  var label = IR.GetItem("garden_AutoWatering").GetItem(namesection).Text;
  IR.Log(label);
  IR.GetPopup("gardenSetTime").GetItem('nameZone').GetState(0).Text = label;
  lastCallfunctionTime = namesection;
  var hourOn = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.on_h_" + namesection);
  var minOn = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.on_m_" + namesection);
  var hourOff = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.off_h_" + namesection);
  var minOff = IR.GetVariable("Drivers.iRidium Server.Modbus RTU.off_m_" + namesection);

  pLeft1.Position = +hourOn === 0 ? 23 : +hourOn -1
  pLeft2.Position = +minOn === 0 ? 59 : +minOn -1
  pRight1.Position = +hourOn === 0 ? 23 : +hourOff -1
  pRight2.Position = +minOff === 0 ? 59 : +minOff -1

  IR.SetVariable("Tokens.hourOn", hourOn );
  IR.SetVariable("Tokens.minOn",minOn );
  IR.SetVariable("Tokens.hourOff",hourOff );
  IR.SetVariable("Tokens.minOff", minOff);
  IR.ShowPopup('gardenSetTime');
}


function confirmationSelectorTime(){
  var hourOn = IR.GetVariable("Tokens.hourOn");
  var minOn = IR.GetVariable("Tokens.minOn");
  var hourOff = IR.GetVariable("Tokens.hourOff");
  var minOff = IR.GetVariable("Tokens.minOff");

  IR.GetDevice("iRidium Server").Set("Modbus RTU.on_h_" + lastCallfunctionTime, hourOn)
  IR.GetDevice("iRidium Server").Set("Modbus RTU.on_m_" + lastCallfunctionTime, minOn)
  IR.GetDevice("iRidium Server").Set("Modbus RTU.off_h_" + lastCallfunctionTime, hourOff)
  IR.GetDevice("iRidium Server").Set("Modbus RTU.off_m_" + lastCallfunctionTime, minOff)
  lastCallfunctionTime = undefined;
  IR.HidePopup('gardenSetTime')

}





