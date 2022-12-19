"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var fs = require("fs");
var commander_1 = require("commander");
var getHead = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n   /**\n    * @return array\n    * @OAGet(\n    *     path=\"xxx\",\n    *     summary=\"SUMMARY\",\n    *     description=\"DESCRIPTION\",\n    *     @OAResponse(\n    *         response=\"200\",\n    *         description=\"\u6210\u529F\u6642\",\n    *         @OAJsonContent(\n"], ["\n   /**\n    * @return array\n    * @OA\\Get(\n    *     path=\"xxx\",\n    *     summary=\"SUMMARY\",\n    *     description=\"DESCRIPTION\",\n    *     @OA\\Response(\n    *         response=\"200\",\n    *         description=\"\u6210\u529F\u6642\",\n    *         @OA\\JsonContent(\n"])));
var getFoot = String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    *         ),\n    *     ),\n    * );\n    */\n"], ["\n    *         ),\n    *     ),\n    * );\n    */\n"])));
var schemaHead = String.raw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n   /**\n    * @OASchema(\n    *     schema=\"SCHEMA\",\n"], ["\n   /**\n    * @OA\\Schema(\n    *     schema=\"SCHEMA\",\n"])));
var schemaFoot = String.raw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    * );\n    */\n"], ["\n    * );\n    */\n"])));
var description = "description=\"DESCRIPTION\",";
function main() {
    // コマンドラインオプション処理
    commander_1.program.option("-a, --attr <attributes>", 'アトリビュート指定(get/schema)', 'get');
    commander_1.program.parse();
    var options = commander_1.program.opts();
    var head = '';
    var foot = '';
    var indent = 3; // 深さ
    switch (options.attr) {
        case 'get':
            head = getHead;
            foot = getFoot;
            indent = 3;
            break;
        case 'schema':
            head = schemaHead;
            foot = schemaFoot;
            indent = 1;
            break;
        default:
            throw "invalid attr : ".concat(options.attr);
            break;
    }
    // JSON パース
    var input = fs.readFileSync("/dev/stdin", "utf8");
    var obj = JSON.parse(input);
    var contents = head;
    var type = decideType(obj);
    if (type === 'object') {
        contents += indentText('type="object",', indent) + '\n';
        contents += indentText(description, indent);
        for (var property in obj) {
            contents += "\n";
            contents += parseJson(property, obj[property], true, indent);
        }
    }
    else if (type === 'array') {
        contents += indentText('type="array",', indent) + '\n';
        contents += indentText(description, indent);
        contents += "\n";
        contents += parseArray(obj, indent - 1);
    }
    else {
        throw 'invalid top type';
    }
    contents += foot;
    console.log(contents);
}
function parseArray(array, indent) {
    var contents = '';
    contents += indentText(String.raw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["@OAItems("], ["@OA\\Items("]))), indent + 1);
    if (array.length > 0) {
        var first = array[0];
        if (decideType(first) === 'object') {
            for (var property in first) {
                contents += "\n";
                contents += parseJson(property, first[property], true, indent + 2);
            }
            contents += "\n";
        }
        else if (decideType(first) === 'array') {
            // array の場合はネストが1段浅くなる
            contents += "\n";
            contents += parseJson('', first, false, indent + 1);
        }
        else {
            contents += "\n";
            contents += indentText("type=\"".concat(decideType(first), "\","), indent + 2) + "\n";
            contents += indentText(description, indent + 2) + "\n";
        }
        contents += indentText("),", indent + 1);
    }
    else {
        // 配列要素なし
        contents += '\n';
        contents += indentText("),", indent + 1);
    }
    return contents;
}
function parseJson(property, value, requireProp, indent) {
    var contents = '';
    var type = decideType(value);
    if (requireProp) {
        contents += indentText(String.raw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["@OAProperty("], ["@OA\\Property("]))), indent) + "\n";
    }
    if (property !== '') {
        contents += indentText("property=\"".concat(property, "\","), indent + 1) + "\n";
    }
    contents += indentText("type=\"".concat(type, "\","), indent + 1) + "\n";
    contents += indentText(description, indent + 1) + "\n";
    if (type === 'array') {
        contents += parseArray(value, indent);
        contents += '\n';
    }
    else if (type === 'object') {
        for (var childProp in value) {
            contents += parseJson(childProp, value[childProp], true, indent + 1);
            contents += "\n";
        }
    }
    if (requireProp) {
        contents += indentText('),', indent);
    }
    return contents;
}
function indentText(str, indent) {
    var s = '';
    for (var i = 0; i < indent; i++) {
        s += '    ';
    }
    var space = '    * ' + s;
    return space + str;
}
function decideType(value) {
    var res = '';
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
            throw 'invalid type';
    }
    return res;
}
main();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
