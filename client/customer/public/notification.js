

const publicVapidKey = 'BGA6DWy9kcp3ExfMLsRJX4XdfqU89KZenuIJy9zShBNFzb2B2aBRlFUOGLgRatB5T9xCRbGQYsUboERR7oZj1xY';
// const DOMAIN = 'http://localhost:8080';
// const DOMAIN = 'https://nvd-shopping-online.onrender.com';
const DOMAIN = 'https://api.nv-dai.com';


let notif = Notification.permission;
if (notif === 'default') {
  Notification.requestPermission()
    .then(permission => {
      if (permission === 'granted') {
        // Check for service worker
        if ("serviceWorker" in navigator) {
          send().catch(err => console.error(err));
        }
      }
    })
}

async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  navigator.serviceWorker.register("./worker.js", {
    scope: "/"
  }).then(function (reg) {
    var serviceWorker;
    if (reg.installing) {
      serviceWorker = reg.installing;
      console.log('Service worker installing');
    } else if (reg.waiting) {
      serviceWorker = reg.waiting;
      console.log('Service worker installed & waiting');
    } else if (reg.active) {
      serviceWorker = reg.active;
      console.log('Service worker active');
    }

    if (serviceWorker) {
      console.log("sw current state", serviceWorker.state);
      if (serviceWorker.state == "activated") {
        //If push subscription wasnt done yet have to do here
        console.log("sw already activated - Do watever needed here");
        subscribeForPushNotification(reg);
      }
      serviceWorker.addEventListener("statechange", function (e) {
        console.log("sw statechange : ", e.target.state);
        if (e.target.state == "activated") {
          // use pushManger for subscribing here.
          console.log("Just now activated. now we can subscribe for push notification")
          subscribeForPushNotification(reg);
        }
      });
    }
  },
    function (err) {
      console.error('unsuccessful registration with ', workerFileName, err);
    })


}
async function subscribeForPushNotification(reg) {
  // console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  // console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  await fetch(`${DOMAIN}/notification/subscribe`, {
    method: "POST",
    body: JSON.stringify({ subscription: subscription, topic: 'all' }),
    headers: {
      "content-type": "application/json"
    }
  });
  // console.log("Push Sent...");
}
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// function btnClick() {
//   fetch('/continue').then(result => {
//     console.log(result);
//   })
//     .catch(error => console.log(error));
// }

// console.log('notification');
// navigator.serviceWorker.reg("sw.js");
// setInterval(() => {
//   const showNotification = () => {
//     const notification = new Notification("Message from NVD!", {
//       body: 'New voucher for you',
//       icon: './favicon.png'
//     })
//     notification.onclick = (e) => {
//       window.location.href = 'http://localhost:3001';
//     }
//   }
//   const notif = Notification.permission;

//   if (notif === 'default') {
//     Notification.requestPermission()
//       .then(permission => {
//         console.log(permission);
//       })
//   }
//   if (notif === 'granted') {
//     showNotification();
//   }
// }, 5000);