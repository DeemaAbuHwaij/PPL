import { makeOk, Result, isOk } from "../shared/result";
import { map } from "ramda";
import parse from "s-expression";
import { makeIfExp, makeDefineExp, makeProcExp, isCondExp, isIfExp, makeLetExp, makeProgram, unparseL31, parseL31CExp, CExp, isAppExp, CondExp, makeNumExp,
    isDefineExp, isProcExp, isEClause, isProgram, isExp, makeAppExp, Exp, IfExp, makeCondExp, isLetExp, isCExp, isAtomicExp, isLitExp, Program, } from "./L31-ast";

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (e: Exp | Program): Result<Exp | Program> =>
    isProgram(e) ? makeOk(makeProgram(map(TransformExpC, e.exps))) :
    isExp(e) ? makeOk(TransformExpC(e)) :
    e;

const TransformExpC = (e: Exp): Exp =>
    isDefineExp(e) ? makeDefineExp(e.var, TransformCExpC(e.val)) :
    isCExp(e) ? TransformCExpC(e) :
    e;

const TransformCExpC = (e: CExp): CExp => 
    isProcExp(e) ? makeProcExp(e.args, map(TransformCExpC, e.body)) :
    isAtomicExp(e) ? e :
    isAppExp(e) ? makeAppExp(TransformCExpC(e.rator), map(TransformCExpC, e.rands)) :
    isIfExp(e) ? makeIfExp(TransformCExpC(e.test), TransformCExpC(e.then), TransformCExpC(e.alt)) :
    isCondExp(e) ? TransformCExpC(Transform2if(e)) :
    isLitExp(e) ? e :
    isEClause(e) ? e.then :
    isLetExp(e) ? makeLetExp(e.bindings, e.body) :
    e;

export const Transform2if = (e: CondExp): IfExp => { 
    if(e.cclauses.length > 1)
        return  makeIfExp(e.cclauses[0].test, e.cclauses[0].then[0], makeCondExp(e.cclauses.slice(1), e.eClause));
    else
        return makeIfExp(e.cclauses[0].test, e.cclauses[0].then[0], fix(e.eClause.then))
};

const fix = (e : CExp): CExp => {
    const  fixed = parseL31CExp(parse(unparseL31(e).slice(1, -2)))
    if(isOk(fixed))
        return fixed.value
    return makeNumExp(5)
}
