import { WebSocketServer } from "ws";
// import PromptSync from "prompt-sync";
import { PromptAsync } from './PromptAsync.mjs'

// const promptSync = PromptSync();
const promptAsync = new PromptAsync();
const wss = new WebSocketServer({ port: 8080 })

wss.on('listening', () => {
    console.log(`Server is listening on port 8080`);
})

wss.on('connection', (ws, req) => {
    console.log(`connection from ${req.socket.remoteAddress} established`);
    ws.send('Hello ');
    ws.on('close', () => {
        console.log(`connection from ${req.socket.remoteAddress} closed`);
    })
    ws.on('message', async message => {
        // const answer = promptSync(message.toString())
        const messageString = message.toString();
        if (messageString.toLowerCase().startsWith('exit')){
            ws.close();
        }
        const answer = await promptAsync.prompt(messageString)
        ws.send(answer);
    })
})