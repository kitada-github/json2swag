# json2swag

JSON を Swagger-PHP アノテーションに変換する CLI スクリプト

## description

```
Usage: json2swag [options]

Options:
  -a, --attr <attributes>  アトリビュート指定(get/schema) (default: "get")
  -h, --help               display help for command
```

## Requirement

* Node.js
* (tsc)
    * TypeScript コンパイラ
    * トランスパイルする場合必要

## Transpile

```
$ tsc json2swag.ts
```


## Usage

標準入力で JSON を渡す.

```bash
$ echo '{"int_val": 123, "str_val": "文字列", "obj_val": {"k1": 123, "k2": false} }'  | node json2swag.js

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
    *             description="DESCRIPTION",
    *             @OA\Property(
    *                 property="int_val",
    *                 type="integer",
    *                 description="DESCRIPTION",
    *             ),
    *             @OA\Property(
    *                 property="str_val",
    *                 type="string",
    *                 description="DESCRIPTION",
    *             ),
    *             @OA\Property(
    *                 property="obj_val",
    *                 type="object",
    *                 description="DESCRIPTION",
    *                 @OA\Property(
    *                     property="k1",
    *                     type="integer",
    *                     description="DESCRIPTION",
    *                 ),
    *                 @OA\Property(
    *                     property="k2",
    *                     type="bool",
    *                     description="DESCRIPTION",
    *                 ),
    *             ),
    *         ),
    *     ),
    * );
    */
```