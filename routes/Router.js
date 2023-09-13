import DocTextService from "../service/DocTextService.js";
import fs from 'node:fs/promises'
import { DocTextView } from "../view/DocTextView.js";

const docTextView = new DocTextView();

export default class RouterDocText {

    #docTextService;

    constructor(emitter) {
        this.#docTextService = new DocTextService();
        emitter.addListener('/doc', (searchParams, response) => this.documentation(searchParams, response));
        emitter.addListener('/text', (searchParams, response) => this.text(searchParams, response))
    }

    async documentation(searchParams, response) {
        const fileName = searchParams.get('file');
        if (!fileName) {
            docTextView.renderError(`argument "file" is missing`)
            return
        }
        console.log(`documentation route, file: ${fileName}`);
        try {
            const file = await fs.open(fileName);
            const stream = await this.#docTextService.getDocumentation(file);
            pipeResponse(stream, response);
        } catch (error) {
            docTextView.renderError(`file ${fileName} cannot be opened`, response);
        }
    }

    async text(searchParams, response) {
        const fileName = searchParams.get('file');
        if (!fileName) {
            docTextView.renderError(`argument "file" is missing`)
            return
        }
        console.log(`text route, file: ${fileName}`);
        try {
            const file = await fs.open(fileName);
            const stream = await this.#docTextService.getText(file);
            pipeResponse(stream, response);
        } catch (error) {
            docTextView.renderError(`file ${fileName} cannot be opened`, response);
        }
    }

    getRoutes() {
        return ["/doc", "/text"];
    }

}

function pipeResponse(readableStream, response) {
    readableStream.map(line => docTextView.renderLine(line)).pipe(response);
}