//firebase-server.js
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Endpoint para enviar notificaciones
app.post('/send-notification', async (req, res) => {
  const { registrationToken, title, body } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    token: registrationToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Mensaje enviado:', response);
    res.status(200).send({ success: true, message: 'Notificación enviada correctamente' });
  } catch (error) {
    console.error('Error enviando la notificación:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
