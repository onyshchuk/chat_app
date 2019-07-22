const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
   '#location-message-template'
).innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
});

const autoscroll = () => {
   // New message element
   const $newMessage = $messages.lastElementChild;

   // Height of the new message
   const newMessageStyles = getComputedStyle($newMessage);
   const newMessageMargin = parseInt(newMessageStyles.marginBottom);
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

   // Visible height
   const visibleHeight = $messages.offsetHeight;

   // Height of messages container
   const containerHeight = $messages.scrollHeight;

   // How far have I scrolled
   const scrollOfset = $messages.scrollTop + visibleHeight;

   if (containerHeight - newMessageHeight <= scrollOfset) {
      $messages.scrollTop = $messages.scrollHeight;
   }
};

socket.on('message', message => {
   const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a'),
   });
   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
});

socket.on('locationMessage', message => {
   const html = Mustache.render(locationMessageTemplate, {
      username: message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format('h:mm a'),
   });
   object;
   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
});

socket.on('roomData', ({ room, users }) => {
   const html = Mustache.render(sidebarTemplate, { room, users });
   document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', e => {
   e.preventDefault();

   $messageFormButton.setAttribute('disabled', 'disabled');

   const message = e.target.elements.message.value;
   socket.emit('sendMessage', message, err => {
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value = '';
      $messageFormInput.focus();

      if (err) return console.log(err);

      console.log('Message delivered');
   });
});

$sendLocationButton.addEventListener('click', () => {
   if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser.');
   }

   $sendLocationButton.setAttribute('disabled', 'disabled');

   navigator.geolocation.getCurrentPosition(position => {
      $sendLocationButton.removeAttribute('disabled');

      socket.emit(
         'sendLocation',
         {
            lat: position.coords.latitude,
            long: position.coords.longitude,
         },
         () => {
            console.log('Location shared!');
         }
      );
   });
});

socket.emit('join', { username, room }, error => {
   if (error) {
      alert(error);
      location.href = '/';
   }
});
