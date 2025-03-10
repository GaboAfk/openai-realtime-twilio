// Importar la biblioteca de Janus
const Janus = require('janus-gateway-js');

// Inicializar Janus
let janus = new Janus({
    server: 'http://localhost:8088/janus', // Cambia esto a la dirección de tu servidor Janus
    success: function() {
        // Aquí puedes crear un nuevo plugin de SIP
        janus.attach({
            plugin: 'janus.plugin.sip',
            success: function(pluginHandle) {
                // Guardar el handle del plugin
                sipPlugin = pluginHandle;
                // Aquí puedes manejar la lógica de SIP
            },
            error: function(error) {
                console.error('Error al adjuntar el plugin SIP:', error);
            },
            onmessage: function(msg, jsep) {
                console.log("Mensaje recibido: ", msg);
                if (jsep !== undefined && jsep !== null) {
                    pluginHandle.handleRemoteJsep({ jsep: jsep });
                }
                // Manejar los mensajes de Janus
            },
            onlocalstream: function(stream) {
                // Manejar el stream local
            },
            onremotestream: function(stream) {
                // Manejar el stream remoto
            },
            oncleanup: function() {
                console.log('Cleanup!');
            }
        });
    },
    error: function(error) {
        console.error('Error al inicializar Janus:', error);
    }
});