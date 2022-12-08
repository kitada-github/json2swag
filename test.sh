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
        exit 1
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
input='{"key1": "string_v", "key2": 1}'
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
    *                 property="key1",
    *                 type="string",
    *             ),
    *             @OA\Property(
    *                 property="key2",
    *                 type="integer",
    *             ),
    *         ),
    *     ),
    * );
    */
DOC
)
test_func $input $expected $no

echo "OK"
