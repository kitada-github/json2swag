import * as fs from 'fs';
import { parse } from 'path';

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

    for(const property in obj){
        contents += parseJson(property, obj[property], indent);
    }

    contents += foot;

    console.log(contents);
}

function parseJson(property: string, value: any, indent: number): string {
    let contents = '';
    const type = decideType(value);

    contents += "\n";
    contents += addSpace(String.raw`@OA\Property(`, indent)  + "\n";
    contents += addSpace(`property="${property}",`, indent + 1) + "\n";
    contents += addSpace(`type="${type}",`, indent + 1) + "\n";

    if (type === 'array') {
        contents += addSpace(String.raw`@OA\Items(`, indent + 1);
        contents += "\n";
        if (value.length > 0) {
            contents += addSpace(`type="${decideType(value[0])}",`, indent + 2);
            contents += "\n";
        }
        contents += addSpace(`),`, indent + 1);
        contents += "\n";

    } else if (type === 'object') {
        for (const childProp in value) {
            contents += parseJson(childProp, value[childProp], indent + 1);
            contents += "\n";
        }
    }
    contents += addSpace('),', indent);
    return contents;
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
        case 'object':
            res = Array.isArray(value) ? 'array' : 'object';
            break;
        default:
            throw 'invalid type'
    }
    return res;
}


main();