// const admin = require('firebase-admin');

// module.exports = function (req, res) {

//     if (!req.body.phone || !req.body.code) {
//         res.status(422).send({ error: "Phone and code must be provided" })
//     }

//     // Make sure the phone number is just the phone number
//     const phone = String(req.body.phone).replace(/[^\d]/g, '');

//     // converting a string to an integer if possible
//     const code = parseInt(req.body.code);

//     // Get access to the current user and look at their collection
//     admin.auth().getUser(phone)
//         .then(() => {
//             // pointing at a particular spot in the database
//             const ref = admin.database().ref('users/' + phone)
//             // looking at the database and we get a callback of snapshot of the value fetched
//             // the on value is an event handler that is listening to this particular node
//             ref.on('value', snapshot => {
//                 // stop listening to this value changes 
//                 ref.off();

//                 // snapshot in this case contains an object with the code and the codeValid values
//                 const user = snapshot.val();

//                 // this is the user.code that is stored on our side in the server
//                 if (user.code !== code || !user.codeValid) {
//                     return res.status(422).send('code not valid');
//                 };

//                 // if the user gets this far we know that user has successfully submitted the correct code
//                 // update the codeValid to false
//                 ref.update({ codeValid: false })

//                 // generate our custom json token and needs an ID of the user
//                 admin.auth().createCustomToken(phone)
//                     .then(() => {
//                         res.send({ token: token})
//                     })
//             });
//         })
//         .catch((err) => {
//             res.status(422).send({ error: err })
//         })

// }

const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: 'Phone and code must be provided'});
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(req.body.code);

  // Get access to the current user and look at their collection
  admin.auth().getUser(phone)
    .then(() => {
      // pointing at a particular spot in the database
      const ref = admin.database().ref('users/' + phone);
      // looking at the database and we get a callback of snapshot of the value fetched
      // the on value is an event handler that is listening to this particular node
      ref.on('value', snapshot => {
        // stop listening to this value changes 
        ref.off();
        // snapshot in this case contains an object with the code and the codeValid values
        const user = snapshot.val();

        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' });
        }

        // if the user gets this far we know that user has successfully submitted the correct code
        // update the codeValid to false
        ref.update({ codeValid: false });
        
        // generate our custom json token and needs an ID of the user
        admin.auth().createCustomToken(phone)
          .then(token => res.send({ token: token }));
      });
    })
    .catch((err) => res.status(422).send({ error: err }))
}