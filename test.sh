function test_func() {
    input=$1
    expected=$2
    no=$3

    output=$(echo "$input" | node json2swag.js)
    if [ $output != $expected ]; then
        echo "NG $no expected vs output"
        #echo "expected: $expected"
        #echo "output: $output"
        diff <(echo "$expected") <(echo "$output")
        echo "input: $input"
        echo "output: $output"
    fi
}

# トランスパイル
tsc json2swag.ts

# 1
no=1
input='{}'
expected=$(
    cat <<DOC

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
    *         ),
    *     ),
    * );
    */
DOC
)
test_func $input $expected $no

# 2
no=2
input='{"stringKey": "string_v", "numberKey": 1, "boolKey": false}'
expected=$(
    cat <<DOC

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
    *             @OA\Property(
    *                 property="stringKey",
    *                 type="string",
    *             ),
    *             @OA\Property(
    *                 property="numberKey",
    *                 type="integer",
    *             ),
    *             @OA\Property(
    *                 property="boolKey",
    *                 type="bool",
    *             ),
    *         ),
    *     ),
    * );
    */
DOC
)
test_func $input $expected $no

# 3
no=3
input=$(
    cat <<DOC
{
    "arrKara": [],
    "arrInt": [1, 2, 3],
    "arrObj": [
        {
            "ik": 100,
            "sk": "hoge"
        }
    ],
    "arrNest": [
        [
            100,
            200
        ]
    ]
}
DOC
)

expected=$(
    cat <<DOC

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
    *             @OA\Property(
    *                 property="arrKara",
    *                 type="array",
    *                 @OA\Items(
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="arrInt",
    *                 type="array",
    *                 @OA\Items(
    *                     type="integer",
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="arrObj",
    *                 type="array",
    *                 @OA\Items(
    *                     @OA\Property(
    *                         property="ik",
    *                         type="integer",
    *                     ),
    *                     @OA\Property(
    *                         property="sk",
    *                         type="string",
    *                     ),
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="arrNest",
    *                 type="array",
    *                 @OA\Items(
    *                     type="array",
    *                     @OA\Items(
    *                         type="integer",
    *                     ),
    *                 ),
    *             ),
    *         ),
    *     ),
    * );
    */
DOC
)
test_func $input $expected $no

