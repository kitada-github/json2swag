function test_func() {
    input=$1
    expected=$2

    output=$(echo "$input" | node json2swag.js)
    if [ $output != $expected ]; then
        echo "NG"
        echo "expected: $expected"
        echo "output: $output"
        exit 1
    fi
}

# トランスパイル
tsc json2swag.ts

# 1
input='{}'
expected=`cat << DOC

   /**
    * @return array
    * @OA\Get(
    *      path="xxx",
    *      summary="SUMMARY",
    *      description="DESCRIPTION",
    *      @OA\Response(
    *          response="200",
    *          description="成功時",
    *          @OA\JsonContent(
    *              type="object",
    *          ),
    *      ),
    * );
    */
DOC
`

test_func $input $expected

echo "OK"
