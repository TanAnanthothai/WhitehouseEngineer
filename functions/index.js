/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendHighscoreNotification = functions.database.ref('/highscores/{lat}/{long}/top').onWrite(event => {
    const lat = event.params.lat;
    const long = event.params.long;

    console.log('Someone has scored a new high score at lat: ', lat, ' long: ', long,' with score: ', event.data.val());

    // Get the list of all player
    const allPastPlayers = admin.database().ref(`/highscores/${lat}/${long}/recentPlayers`).once('value').then(function(result){
        const pastPlayers = result.val();
        var allNotificationID = [];

        for(var i = 1;i < pastPlayers.length+1; i++){
            console.log(pastPlayers[i]);
            allNotificationID.push(admin.database().ref(`/users/${pastPlayers[i]}/notification`).once('value'));
        }
        return Promise.all(allNotificationID).then(function(results){
            // Notification details.
            const payload = {
                notification: {
                    title: 'The ranking has changed',
                    body: 'Someone has scored a higher score in the area you recently played!',
                    icon: 'images/icons/apple-icon-180x180.png'
                }
            };

            var allTokens = [];
            // console.log(results);
            for(var i = 0;i < results.length; i++){
                // console.log(results[i]);
                // console.log(results[i].val());
                if(results[i].val() !== null && results[i].val() !== undefined)
                    allTokens.push.apply(allTokens, Object.keys(results[i].val()));
            }
            // Send notifications to all tokens.
            console.log('displaying all tokens');
            console.log(allTokens);
            return admin.messaging().sendToDevice(allTokens, payload).then(function(response){
                console.log('sendtodevice being called');
                // For each message check if there was an error.
                const tokensToRemove = [];
                response.results.forEach((result, index) => {
                    console.log(result);
                    const error = result.error;
                    if (error) {
                        console.error('Failure sending notification to', allTokens[index], error);
                        // Cleanup the tokens who are not registered anymore.
                        if (error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered') {
                            // tokensToRemove.push(allNotificationID.ref.child(allTokens[index]).remove());
                            console.log('will attempt to remove token');
                        }
                    }
                });
                return Promise.all(tokensToRemove);
            });
        });
    });
});