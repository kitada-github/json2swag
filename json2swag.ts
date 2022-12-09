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
    *             type="object",
`;

const foot = String.raw`
    *         ),
    *     ),
    * );
    */
`;

const description = `description="DESCRIPTION",`;

function main(): void {
    const input = fs.readFileSync("/dev/stdin", "utf8");
    const obj = JSON.parse(input);
    let contents: string = head;
    let indent = 3;    // 深さ

    contents += indentText(description, indent);
    const type = decideType(obj);
    if (type === 'object') {
        for (const property in obj) {
            contents += "\n";
            contents += parseJson(property, obj[property], true, indent);
        }
    } else if (type === 'array') {
        contents += "\n";
        contents += parseArray(obj, indent-1);
    } else {
        throw 'invalid top type'
    }

    contents += foot;

    console.log(contents);
}

function parseArray(array: any, indent: number): string {
    let contents = '';
    contents += indentText(String.raw`@OA\Items(`, indent + 1);
    if (array.length > 0) {
        const first = array[0];
        if (decideType(first) === 'object') {
            for (const property in first) {
                contents += "\n";
                contents += parseJson(property, first[property], true, indent + 2);
            }
            contents += "\n";
        } else if (decideType(first) === 'array') {
            // array の場合はネストが1段浅くなる
            contents += "\n";
            contents += parseJson('', first, false, indent + 1);
        } else {
            contents += "\n";
            contents += indentText(`type="${decideType(first)}",`, indent + 2) + "\n";
            contents += indentText(description, indent + 2) + "\n";
        }
    } else {
        // 配列要素なし
        contents += "\n";
    }
    contents += indentText(`),`, indent + 1);


    return contents;
}

function parseJson(property: string, value: any, requireProp: boolean, indent: number): string {
    let contents = '';
    const type = decideType(value);

    if (requireProp) {
        contents += indentText(String.raw`@OA\Property(`, indent) + "\n";

    }
    if (property !== '') {
        contents += indentText(`property="${property}",`, indent + 1) + "\n";
    }
    contents += indentText(`type="${type}",`, indent + 1) + "\n";
    contents += indentText(description, indent + 1) + "\n";

    if (type === 'array') {
        contents += indentText(String.raw`@OA\Items(`, indent + 1);
        if (value.length > 0) {
            const first = value[0];
            if (decideType(first) === 'object') {
                for (const property in first) {
                    contents += "\n";
                    contents += parseJson(property, first[property], true, indent + 2);
                }
                contents += "\n";
            } else if (decideType(first) === 'array') {
                // array の場合はネストが1段浅くなる
                contents += "\n";
                contents += parseJson('', first, false, indent + 1);
            } else {
                contents += "\n";
                contents += indentText(`type="${decideType(first)}",`, indent + 2) + "\n";
                contents += indentText(description, indent + 2) + "\n";
            }
        } else {
            // 配列要素なし
            contents += "\n";
        }
        contents += indentText(`),`, indent + 1);
        contents += "\n";

    } else if (type === 'object') {
        for (const childProp in value) {
            contents += parseJson(childProp, value[childProp], true, indent + 1);
            contents += "\n";
        }
    }
    if (requireProp) {
        contents += indentText('),', indent);
    }
    return contents;
}

function indentText(str: string, indent: number): string {
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