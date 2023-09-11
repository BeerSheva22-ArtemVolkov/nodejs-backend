// import { PromptAsync } from "./PromptAsync.js";

export class PromptHandler {
    constructor(promptAsyncObject){
        promptAsyncObject.on('close', () => console.log('all data have been saved'));
        promptAsyncObject.on('positive', (n) => console.log(`Yoh have entered ${n}`));
    }
} 

// export const promptAsync = new PromptAsync();

// promptAsync.on('close', () => console.log('all data has been saved'));