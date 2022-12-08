import * as fs from 'fs';

function main(): void {
    const input = fs.readFileSync("/dev/stdin", "utf8");
    const obj = JSON.parse(input);


    console.log(obj);
}


main();