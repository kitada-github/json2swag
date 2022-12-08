import * as fs from 'fs';

const head = String.raw`
   /**
    * @return array
    * @OA\Get(
    *     path="xxx",
    *     summary="SUMMARY",
    *     description="DESCRIPTION",
    *     @OA\Response(
    *         response="200",
    *         description="成功時",
    *         @OA\JsonContent(
    *             type="object",`;

const foot = String.raw`
    *         ),
    *     ),
    * );
    */
`;

function main(): void {
    const input = fs.readFileSync("/dev/stdin", "utf8");
    const obj = JSON.parse(input);
    let contents: string = head;
    let indent = 3;    // 深さ

    for (const key in obj) {
        const property = key;
        const type = decideType(obj[property]);

        contents += "\n";
        contents += addSpace(String.raw`@OA\Property(`, indent);
        contents += "\n";
        contents += addSpace(`property="${property}",`, indent + 1);
        contents += "\n";
        contents += addSpace(`type="${type}",`, indent + 1);
        contents += "\n";
        contents += addSpace('),', indent);

    }

    contents += foot;


    console.log(contents);
}

function addSpace(str: string, indent: number): string {
    let s = '';
    for (let i = 0; i < indent; i++) {
        s += '    ';
    }
    const space = '    * ' + s;

    return space + str;
}

function decideType(value: any): string {
    let res = '';
    switch (typeof (value)) {
        case 'string':
            res = 'string';
            break;
        case 'number':
            res = 'integer';
            break;
        case 'boolean':
            res = 'bool';
            break;
        default:
            throw 'invalid type'
    }
    return res;
}


main();