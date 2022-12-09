result=0
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
        result=1
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
    *             description="DESCRIPTION",
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
    *             description="DESCRIPTION",
    *             @OA\Property(
    *                 property="stringKey",
    *                 type="string",
    *                 description="DESCRIPTION",
    *             ),
    *             @OA\Property(
    *                 property="numberKey",
    *                 type="integer",
    *                 description="DESCRIPTION",
    *             ),
    *             @OA\Property(
    *                 property="boolKey",
    *                 type="bool",
    *                 description="DESCRIPTION",
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
    *             description="DESCRIPTION",
    *             @OA\Property(
    *                 property="arrKara",
    *                 type="array",
    *                 description="DESCRIPTION",
    *                 @OA\Items(
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="arrInt",
    *                 type="array",
    *                 description="DESCRIPTION",
    *                 @OA\Items(
    *                     type="integer",
    *                     description="DESCRIPTION",
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="arrObj",
    *                 type="array",
    *                 description="DESCRIPTION",
    *                 @OA\Items(
    *                     @OA\Property(
    *                         property="ik",
    *                         type="integer",
    *                         description="DESCRIPTION",
    *                     ),
    *                     @OA\Property(
    *                         property="sk",
    *                         type="string",
    *                         description="DESCRIPTION",
    *                     ),
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="arrNest",
    *                 type="array",
    *                 description="DESCRIPTION",
    *                 @OA\Items(
    *                     type="array",
    *                     description="DESCRIPTION",
    *                     @OA\Items(
    *                         type="integer",
    *                         description="DESCRIPTION",
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

# 4
no=4
input=$(
    cat <<DOC
{
    "obj": {
        "k1_1": "string",
        "k1_2": 111
    },
    "obj2": {
        "obj2_obj":{
            "k2_1": "hoge",
            "k2_2": 222
        }
    }
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
    *             description="DESCRIPTION",
    *             @OA\Property(
    *                 property="obj",
    *                 type="object",
    *                 description="DESCRIPTION",
    *                 @OA\Property(
    *                     property="k1_1",
    *                     type="string",
    *                     description="DESCRIPTION",
    *                 ),
    *                 @OA\Property(
    *                     property="k1_2",
    *                     type="integer",
    *                     description="DESCRIPTION",
    *                 ),
    *             ),
    *             @OA\Property(
    *                 property="obj2",
    *                 type="object",
    *                 description="DESCRIPTION",
    *                 @OA\Property(
    *                     property="obj2_obj",
    *                     type="object",
    *                     description="DESCRIPTION",
    *                     @OA\Property(
    *                         property="k2_1",
    *                         type="string",
    *                         description="DESCRIPTION",
    *                     ),
    *                     @OA\Property(
    *                         property="k2_2",
    *                         type="integer",
    *                         description="DESCRIPTION",
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

# 5
no=5
input=$(
    cat <<DOC
[
    {
        "xxx": 123,
        "yyy": "hoge"
    },
    {
        "xxx": 789,
        "yyy": "fuga"
    }
]
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
    *             type="array",
    *             description="DESCRIPTION",
    *             @OA\Items(
    *                 @OA\Property(
    *                     property="xxx",
    *                     type="integer",
    *                     description="DESCRIPTION",
    *                 ),
    *                 @OA\Property(
    *                     property="yyy",
    *                     type="string",
    *                     description="DESCRIPTION",
    *                 ),
    *             ),
    *         ),
    *     ),
    * );
    */
DOC
)
test_func $input $expected $no


if [ $result -eq 0 ]; then
    echo "OK"
fi
