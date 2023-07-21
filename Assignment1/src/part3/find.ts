import { Result, makeFailure, makeOk, bind, either } from "../lib/result";

/* Library code */
const findOrThrow = <T>(pred: (x: T) => boolean, a: T[]): T => {
    for (let i = 0; i < a.length; i++) {
        if (pred(a[i])) return a[i];
    }
    throw "No element found.";
}




export const findResult = <T>(pred: (x: T) => boolean, a: T[]): Result<T> =>
    a.length === 0 ? makeFailure("No element found.") :
    pred(a[0]) ? makeOk(a[0]) :
    findResult(pred, a.filter((_, i) => i !== 0));


/* Client code */
const returnSquaredIfFoundEven_v1 = (a: number[]): number => {
    try {
        const x = findOrThrow(x => x % 2 === 0, a);
        return x * x;
    } catch (e) {
        return -1;
    }
}

export const returnSquaredIfFoundEven_v2 = (arr: number[]) : Result<number> => 
    bind(findResult((x: number) => x%2 == 0, arr), (x: number) => makeOk(x * x));

export const returnSquaredIfFoundEven_v3 = (arr: number[]) : number =>
    either(findResult(x => x%2 == 0, arr), x  => x*x, _ => -1)