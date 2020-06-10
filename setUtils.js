function isSuperset(a, b) {
    for (const item of b) {
        if (!a.has(item)) return false;
    }
    return true;
}
function union(a, b) {
    let unionSet = new Set();
    for (const item of a) unionSet.add(item);
    for (const item of b) unionSet.add(item);
    return unionSet;
}
function intersection(a, b) {
    let intersectionSet = new Set();
    for (const item of a) {
        if (b.has(item)) intersectionSet.add(item);
    }
    return intersectionSet;
}