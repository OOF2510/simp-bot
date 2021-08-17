module.exports = function (milliseconds) {
  var seconds = {},
    minutes = {},
    hours = {},
    days = {},
    months = {},
    years = {};

  seconds.val = Math.floor(milliseconds / 1000);
  minutes.val = Math.floor(seconds.val / 60);
  hours.val = Math.floor(minutes.val / 60);
  days.val = Math.floor(hours.val / 24);
  months.val = Math.floor(days.val / 30);
  years.val = Math.floor(days.val / 365);

  seconds.val %= 60;
  minutes.val %= 60;
  hours.val %= 24;
  days.val %= 30;
  months.val %= 12;

  seconds.name = "sec";
  minutes.name = "min";
  hours.name = "hr";
  days.name = "day";
  months.name = "month";
  years.name = "yr";

  var units = [years, months, days, hours, minutes, seconds];
  var toReturn = [];

  for (const unit of units) {
    if (unit.val === 1) toReturn.push(`${unit.val} ${unit.name}`);
    else if (unit.val > 1) toReturn.push(`${unit.val} ${unit.name}s`);
  }

  let str = toReturn.join(", ");
  return str;
};
