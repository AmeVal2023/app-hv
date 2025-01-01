importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
// Inicializa Firebase App
firebase.initializeApp({
  apiKey: "AIzaSyDGzm1KSNZ6bGEiYf2AZcOT7FSc0U7eMXQ",
  authDomain: "hormonavida.firebaseapp.com",
  projectId: "hormonavida",
  storageBucket: "hormonavida.firebasestorage.app",
  messagingSenderId: "89969549014",
  appId: "1:89969549014:web:99b7a09782d9d98730f377",
  measurementId: "G-TFP5BDHYL3",
});

const messaging = firebase.messaging();
