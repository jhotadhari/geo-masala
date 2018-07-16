
const WrappedInputControl = Backform.InputControl.extend({
    defaults: {
      type: "text",
      label: "",
      maxlength: 255,
      extraClasses: [],
      helpMessage: null,
      tag: 'div',
    },
    template: _.template([
      '<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>',
      '<div class="<%=Backform.controlsClassName%>">',
      '  <<%=tag%>><input type="<%=type%>" class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" maxlength="<%=maxlength%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> /></<%=tag%>>',
      '  <% if (helpMessage && helpMessage.length) { %>',
      '    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>',
      '  <% } %>',
      '</div>'
    ].join("\n")),
});

export default WrappedInputControl;