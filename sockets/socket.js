const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


//Mensajes de Sockets
io.on('connection', (client) => {

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    // Verifica la autenticación
    if (!valido) { return client.disconnect(); }

    //Cliente autenticado
    usuarioConectado(uid);

    //ingresar al usuario a una sala en particular
    client.join(uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        //TODO: Grabar mensaje
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });



    console.log('cliente autenticado');

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

});
