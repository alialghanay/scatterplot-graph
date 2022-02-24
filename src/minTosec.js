export default function minToSec(min){
    const minArr = min.split(":");
    const minToInt = parseInt(minArr[0]) * 60;
    const secToInt = parseInt(minArr[1]);
    const result = minToInt + secToInt;
    return result;
}