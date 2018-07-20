import breakpoints from '../breakpoints';
//  breakpoints is like that: {
// 	huge: 1440,
// 	wide: 1280,
// 	large: 960,
// 	medium: 782,
// 	small: 600,
// 	mobile: 480,
// };

// argument is breakpoint key
// returns boolean
const deviceIs = ( device ) => {
	const windowWidth = $(window).width();

	// check for huge
	if ( device === 'huge' )
		return breakpoints[device] < windowWidth;

	// check for mobile
	if ( device === 'mobile' )
		return breakpoints[device] > windowWidth;

	// check for other devices
	const breakpointsKeys = Object.keys(breakpoints);
	const breakpointsVals = Object.values(breakpoints);
	const index = breakpointsKeys.indexOf(device);
	if ( index > 0 )
		return breakpointsVals[index+1] < windowWidth && windowWidth < breakpointsVals[index];

	// if we get here, so,ething didnt work, lets just return false
	return false;
};
export default deviceIs;

