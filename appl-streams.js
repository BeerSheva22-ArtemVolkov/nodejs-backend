import http from 'node:http'
import config from 'config'
import { URL } from 'node:url'
import RouterDocText from './routes/Router.js';
import { DocTextView } from './view/DocTextView.js';

const SERVER_PORT = 'server.port';
const server = http.createServer();
const port = process.env.PORT || (config.has(SERVER_PORT) && config.get(SERVER_PORT)) || 0
const docTextView = new DocTextView();

server.listen(port, () => {
    console.log(`server is listening on port ${server.address().port}`);
})

const router = new RouterDocText(server);

server.on('request', (req, response) => {
    response.setHeader('content-type', 'text/html')
    const request = new URL(`http://${req.headers.host}${req.url}`);
    if (!router.getRoutes().includes(request.pathname)){
        docTextView.renderError(`${request.pathname} unsupported operation`, response)
        return
    }
    const file = request.searchParams.get('file');
    console.log(`requset type: ${request.pathname}`);
    console.log(`file name is: ${file}`);
    server.emit(request.pathname, request.searchParams, response);
})