var later = require('later');
later.date.localTime();

console.log("Now:"+new Date());

 var sched = later.parse.text('every 10 seconds between 8:00 am and 5:00 pm'),
      t = later.setInterval(test, sched),
      count = 5;

  function test() {
    console.log(new Date());
    count--;

  }