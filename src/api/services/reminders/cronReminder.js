const CronJob = require('cron').CronJob;
const reminder = require('./reminderProvider');

exports.cronSchedule= () =>{
    var job = new CronJob('*/15 * * * *', function() {
        reminder.eventReminder();
        reminder.courseReminder();
      });
      job.start();
} 