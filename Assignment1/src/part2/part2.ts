import * as R from "ramda";
import { pipe } from "ramda";

const stringToArray = R.split("");
/* Question 1 */

export const countLetters: (s: string) => {} = (s) => {
    return R.countBy(R.toLower)((stringToArray(s).reduce((acc: string[], curr) => 
    curr === ' '? acc : R.append(curr, acc), [])))
}


/* Question 2 */
const arrWithoutLetters: (arr: string[]) => string[] = (arr) => 
    arr.filter(curr => 
    curr === '{' || curr === '}' || curr === '(' || curr === ')' || curr === '[' || curr === ']')   

const arrToStr: (arr: string[]) => (string) = (arr) => arr.reduce((acc, curr) =>  acc + curr, "")


const helper = pipe(
    (s: string) => stringToArray(s),
    (arr: string[]) => arrWithoutLetters(arr),
    (arr2: string[]) => arrToStr(arr2)
);

export const isPaired: (s: string) => boolean = (s) => 
    s.length === 0 || helper(s).length === 0? true :
    helper(s).includes('()')? isPaired(R.replace('()', '', helper(s))) :
    helper(s).includes('[]')? isPaired(R.replace('[]', '', helper(s))) :
    helper(s).includes('{}')? isPaired(R.replace('{}', '', helper(s))) : false

/* Question 3 */
export type WordTree = {
    root: string;
    children: WordTree[];
}

export const treeToSentence = (t: WordTree): string => 
    t.children.reduce((acc, curr) => acc + " " + treeToSentence(curr), t.root)