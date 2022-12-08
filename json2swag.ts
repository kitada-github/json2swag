import * as fs from 'fs';

const head = String.raw`
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
    *              type="object",`;

const foot = String.raw`
    *          ),
    *      ),
    * );
    */
`;

function main(): void {
    const input = fs.readFileSync("/dev/stdin", "utf8");
    const obj = JSON.parse(input);
    let res : string = head;

    for(const key in obj){

    }

    res += foot;


    console.log(res);
}


main();