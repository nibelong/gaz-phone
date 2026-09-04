var colorTextAlarmDeFault = 0xFFFFFFFF;
var colorTextAlarmDeActive = 0xEB5757FF;

function getColorTextAlarm(value){
  return  value ? colorTextAlarmDeActive : colorTextAlarmDeFault;
}

IR.AddListener(IR.EVENT_START, 0, function () {

  IR.SetVariable("Tokens.textHeader", "Обзор" );
  IR.SetVariable("Tokens.menuValue", 0);


  var defaultCamera = IR.CreateImage("Camera 1", {URI: "rtsp://admin:ArtiS7031055@192.168.66.31:554/ISAPI/Streaming/Channels/102",
    Refresh: 0,
    Demuxer: '',
    ProbeSize: 100000,
    Param: 'rtsp_transport=tcp',
    Audio: false,
    ScaleWidth: 1024,
    ScaleHeight: 768
  });

  // IR.GetPopup("camera_RemotePage").GetItem("camera_Image").GetState(0).Image = defaultCamera;
  // IR.GetPopup("camera_FullImage").GetItem("camera_Image").GetState(0).Image = defaultCamera;


  yearChange();
  monthChange();
  server.Set('equipmentLastError', 'update');
});


IR.AddListener(IR.EVENT_ONLINE, server, function() {
  server.Set('equipmentLastError', 'update');
});


IR.AddListener(IR.EVENT_TAG_CHANGE, server, function(name, value) {
  if (name === 'notificationMassageError') {
    showNotification(value);
  } else if (name === 'equipmentError') {
    IR.Log(value);
    IR.SetVariable('Tokens.AlarmList', value);
  }else if(name === 'KNX.autowatering_alarm_low_temp'){
    IR.GetPopup("garden_AutoWatering").GetItem("value_Temp 2").GetState(0).TextColor = getColorTextAlarm(value);
  }else if(name === 'autowatering_alarm_hight_temp'){
    IR.GetPopup("garden_AutoWatering").GetItem("value_Temp 2").GetState(0).TextColor = getColorTextAlarm(value);
  }else if(name === 'KNX.autowatering_alarm_co2_sensor'){
    IR.GetPopup("garden_AutoWatering").GetItem("CO2").GetState(0).Textolor = getColorTextAlarm(value);
  }
});
