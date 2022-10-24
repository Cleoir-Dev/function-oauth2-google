'use strict';

/* eslint-disable eol-last */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {google} = require('googleapis');
const app = require('express')();
const key = require('./client_secret_key.json');
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

admin.initializeApp();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// End-point que recebe a requisição e chama o metodo de gerar token
app.get('/fcm-oauth-token', function(request, response) {
  getAccessToken()
      .then(function(token) {
        if (request.headers['auth'] === key.private_key_id) {
          response.json({
            result: token,
          });
        } else {
          response.json({
            result: 'auth inside headers should be private key id',
          });
        }
      })
      .catch(function(erro) {
        response.json({
          result: erro,
        });
      });
});

// Metodo utilizado para gerar de token Oauth2 Google Apis
// Predefinido token que utilizacao para envio de cloud messaging
function getAccessToken() {
  return new Promise(function(resolve, reject) {
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