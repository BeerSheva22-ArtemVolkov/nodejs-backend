import fs from 'node:fs/promises'

export default class DocTextService {

    async getDocumentation(openedFile) {
        return await this.#getStream(openedFile, true);
    }

    async getText(openedFile) {
        return await this.#getStream(openedFile, false);
    }

    async #getStream(openedFile, isDoc) {
        let streamInput = openedFile.createReadStream();
        streamInput.setEncoding('utf-8');
        streamInput = streamInput.flatMap(chunk => chunk.split('\n'))
            .filter(line => {
                const res = line.trim().startsWith('//')
                return isDoc ? res : !res;
            })
            .map(line => isDoc ? line.trim().substr(2) : line);
        return streamInput;
    }
}