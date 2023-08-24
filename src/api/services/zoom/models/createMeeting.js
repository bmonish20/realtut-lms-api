const moment = require('moment-timezone');

const recurrenceType = {
  daily: (obj) => {
    obj.recurrence = { type: 1 };
  },
  weekly: (obj) => {
    obj.recurrence = { type: 2 };
  },
  monthly: (obj) => {
    obj.recurrence = { type: 3 };
  }
}

const meetingType = {
  instant: (obj) => {
    obj.type = 1
  },
  scheduled: (obj, { dateTime, duration }) => {
    obj.type = 2;
    obj.start_time = moment(dateTime).format('yyyy-MM-ddTHH:mm:ssZ');
    obj.duration = duration;
  },
  recurring: (obj, { dateTime, recurrence }) => {
    obj.type = 3;
    obj.start_time = moment(dateTime).format('yyyy-MM-ddTHH:mm:ssZ');
  },
  recurringWithFixedTime: (obj, { dateTime, recurrence }) => {
    obj.type = 8;
    obj.start_time = moment(dateTime).format('yyyy-MM-ddTHH:mm:ssZ');
    const setRecurrence = recurrenceType[recurrence.type];
    setRecurrence(obj, recurrence);
  },
}

class CreateMeeting {
  constructor({
    title,
    type,
    dateTime,
    description,
    duration,
    recurrence
  }) {
    this.topic = title;
    const setMeetingProps = meetingType[type];
    setMeetingProps(this, {
      dateTime,
      duration,
      recurrence
    });
    this.timeZone = "Asia/Calcutta";
    this.agenda = description;
    this.password = Math.random().toString(36).substring(3)
    this.settings = {
      host_video: true,
      participant_video: true,
      cn_meeting: true,
      in_meeting: true,
      mute_upon_entry: false,
      watermark: false,
      approval_type: 0,
      registration_type: 1,
      audio: "both",
      auto_recording: "none",
      global_dial_in_countries: [
      ],
      registrants_email_notification: false
    }
  }
}

module.exports = CreateMeeting;
