/* GUI variables */
var page = IR.GetItem('calendar');
var labelMonth = page.GetItem('month');
var labelYear = page.GetItem('year');
var buttonNext = page.GetItem('next');
var buttonPrev = page.GetItem('prev');
var defaultColorDay = 0xFFFFFFFF;
var defaultColorCurrentDay = 0x1A89F5FF;
var bSave = page.GetItem('Save');
var bClose = page.GetItem('Close');
var BCancel = page.GetItem('Cancel');
var labelSelectYears = page.GetItem('Years');
var labelSelectDayAndMonth = page.GetItem('DayAndMonth');

// Localisation
var month = ['Январь', 'Февраль', 'Март',
  'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
var Day = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

// Data
var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var today = new Date();
var yearNow = today.getFullYear();
var monthNow = today.getMonth();
var year = yearNow;
var currentMonth = monthNow;

// GUI

var iconSelectDayRight = 'interval_SelectdayRight.png';
var iconSelectDayLeft = 'interval_SelectdayLeft.png';

var iconDayLeft = 'interval_dayLeft.png';
var iconDayRight = 'interval_dayRigth.png';
var iconDayMiddle = 'interval_dayMiddle.png';

// arr [day,momth, years, flagSelect]

var fistDateSelect = {
  fullDate: 0,
  day: 0,
  month: 0,
  years: 0,
  flagSelect: 0,
  nameLabel: 0
};

var secondDateSelect = {
  fullDate: 0,
  day: 0,
  month: 0,
  years: 0,
  flagSelect: 0,
  nameLabel: 0
};

// Get Items Days
var labelDay = [];

function intiDayLabel() {
  for (var i = 1; i <= 42; i++) {
    labelDay[i] = page.GetItem('d' + i);
  }

  // Print Localisation
  for (var j = 1; j < 8; j++) {
    page.GetItem('l' + [j]).Text = Day[j - 1];
  }
}

intiDayLabel();

// year Leap
function yearChange() {
  if ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) {
    monthDay[1] = 29;
  } else {
    monthDay[1] = 28;
  }
  today.setFullYear(year);
}

// month Change
function monthChange() {
  // Get count Days in Prev Months
  var prevMonth = currentMonth - 1;
  if (prevMonth < 0) {
    prevMonth = 11;
  }
  // var nDays = monthDay[prevMonth];

  today.setMonth(currentMonth);
  // Get other Data
  // nDays = monthDay[currentMonth];
  var thisDay = today.getDate();
  // Print month & year
  labelMonth.GetState(0).Text = month[currentMonth];
  labelYear.GetState(0).Text = year.toString();
  // Print Days
  for (var j = 1; j < 43; j++) {
    labelDay[j].GetState(0).Text = ' ';
  }
  // Set month
  var startDay = today.getDay();
  if (startDay === 0) {
    startDay = 7;
  }
  // find position first day
  for (var k = 0; k < today.getDate(); k++) {
    if (thisDay === 1) {
      break;
    }
    if (startDay === 1) {
      startDay = 7;
      thisDay -= 1;
    } else {
      thisDay -= 1;
      startDay -= 1;
    }
  }

  // var prievcount = startDay;
  var dayMonth = 1;
  thisDay = today.getDate();
  for (var i = 1; i < 43; i++) {
    if (i < startDay) {
      labelDay[i].Visible = false;
      labelDay[i].Text = '';
      labelDay[i].Value = 0;
      labelDay[i].GetState(0).Image = '';
      labelDay[i].GetState(0).TextColor = defaultColorDay;
    } else if (i >= startDay && dayMonth <= monthDay[currentMonth]) {
      var checkDay = new Date(year, currentMonth, dayMonth);

      labelDay[i].Visible = true;
      labelDay[i].Text = dayMonth;
      labelDay[i].GetState(0).TextColor = defaultColorDay;
      labelDay[i].GetState(1).Image = '';
      if (+labelDay[i].Text === fistDateSelect.day && currentMonth === fistDateSelect.month
        && year === fistDateSelect.years) {
        labelDay[i].Value = 1;
        if (secondDateSelect.flagSelect) {
          if (fistDateSelect.fullDate !== secondDateSelect.fullDate) {
            labelDay[i].GetState(1).Image = iconSelectDayLeft;
          }
        }
      } else if (+labelDay[i].Text === secondDateSelect.day && currentMonth === secondDateSelect.month
        && year === secondDateSelect.years) {
        labelDay[i].Value = 1;
        if (fistDateSelect.fullDate !== secondDateSelect.fullDate) {
          labelDay[i].GetState(1).Image = iconSelectDayRight;
        }
      } else if (checkDay > fistDateSelect.fullDate && checkDay < secondDateSelect.fullDate) {
        if ((i + 7) % 7 === 0) {
          labelDay[i].GetState(0).Image = iconDayRight;
        } else if (i === 1 || (i - 1) % 7 === 0) {
          labelDay[i].GetState(0).Image = iconDayLeft;
        } else {
          labelDay[i].GetState(0).Image = iconDayMiddle;
        }
      } else {
        labelDay[i].Value = 0;
        labelDay[i].GetState(0).Image = '';
      }
      dayMonth += 1;
    } else {
      labelDay[i].Visible = false;
      labelDay[i].Text = '';
      labelDay[i].Value = 0;
      labelDay[i].GetState(0).Image = '';
      labelDay[i].GetState(0).TextColor = defaultColorDay;
    }
  }

  // Select Current Day
  if ((monthNow === currentMonth) && (yearNow === year)) {
    for (var c = 1; c < 43; c++) {
      var day = thisDay.toString();
      if (labelDay[c].Text === day) {
        labelDay[c].GetState(0).TextColor = defaultColorCurrentDay;
        labelDay[c].GetState(0).Image = '';
      }
    }
  }

  // var b = 0; var v = 0;
}

