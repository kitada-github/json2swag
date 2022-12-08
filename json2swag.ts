import * as fs from 'fs';

function main(): void {
    const input = fs.readFileSync("/dev/stdin", "utf8");
    console.log(input);
}


main();