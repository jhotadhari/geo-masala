// https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
const setNestedObject = (obj, path, value) => {
	const pList = path.split('.');
	const key = pList.pop();
	const pointer = pList.reduce((accumulator, currentValue) => {
			if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
			return accumulator[currentValue];
	}, obj);
	pointer[key] = value;
	return obj;
}

export default setNestedObject;