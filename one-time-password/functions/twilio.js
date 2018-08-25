const twilio = require('twilio');

const accountSid = 'ACcba74f1f84ddb318184bf0e85879cee0';
const authToken = '14b9b3932cd56ac61491228bdf93bbfb';

module.exports = new twilio.Twilio(accountSid, authToken);