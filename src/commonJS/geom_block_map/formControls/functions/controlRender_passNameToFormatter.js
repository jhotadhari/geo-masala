
// same as Backform.Control.render, but passes name to formatter.fromRaw
const controlRender_passNameToFormatter = function() {
	var field = _.defaults(this.field.toJSON(), this.defaults),
	attributes = this.model.toJSON(),
	attrArr = field.name.split('.'),
	name = attrArr.shift(),
	path = attrArr.join('.'),
	rawValue = this.keyPathAccessor(attributes[name], path),
	data = _.extend(field, {
		rawValue: rawValue,
		value: this.formatter.fromRaw(rawValue, this.model, this.field.get('name')),
		attributes: attributes,
		formatter: this.formatter
    }),
    evalF = function(f, m) {
    	return (_.isFunction(f) ? !!f(m) : !!f);
    };

    // Evaluate the disabled, visible, and required option
    _.extend(data, {
		disabled: evalF(data.disabled, this.model),
		visible:  evalF(data.visible, this.model),
		required: evalF(data.required, this.model)
    });

    // Clean up first
    this.$el.removeClass(Backform.hiddenClassName);

    if (!data.visible)
        this.$el.addClass(Backform.hiddenClassName);

    if(Backform.requiredInputClassName) {
        this.$el.removeClass(Backform.requiredInputClassName);
    }

    if (data.required) {
        this.$el.addClass(Backform.requiredInputClassName);
    }

    this.$el.html(this.template(data)).addClass(field.name);
    this.updateInvalid();

    return this;
};

export default controlRender_passNameToFormatter;