import { readdirSync } from "fs";
/**
 * Converts an object into an array if it isnt one already
 * @param thing the thing that is either an array or a single object
 */
export const arrify = (thing) => thing instanceof Array ? thing : [thing];
/**
 * Flattens an array while keeping the good bits then expands it to a number
 * @param thing An array or object
 * @param dimensions how many arrays deep, ex: [[[]]] would be 3
 */
export const mulitpleArrify = (thing, dimensions) => {
    if (!(thing instanceof Array))
        return;
    let { dimensions: dim, topologyBreaks } = checkArrayTopology(thing);
    const flattened = thing.flat(Math.min(topologyBreaks.size > 0 ? Math.min(...[...topologyBreaks].map(tB => tB[0]).flat()) : 0, dim) - 1);
    let dim2 = checkArrayTopology(flattened).dimensions;
    if (dim2 > dimensions)
        throw `given dimension of ${dimensions} is less than the minimum dimension of given array ${dim2}`;
    let newFlattened = flattened;
    for (let i = dim2; i < dimensions + 1; i++)
        newFlattened = [newFlattened];
    return newFlattened;
};
/**
 * Make an array with a single item a single item, else leave it be
 * @param thing Something that is an array with 1 or more items
 */
export const singleOut = (thing) => thing.length == 1 ? thing[0] : thing;
/**
 * Imports a file, multiple files, or an entire dir (blacklist available)
 * @param type  what you want, a single file, mutliple files, or an entire dir
 * @param path  the path to the things
 * @param ignore  if you are importing a dir, this is the blacklist
 */
export const extractClasses = (type, path, ignore) => {
    const returning = [];
    const base = "../../" + (type == "dir" ? path + "/" : "");
    switch (type) {
        case "file":
        case "files":
            returning.push(...(arrify(path)).map(p => base + p));
            break;
        case "dir":
            returning.push(...readdirSync(path).filter(p => !(ignore = arrify(ignore)).concat(ignore.map(f => f.replace("ts", "js"))).includes(p)).map(p => base + p).filter(v => v.includes(".ts") || v.includes(".js")));
            break;
    }
    return returning.map(require);
};
/**
 * Takes a string and converts it to its respective type (number, boolean) or keeps it as a string
 * @param arg The string to be converted to its respective type
 */
export const convertArgType = (arg) => {
    if (arg.length == 0)
        return;
    arg = arg.toLowerCase();
    if (arg == "true" || arg == "false")
        return arg == "true";
    if (!isNaN(arg))
        return parseFloat(arg);
    return arg;
};
/**
 * Checks to see if two objects have the same attributes
 * @param x Object 1
 * @param y Object 2
 */
export const sameObj = (x, y) => {
    if (y == undefined || y == null)
        return false;
    let same = true;
    for (let pN in x)
        if (x[pN] !== y[pN])
            same = false;
    return same;
};
/**
 * Checks to see if the arguments meet the criteria, and returns if they do not.
 * @note If you have something like this: [[arg, arg2], arg5, arg6] => it is treated as [[arg, arg2], [arg5], [arg6]] and not [[arg, arg2], [arg5, arg6]]
 * @param args The arguments
 * @param argDefs The criteria forthe arguments
 * @returns {MachinaArgsInfo} value: matches a set argument, extra: index of the param it matches, results: the param info and the user sent param info, extraResults: extra params that the user sent
 */
export const checkArgsAgainstCriteria = (convertedArgs, argDefs) => {
    const defTopology = checkArrayTopology(argDefs);
    let reasons = [];
    const checkType = (arg, thing) => arg.type == "string" ? true : arg.type == typeof thing;
    switch (defTopology.dimensions) {
        case 0:
            reasons.push([{ expected: argDefs, recieved: nullify(convertedArgs[0]), result: exists(convertedArgs[0]) && checkType(argDefs, convertedArgs[0]) }]);
            break;
        case 1:
            reasons.push(argDefs.map((aD, i) => ({ expected: aD, recieved: nullify(convertedArgs[i]), result: exists(convertedArgs[i]) && checkType(aD, convertedArgs[i]) })));
            break;
        case 2:
            reasons.push(...argDefs.map(aD => arrify(aD).map((_aD, i) => ({ expected: _aD, recieved: nullify(convertedArgs[i]), result: exists(convertedArgs[i]) && checkType(_aD, convertedArgs[i]) }))));
            break;
        default:
            reasons.push([{ expected: null, recieved: null, result: false, extra: "number of layers is beyond 2" }]);
    }
    let rR = reasons.filter(r => r.every(_r => _r.result));
    let rawResults = rR.length > 0 ? rR.reduce((a, b) => a.length > b.length ? a : b) : [];
    const results = (rawResults.length > 1 ? rawResults.filter(r => typeof r.recieved == r.expected.type) : rawResults).flat(1); // this flatten is causing issues. If you have [arg, [arg, arg]] => it becomes [arg, arg, arg] and it gets confused when seraching when arg1 and arg2 or 3 are the same
    const flatResults = singleOut(results);
    const reverseResults = singleOut(arrify(flatResults).map(fR => fR.expected));
    const extraResults = convertedArgs.filter((v, i) => i > results.length - 1);
    // console.log(reasons, flatResults, reverseResults)
    // console.log(JSON.stringify(argDefs, null, '\t'), JSON.stringify(flatResults, null, '\t'))
    // console.log(arrify(reverseResults).findIndex(v => v == argDefs))
    return { value: results.length > 0, extra: arrify(argDefs).findIndex(v => arrify(v).every((_, i) => sameObj(_, arrify(reverseResults)[i]))), results: results, extraResults };
};
/** Checks to see if an array is symetric (like this: [[],[]]  and not [[[][]], []])*/
export const checkArrayTopology = (arr, data = { unifiedTopology: true, topologyBreaks: new Set(), dimensions: 0 }, setDim = 0, index = 0) => {
    if (!(arr instanceof Array))
        return data;
    setDim++;
    data.dimensions = Math.max(data.dimensions, setDim);
    let filtered = arr.filter(a => a instanceof Array);
    if (filtered.length > 0 && filtered.length < arr.length) {
        data.unifiedTopology = false;
        data.topologyBreaks.add([setDim, index]);
    }
    filtered.forEach((a, i) => checkArrayTopology(a, data, setDim, i));
    return data;
};
/**
 * Takes a value that could either be soemthing or undefined. If it is undefined, return null. Else, return the value.
 * @param data anything
 */
export const nullify = data => data == undefined ? null : data;
/**
 * Returns true if the data is not undefined nor null
 * @param data anything
 */
export const exists = data => !(data == undefined || data == null);
export const log = (filepath, ...data) => console.log(filepath + ": ", ...data);