// Button Next
IR.AddListener(IR.EVENT_ITEM_RELEASE, buttonNext, function() {
  if (currentMonth < 11) {
    currentMonth += 1;
  } else {
    currentMonth = 0;
    year += 1;
    yearChange();
  }

  monthChange();
});

// Close Calndar
IR.AddListener(IR.EVENT_ITEM_RELEASE, BCancel, function() {
  IR.GetDevice('iRidium Server').Set('equipmentLastError', 'update');
  resetVariableDateSelect();
  setTextForTopAreaCalendar();
  currentMonth = monthNow;
  year = yearNow;
  yearChange();
  monthChange();
});

// Save and send request to BD
// formate date yyyy-mm-dd
IR.AddListener(IR.EVENT_ITEM_RELEASE, bSave, function() {
  var str = getSelectedDatesString();
  IR.GetDevice('iRidium Server').Set('equipmentBetweenError', JSON.stringify(str));
});

IR.AddListener(IR.EVENT_ITEM_RELEASE, bClose, function() {
  resetVariableDateSelect();
  setTextForTopAreaCalendar();
  currentMonth = monthNow;
  year = yearNow;
  yearChange();
  monthChange();
  IR.GetDevice('iRidium Server').Set('equipmentLastError', 'update');
});

// Button Prev
IR.AddListener(IR.EVENT_ITEM_RELEASE, buttonPrev, function() {
  if (currentMonth >= 1) {
    currentMonth -= 1;
  } else {
    currentMonth = 11;
    year -= 1;
    yearChange();
  }
  monthChange();
});

// eslint-disable-next-line no-unused-vars
function selectDay() {
  var nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  var selectDate = new Date(year, currentMonth, this.Text);
  selectDate.setHours(0, 0, 0, 0);

  if (selectDate <= nowDate) {
    if (fistDateSelect.flagSelect === 0 /* && selectDate <= nowDate */) {
      this.Value = 1;
      // this.GetState(1).Image = iconSelectDayLeft;
      setFistDataSelect(selectDate, +this.Text, currentMonth, year, 1, this.Name);
      setTextForTopAreaCalendar(fistDateSelect.fullDate);
    } else if (fistDateSelect.flagSelect === 1 && secondDateSelect.flagSelect === 0) {
      if (selectDate > fistDateSelect.fullDate && selectDate <= nowDate) {
        this.Value = 1;
        this.GetState(1).Image = iconSelectDayRight;
        // page.GetItem(fistDateSelect.nameLabel).GetState(1).Image = iconSelectDayLeft;
        setSecondDataSelect(selectDate, +this.Text, currentMonth, year, 1, this.Name);
        setTextForTopAreaCalendar(fistDateSelect.fullDate, secondDateSelect.fullDate);
      } else if (fistDateSelect.fullDate.getTime() === selectDate.getTime()) {
        resetVariableDateSelect();
        setTextForTopAreaCalendar();
      } else {
        this.Value = 1;
        secondDateSelect = copyObjectDate(fistDateSelect, secondDateSelect);

        setFistDataSelect(selectDate, +this.Text, currentMonth, year, 1, this.Name);

        setTextForTopAreaCalendar(fistDateSelect.fullDate, secondDateSelect.fullDate);
      }
    } else if (fistDateSelect.flagSelect === 1 && secondDateSelect.flagSelect === 1) {
      if ((+selectDate.getMonth() === +fistDateSelect.fullDate.getMonth()
          && +selectDate.getFullYear() === +fistDateSelect.fullDate.getFullYear()
          && +selectDate.getDate() === +fistDateSelect.fullDate.getDate())
        || (+selectDate.getMonth() === +secondDateSelect.fullDate.getMonth()
          && +selectDate.getFullYear() === +secondDateSelect.fullDate.getFullYear()
          && +selectDate.getDate() === +secondDateSelect.fullDate.getDate())) {
        page.GetItem(fistDateSelect.nameLabel).Value = 0;
        page.GetItem(secondDateSelect.nameLabel).Value = 0;

        this.Value = 1;
        setFistDataSelect(selectDate, +this.Text, currentMonth, year, 1, this.Name);
        setTextForTopAreaCalendar(fistDateSelect.fullDate);
        setSecondDataSelect(0, 0, 0, 0, 0, '');
      } else if ((selectDate > fistDateSelect.fullDate && selectDate < secondDateSelect.fullDate)
        || selectDate > secondDateSelect.fullDate) {
        // reset prevision secondday in 0
        page.GetItem(secondDateSelect.nameLabel).Value = 0;
        // set now select day
        this.Value = 1;
        setSecondDataSelect(selectDate, +this.Text, currentMonth, year, 1, this.Name);
        setTextForTopAreaCalendar(fistDateSelect.fullDate, secondDateSelect.fullDate);
      } else {
        page.GetItem(fistDateSelect.nameLabel).Value = 0;
        this.Value = 1;
        setFistDataSelect(selectDate, +this.Text, currentMonth, year, 1, this.Name);
        setTextForTopAreaCalendar(fistDateSelect.fullDate, secondDateSelect.fullDate);
      }
    }
  }
  monthChange();
}

