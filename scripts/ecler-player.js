/**
 *  Remote stream music player server
 * @param name - server name
 * @constructor
 */
function EclerZero (name){
  console.log('Start Driver')
  var that = this;
  var device = IR.GetDevice(name);
  var feedbackTimer = null

  IR.AddListener(IR.EVENT_CHANNEL_SET, device, function(name, value) {
    if(name === 'Play'){
      device.Send(['{"jsonrpc":"2.0","method":"Player.Play"}',0x0D ])
    }else if(name === 'Stop'){
      device.Send(['{"jsonrpc":"2.0","method":"Player.Stop"}',0x0D ])
    }else if(name === 'Next'){
      device.Send(['{"jsonrpc":"2.0","method":"Player.Next"}',0x0D ])
    }else if(name === 'Prev'){
      device.Send(['{"jsonrpc":"2.0","method":"Player.Prev"}',0x0D ])
    }else if(name === 'Volume'){
      var param = '{"jsonrpc":"2.0","method":"Player.Volume","Volume":' + value + '}'
      device.Send([param,0x0D])
    }else if(name === 'Source'){
      var param = '{"jsonrpc":"2.0","method":"Player.Open","Source":' + value + '}'
      device.Send([param,0x0D])
    }else if(name === 'URL'){
      var param = '{"jsonrpc":"2.0","method":"Player.Open","Url":"' + value + '"}'
      device.Send([param,0x0D])
    }

  });


  IR.AddListener(IR.EVENT_ONLINE, device, function(){
    feedbackTimer = IR.SetInterval (5000, function()
    {
      device.Set("getStatus", '{"jsonrpc":"2.0","method":"Player.GetStatsEx"}\r')
    });
  });

  IR.AddListener(IR.EVENT_OFFLINE, device, function(){
    if(feedbackTimer){
      IR.ClearInterval(feedbackTimer);
    }
  });

  IR.AddListener(IR.EVENT_RECEIVE_TEXT, device, function(data)
  {
    try {
      IR.Log(data)
      var params = JSON.Parse(data);
      if(params.title){
        device.SetFeedback('volume', params.volume)
        IR.Log(params.volume)
        device.SetFeedback('source', params.source)
      }

    } catch (err) {
      console.log(err)
    }
  });

}

EclerZero('Ecler')

var listSource = {
  wc: '5/5/6 Toilet room L/R FB',
  shower: '5/5/4 Shower room L/R SW',
  wardrobe: '5/5/8 Razdevalka L/R FB',
  spa: '5/5/2 Parnaya L/R FB'
}

var listChannel = {
  wc: '5/5/5 Toilet room L/R SW',
  shower: '5/5/3 Shower room L/R SW',
  wardrobe: '5/5/7 Razdevalka L/R SW',
  spa: '5/5/1 Parnaya L/R SW'
}

/**
 * function for button
 */
function remoteMusicChannel(){
  var nameSource = this.Name;
  var nameFB = listSource[nameSource]
  var nameChannel = listChannel[nameSource]
  var currentValue = IR.GetVariable("Drivers.iRidium Server.KNX IP Router." + nameFB)
  IR.GetDevice("iRidium Server").Set("KNX IP Router." + nameChannel, !currentValue)
}
