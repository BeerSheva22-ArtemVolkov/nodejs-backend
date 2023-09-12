export const operations = new Map([
    ["/add", (a, b) => a + b],
    ["/subtract", (a, b) => a - b],
    ["/multiply", (a, b) => a * b],
    ["/divide", (a, b) => {
        if(b){
            return a / b;
        } else {
            throw "Error! You can't divide by 0";
        }
    }],
])