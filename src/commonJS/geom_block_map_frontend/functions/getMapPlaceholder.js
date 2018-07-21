import $ from 'jquery';
import _ from  'underscore';

const getMapPlaceholder = ( color, dimensions ) => {
	const placeholderTemplate = _.template([
		'<div class="geom-placeholder" style="width: <%= dimensions.width %>%; height: <%= dimensions.height %>px; margin: 0 auto;">',
		'  <div class="geom-placeholder-overlay">',
		'    <div class="geom-placeholder-overlay-spinner" style="background-color: <%=color%>;">',
		'    </div>',
		'  </div>',
		'</div',
	].join('\n'));
	return $(placeholderTemplate({color, dimensions}));
};

export default getMapPlaceholder;