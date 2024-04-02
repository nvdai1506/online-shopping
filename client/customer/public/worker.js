// const HOST_DOMAIN = 'http://localhost:8080';
// const CLIENT_DOMAIN = 'http://localhost:3001'
// const HOST_DOMAIN = 'https://nvd-shopping-online.onrender.com'
// const CLIENT_DOMAIN = 'https://react-project-a389a.web.app'
const HOST_DOMAIN = 'https://api.nv-dai.com'
const CLIENT_DOMAIN = 'https://nv-dai.com'


console.log("Service Worker Loaded...");
self.addEventListener("push", e => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }
  const data = e.data.json();
  const { title, message, tag, productId } = data;
  e.waitUntil(
    self.registration.showNotification(title, {
      body: message + '\n Thông báo từ NVD Shop.',
      icon: `${CLIENT_DOMAIN}/images/favicon.png`,
      tag: tag,
      data: productId
    })
  );
});
self.addEventListener('notificationclick', (event) => {
  const { tag, data } = event.notification;
  if (tag === 'voucher') {
    clients.openWindow(CLIENT_DOMAIN);
  } else if (tag === 'sale') {
    clients.openWindow(`${CLIENT_DOMAIN}/product/${data}`);
  }
});