function resetVariableDateSelect() {
  Object.keys(fistDateSelect).forEach(function(key) {
    fistDateSelect[key] = 0;
    secondDateSelect[key] = 0;
  });
}

function copyObjectDate(o1) {
  var o2 = {};
  o2.flagSelect = o1.flagSelect;
  o2.day = o1.day;
  o2.month = o1.month;
  o2.years = o1.years;
  o2.nameLabel = o1.nameLabel;
  o2.fullDate = o1.fullDate;
  return o2;
}

// eslint-disable-next-line no-shadow
function setFistDataSelect(fullDate, day, month, years, flag, name) {
  fistDateSelect.fullDate = fullDate;
  fistDateSelect.day = +day;
  fistDateSelect.month = month;
  fistDateSelect.years = years;
  fistDateSelect.flagSelect = +flag;
  fistDateSelect.nameLabel = name;
}

// eslint-disable-next-line no-shadow
function setSecondDataSelect(fullDate, day, month, years, flag, name) {
  secondDateSelect.fullDate = fullDate;
  secondDateSelect.day = +day;
  secondDateSelect.month = month;
  secondDateSelect.years = years;
  secondDateSelect.flagSelect = flag;
  secondDateSelect.nameLabel = name;
}

function setTextForTopAreaCalendar(fistDate, secondDate) {
  var dateFistLabel;
  var dateSecondLabel;
  var strLabelYears;
  var strLabelDayAndMoth;
  if (fistDate) {
    dateFistLabel = new Date(fistDate);
    strLabelYears = dateFistLabel.getFullYear();
    strLabelDayAndMoth = month[dateFistLabel.getMonth()] + ' ' + dateFistLabel.getDate();
    labelSelectYears.Text = strLabelYears;
    labelSelectDayAndMonth.Text = strLabelDayAndMoth;
  }
  if (secondDate) {
    dateSecondLabel = new Date(secondDate);
    strLabelYears = strLabelYears + ' - ' + dateSecondLabel.getFullYear();
    strLabelDayAndMoth = strLabelDayAndMoth + ' - ' + month[dateSecondLabel.getMonth()] + ' '
      + dateSecondLabel.getDate();
    labelSelectYears.Text = strLabelYears;
    labelSelectDayAndMonth.Text = strLabelDayAndMoth;
  }

  if (fistDate === undefined && secondDate === undefined) {
    labelSelectYears.Text = '';
    labelSelectDayAndMonth.Text = '';
  }
}

function getSelectedDatesString() {
  var data = {
    start: '',
    end: ''
  };
  if (fistDateSelect.flagSelect) {
    var start = formatDateString(fistDateSelect.fullDate);
    data.start = start + ' 00:00:00';
    data.end = start + ' 23:59:59';

    if (secondDateSelect.flagSelect) {
      data.end = formatDateString(secondDateSelect.fullDate) + ' 23:59:59';
    }
  }

  return data;
}

function formatDateString(date) {
  var formatYear = date.getFullYear();
  var formatMonth = date.getMonth() + 1;
  var day = date.getDate();

  if (formatMonth < 10) formatMonth = '0' + formatMonth;
  if (day < 10) day = '0' + day;

  return formatYear + '-' + formatMonth + '-' + day;
}
