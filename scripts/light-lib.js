//////////////     Don't change this content      //////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/////////                 RGB Library                ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

// change current color by step. need device, step, Red, Green & Blue channel
function RGB_change_step(device, step, R, G, B){

  var value = device.GetFeedback(R) + step;
  device.Set(R, (value < 0) ? 0 : (value > 255) ? 255 : value);

  var value = device.GetFeedback(G) + step;
  device.Set(G, (value < 0) ? 0 : (value > 255) ? 255 : value);

  var value = device.GetFeedback(B) + step;
  device.Set(B, (value < 0) ? 0 : (value > 255) ? 255 : value);

}

// set new color by color picker item. eed device, Red, Green & Blue channel and link to item picker
function RGB_divider(device, R_feed, G_feed, B_feed, toplimit, picker){

  var color = picker.PickColor;

  var R = (color >> 24) & 0xFF;
  var G = (color >> 16) & 0xFF;
  var B = (color >> 8)  & 0xFF;
  if (toplimit == '100') {
    device.Set(R_feed, R * (100 / 255));
    device.Set(G_feed, G * (100 / 255));
    device.Set(B_feed, B * (100 / 255));
  } else if (toplimit == '255') {
    device.Set(R_feed, R);
    device.Set(G_feed, G);
    device.Set(B_feed, B);
  } else {
    IR.Log("Incrorrect top limit! Choose 100 or 255");
  }
}

// listen changing color and display it to the graphical item. need device, Red, Green & Blue channel and link to item display
function RGB_add_color_listener(device, R_feed, G_feed, B_feed, toplimit, display){

  IR.AddListener(IR.EVENT_TAG_CHANGE, device, function(name){
    switch(name){
      case R_feed:
      case G_feed:
      case B_feed:
        if (toplimit == '100') {
          display.GetState(0).FillColor = device.GetFeedback(R_feed) * 255 / 100 << 24 | device.GetFeedback(G_feed) * 255 / 100 << 16 | device.GetFeedback(B_feed) * 255 / 100 << 8 | 0xFF;
        } else if (toplimit == '255') {
          display.GetState(0).FillColor = device.GetFeedback(R_feed) << 24 | device.GetFeedback(G_feed) << 16 | device.GetFeedback(B_feed) << 8 | 0xFF;
        }
        break;
    }
  });

}

// create the functions for control RGB. I need device, R, G, B channels, link to item display, link to item picker, step for change color
function RGB_player(nameofRGB_device, RGB_channel_R, RGB_channel_G, RGB_channel_B, toplimit, RGB_picker, RGB_display, RGB_up, RGB_down, RGB_step){
  // The Color listener for displayed the current color
  this.RGB_device = IR.GetDevice(nameofRGB_device)
  if(RGB_display)
    RGB_add_color_listener(RGB_device, RGB_channel_R, RGB_channel_G, RGB_channel_B, toplimit, RGB_display);

  // The Up button
  if(RGB_up && RGB_step){
    function up(){
      RGB_change_step(RGB_device, RGB_step, RGB_channel_R, RGB_channel_G, RGB_channel_B);
    }

    IR.AddListener(IR.EVENT_ITEM_RELEASE, RGB_up, up);
    IR.AddListener(IR.EVENT_ITEM_HOLD, RGB_up, up);
  }

  // The Down button
  if(RGB_down && RGB_step){
    function down(){
      RGB_change_step(RGB_device, -RGB_step, RGB_channel_R, RGB_channel_G, RGB_channel_B);
    }

    IR.AddListener(IR.EVENT_ITEM_RELEASE, RGB_down, down);
    IR.AddListener(IR.EVENT_ITEM_HOLD, RGB_down, down);
  }

  // Set new color for release event
  if(RGB_picker)
    IR.AddListener(IR.EVENT_ITEM_RELEASE, RGB_picker, function(){
      RGB_divider(RGB_device, RGB_channel_R, RGB_channel_G, RGB_channel_B, toplimit, RGB_picker);
    });

}
