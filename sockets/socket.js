const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado } = require('../controllers/socket');


//Mensajes de Sockets
io.on('connection', (client) => {

    console.log('Cliente conectado');

    // Verifica la autenticación
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    //Cliente autenticado
    usuarioConectado(uid);


    if (!valido) { return client.disconnect(); }

    console.log('cliente autenticado');

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

});