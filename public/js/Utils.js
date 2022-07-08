export function transformInArray(Obj) {
    if (!Array.isArray(Obj)) {
        return [Obj];
    }
    return Obj;
}

export function ObjIs(test, Obj) {
    if (test instanceof Obj) {
        return true;
    }
    return false;

    if (typeof test === 'object' && Object.getPrototypeOf(test).isPrototypeOf(Obj)) {
        return true;
    }
    return false;
}