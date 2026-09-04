
function checkStateCountInfo(namePage,nameItem, timePlay, valueCount){

  var valueItem = IR.GetPage(namePage).GetItem(nameItem).Value
  if (valueCount == valueItem ){

  }else if (valueCount == 0){
    callAnimationHideCountInfo(namePage,nameItem,timePlay, valueCount, valueCount )
  }else if(valueCount != valueItem && valueItem == 0)
  {
    callAnimationShowCountInfo(namePage,nameItem, timePlay, valueItem, valueCount-valueItem)
  }else if(valueCount != valueItem && valueItem != 0){
    callAnimationChangeValueCountInfo(namePage,nameItem, timePlay, valueItem, valueCount-valueItem)
  }

}

function callAnimationShowCountInfo(namePage,nameItem, timePlay, fistValueCount, secondValueCount)
{

  ANIMATION(
    [ANIMATION.Show(),ANIMATION.ScaleXY(0, 1.1),ANIMATION.Value(fistValueCount, secondValueCount)],
    IR.GetPage(namePage).GetItem(nameItem),
    timePlay,
    ANIMATION.NO_DELAY,
    ANIMATION.NO_LOOP,
    IR.CIRC_OUT)

}

function callAnimationHideCountInfo(namePage,nameItem, timePlay, fistValueCount, secondValueCount)
{

  ANIMATION(
    [ANIMATION.Value(0, 0),ANIMATION.Hide(),ANIMATION.ScaleXY(1.1, -1)],
    IR.GetPage(namePage).GetItem(nameItem),
    //IR.GetPopup(namePage).GetItem(nameListElementsButton[count]),
    timePlay,
    ANIMATION.NO_DELAY,
    ANIMATION.NO_LOOP,
    IR.CIRC_OUT);

}

function callAnimationChangeValueCountInfo(namePage,nameItem, timePlay, fistValueCount, secondValueCount)
{

  ANIMATION(
    [ANIMATION.Value(fistValueCount, secondValueCount)],
    IR.GetPage(namePage).GetItem(nameItem),
    //IR.GetPopup(namePage).GetItem(nameListElementsButton[count]),
    timePlay,
    ANIMATION.NO_DELAY,
    ANIMATION.NO_LOOP,
    IR.CIRC_OUT)

}
