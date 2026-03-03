// Improved error handling and debugging for Firebase notifications

import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/messaging';

const Notifications = () => {
  useEffect(() => {
    const messaging = firebase.messaging();

    const requestPermission = async () => {
      try {
        await Notification.requestPermission();
        console.log('Notification permission granted.');
      } catch (error) {
        console.error('Permission request failed:', error);
      }
    };

    const receiveMessage = (payload) => {
      console.log('Message received. ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
      };

      new Notification(notificationTitle, notificationOptions);
    };

    (async () => {
      await requestPermission();
      messaging.onMessage((payload) => {
        try {
          receiveMessage(payload);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });
    })();
  }, []);

  return <div>Notifications Component</div>;
};

export default Notifications;