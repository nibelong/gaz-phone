var main_SSID = "-=EVEREST=-";

function UpdateCloudMode(){
  if(IR.GetVariable("System.Net.SSID")!= main_SSID )
    IR.SetServerCloudConnect(true)
  else
    IR.SetServerCloudConnect(false)
}

IR.AddListener(IR.EVENT_START, 0, function () {

  UpdateCloudMode();
  IR.SetGlobalListener(IR.EVENT_GLOBAL_TAG_CHANGE, UpdateCloudMode);
  IR.SubscribeTagChange("System.Net.SSID");

  IR.SetInterval(5000, UpdateCloudMode)
});
