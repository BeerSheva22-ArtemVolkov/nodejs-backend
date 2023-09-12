import CalculatorView from "../view/CalculatorView.js";

const view = new CalculatorView();

export default class CalculatorService {
    constructor(emitter, operations) {
        Array.from(operations.entries()).forEach(operation => {
            emitter.addListener(operation[0], (operands, response) => {
                try {
                    this.writeResult(operation[1](operands[0], operands[1]), response, false);
                } catch (e) {
                    this.writeResult(e, response, true)
                }
            })
        })
    }

    writeResult(result, response, status) {
        response.setHeader('content-type', 'text/html')
        response.write(view.getHtml(result, status));
        response.end();
    }
}