//
// FILE:        iOS_apn_push_NEW.js
// LANGUAGE:    JavaScript 
// DATE:        2016-03-15
// SUMMARY:     Support iOS and GCM push notifications
// ATTENTION:   This is a new version to use a ew push plugin installed 2016-03-15.
// DEPENDENCY:  Cordova "phonegap-plugin-push" plugin
//              https://github.com/phonegap/phonegap-plugin-push
// DEPENDENCY:  JavaScript function 'setPushToken' to assign token value to 
//              the 'pushtoken' variable used in index.html

 
/*global
    PushNotification, console, navigator, setPushToken, document
*/


// DOMAIN DEPENDENCE
var apiURL = "https://www.earlyarrival.org/php/";

// PushNotification object 
var push;

// Device status
var isDeviceReady = false;


// Handle registration with remote push service.
function pushRegistrationHandler(data) {
    if (data.registrationId) {
        console.log('PUSH Registration:  ID=' + data.registrationId);
        // Note: setPushToken is defined in index.html.
        setPushToken(data.registrationId);
    }
    console.log('PUSH Registration:  ' + JSON.stringify(data));
}


// Handle error with push notifications.
function pushErrorHandler(error) {
    console.log('PUSH Error:  ' + error);
}


// Handle receipt of new push notification from remote push service.
function pushNotificationHandler(data) {
    // Note:  There is support for title, badge count, sound, etc.
    console.log('PUSH Notification:  Message=' + data.message);
    console.log('PUSH Notification:  ' + JSON.stringify(data));
    navigator.notification.alert(data.message);
}


// Initialize the PushNotification object.
function initializePushNotification() {
    if (isDeviceReady) {
        console.log('PUSH:  Begin initialization of PushNotification object');
        push = PushNotification.init({
            "android": {"senderID": "1234567890"},
            "ios": {"alert": "true", "badge": "true", "sound": "true", "clearBadge": "true"},
            "windows": {}
        });       
        push.on('registration', pushRegistrationHandler);
        push.on('error', pushErrorHandler);
        push.on('notification', pushNotificationHandler);
        console.log('PUSH:  End initialization of PushNotification object');
    } else {
        setPushToken("none");
    }
}


// When device is ready, initialize handling of push notifications.
function onDeviceReady() {
    console.log('PUSH:  onDeviceReady handler function called');
    isDeviceReady = true;
    initializePushNotification();
}


// Register handler for 'deviceready' event.
document.addEventListener('deviceready', onDeviceReady, true);


console.log('PUSH:  ios_apn_push_NEW.js - At EOF');

//EOF

