app.module("View", [], function(){

var is = app.is;

var View = app.Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		this.render();
		this.update();
	},
	render: function(){},
	update: function(){}
});

return View;

});