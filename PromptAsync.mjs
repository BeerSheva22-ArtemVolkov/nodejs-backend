import readline from "node:readline";
import EventsEmitter from 'node:events'

const readLineInterface = readline.createInterface({
    input: process.stdin, // Чтение
    output: process.stdout // Запись
})

readLineInterface.on('SIGINT', () => {
    console.log(`^C is forbidden`);
})

export class PromptAsync extends EventsEmitter {

    prompt(promptStr) {
        return new Promise(resolve => {
            readLineInterface.question(promptStr + '----->', answer => {
                resolve(answer);
            })
        })
    }

    close() {
        this.emit('close');
        readLineInterface.close();
    }

    async readObject(promptStr, mapper) {
        let running;
        let res;
        do {
            running = false;
            try {
                const answer = await this.prompt(promptStr);
                if (answer === 'cancel'){
                    // this.emit('close');
                    readLineInterface.pause();
                } else {
                    res = mapper(answer);
                }
            } catch (error) {
                console.log(error);
                running = true;
            }
        } while (running);
        return res;
    }

    #mapperNumber(answer, min, max) {
        const num = +answer;
        if (isNaN(num)) {
            throw `${answer} is NaN`
        }
        if (num < min) {
            throw `${num} must not be less than ${min}`
        }
        if (num > max) {
            throw `${num} must not be greater than ${max}`
        }
        return num;
    }

    readNumber(promptStr, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
        return this.readObject(promptStr, answer => this.#mapperNumber(answer, min, max))
    }

    readPredicate(promptStr, errorPrompt, predicate) {
        return this.readObject(promptStr, answer => {
            if (!predicate(answer)) {
                throw errorPrompt;
            }
            return answer;
        })
    }

}