
'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');



const routes = require('./routes/index');


const server = Hapi.server({
    port: (process.env.PORT || 3000),
    routes: {
        log: {
            collect: true,
        },
        cors: {
            origin: ['*'],
            credentials: true,
            additionalHeaders: ['accept-language', 'accept-encoding', 'access-control-request-headers', 'x-access-token'],
        },
        validate: {
            async failAction(request, h, err) {
                request.log('validationError', err.message);

                throw err;
            },
        },
    },
});

const init = async () => {

    // await server.register([...routes]);
    server.route(routes);

    await server.start();
    server.log('info', `Server running at: ${server.info.uri}`);
};

module.exports = server;

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
