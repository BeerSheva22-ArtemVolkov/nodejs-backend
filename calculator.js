import http from 'node:http'
import config from 'config'
import { URL, URLSearchParams } from 'url'
import { operations } from './config/operations.js';
import CalculatorService from './service/CalculatorService.js';

const server = http.createServer();
const port = process.env.PORT || config.has('server.port') && config.get('server.port') || 0;
const calculatorService = new CalculatorService(server, operations);

server.listen(port, () => console.log(`server is listening on port ${server.address().port}`))
server.on('request', (req, res) => {

    console.log(`url: ${req}`);
    const reqURL = new URL(`http://${req.headers.host}${req.url}`);
    console.log(`operation: ${reqURL.pathname}`);

    const operands = reqURL.searchParams;
    const op1 = +operands.get('op1');
    const op2 = +operands.get('op2');
    const pathname = reqURL.pathname;

    server.emit(pathname, [op1, op2], res);

})