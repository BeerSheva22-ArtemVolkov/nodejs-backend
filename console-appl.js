import promptSync from 'prompt-sync';
import config from 'config'

const prompt = promptSync({ sigint: true });
const guessNumber = 1 + Math.trunc(Math.random() * 10);

if (config.has('test') && config.get('test')){
    console.log(guessNumber);
}

let running = true;

do {
    let num = prompt("Guess number from 1 to 10 -->");
    if (num == guessNumber) {
        running = false;
        console.log('congrats');
    } else {
        console.log('Wrong! Try again');
    }

} while (running)