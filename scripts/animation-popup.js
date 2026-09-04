function checkStateCountInfoOnPopup(namePage,nameItem, timePlay, valueCount){

  var valueItem = IR.GetPopup(namePage).GetItem(nameItem).Value
  if (valueCount == valueItem ){

  }else if (valueCount == 0){
    callAnimationHideCountInfoOnPopup(namePage,nameItem,timePlay, valueCount, valueCount )
  }else if(valueCount != valueItem && valueItem == 0)
  {
    callAnimationShowCountInfoOnPopup(namePage,nameItem, timePlay, valueItem, valueCount-valueItem)
  }else if(valueCount != valueItem && valueItem != 0){
    callAnimationChangeValueCountInfoOnPopup(namePage,nameItem, timePlay, valueItem, valueCount-valueItem)
  }

}

function callAnimationShowCountInfoOnPopup(namePage,nameItem, timePlay, fistValueCount, secondValueCount)
{

  ANIMATION(
    [ANIMATION.Show(),ANIMATION.ScaleXY(0, 1.1),ANIMATION.Value(fistValueCount, secondValueCount)],
    IR.GetPopup(namePage).GetItem(nameItem),
    timePlay,
    ANIMATION.NO_DELAY,
    ANIMATION.NO_LOOP,
    IR.CIRC_OUT)

}

function callAnimationHideCountInfoOnPopup(namePage,nameItem, timePlay, fistValueCount, secondValueCount)
{

  ANIMATION(
    [ANIMATION.Value(0, 0),ANIMATION.Hide(),ANIMATION.ScaleXY(1.1, -1)],
    IR.GetPopup(namePage).GetItem(nameItem),
    timePlay,
    ANIMATION.NO_DELAY,
    ANIMATION.NO_LOOP,
    IR.CIRC_OUT);

}

function callAnimationChangeValueCountInfoOnPopup(namePage,nameItem, timePlay, fistValueCount, secondValueCount)
{

  ANIMATION(
    [ANIMATION.Value(fistValueCount, secondValueCount)],
    IR.GetPopup(namePage).GetItem(nameItem),
    timePlay,
    ANIMATION.NO_DELAY,
    ANIMATION.NO_LOOP,
    IR.CIRC_OUT)

}
