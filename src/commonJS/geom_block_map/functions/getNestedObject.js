// https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
const getNestedObject = (nestedObj, path) => {
	if ( undefined === path || 'string' != typeof( path ) )
		return null;

    return path.split('.').reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

export default getNestedObject;