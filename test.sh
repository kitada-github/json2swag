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

# 1
input='[1, 2, 3]'
expected='[ 1, 2, 3 ]'
test_func $input $expected

echo "OK"
