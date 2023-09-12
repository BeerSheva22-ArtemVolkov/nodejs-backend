import fs from 'node:fs/promises'; // файловая с истема?
import http from 'node:http'

// streams theory:
// writable stream (write) Output stream
// readable stream (read)  Input stream
// duplex (write, read) TCP socket
// transform ZipLibrary
// Examples: 
//      <readable stream>.pipe(<writable stream>)
//      <socket stream>.map<req => protocol.getResponse(req)>.pipe(<socket stream>)
// pipeline(<readable stream>, <transform stream>, <writable stream>)


const isComment = process.argv[2] == "comments";
const fileInput = process.argv[3] || 'appl-streams.js';
const fileOutput = process.argv[4] || 'appl-streams-out';

const handlerInput = await fs.open(fileInput); // await тк это промис
const handlerOutput = await fs.open(fileOutput, 'w'); // 'w' - переписать/создать
const streamOutput = handlerOutput.createWriteStream();

// handlerInput.readFile('utf-8').then(data => console.log(data));  // вывод без стримов
getStringWith(handlerInput, isComment)
    // .forEach(line => console.log(line))
    .pipe(streamOutput);


function getStringWith(handler, isComments) {
    let streamInput = handler.createReadStream();
    streamInput.setEncoding('utf-8');
    streamInput = streamInput.flatMap(chunk => chunk.split('\n'))
        .filter(line => {
            const res = line.trim().startsWith('//')
            return isComments ? res : !res;
        })
        .map(line => isComments ? line.substr('//') : line);
    return streamInput;
}
