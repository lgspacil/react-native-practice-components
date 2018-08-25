const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  if(!req.body.phone) {
      return res.send(422).send({ error: 'you must provide a phone number' });
  }

    // Make sure the phone number is just the phone number
  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  // get user accepts the id and we used a phone as the ID
  // it is also an async call
  admin.auth().getUser(phone)
      .then(userRecord => {
        // get the rancom code
        const code = Math.floor(Math.random() * 899 + 1000);

        // text the user
        twilio.messages.create({
            body: 'Your code is ' + code,
            to: phone,
            from: '+17072053437'
        }, (err) => {
            if(err) { return res.status(422).send(err); }

            // we can not save things directly to the admin auth since they are decoupled
            // so what we are doing is create a new collection inside the database called users that 
            // inside the users has a key ID of the phone number
            // ref creates the new node
            admin.database().ref('users/' + phone)
                .update({ code: code, codeValid: true }, () => {
                    res.send({ success: true });
                });
        });
      })
      .catch((err) => {
          res.status(422).send({ error: err });
      })

}