/* eslint-disable eol-last */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {google} = require('googleapis');
const app = require('express')();

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

admin.initializeApp();

// End-point que recebe a requisição e chama o metodo de gerar token
app.get('/fcm-oauth-token', function(request, response) {
  const auth = request.headers['auth'];
  getAccessToken(auth)
      .then(function(token) {
        response.json({
          result: token,
        });
      })
      .catch(function(erro) {
        response.json({
          result: erro,
        });
      });
});

// Metodo utilizado para gerar de token Oauth2 Google Apis
// Predefinido token que utilizacao para envio de cloud messaging
function getAccessToken(auth) {
  const key = require('./client_secret_key.json');

  return new Promise(function(resolve, reject) {
    if (auth && auth != key.private_key_id) {
      reject('auth inside headers should be private key id');
      return;
    }

    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
    );

    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
exports.api = functions.https.onRequest(app);