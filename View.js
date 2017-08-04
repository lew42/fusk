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
	update: function(){},
	route: function(route){

	},
	activate: function(){
		this.show();
		return this;
	},
	deactivate: function(){
		this.hide();
		return this;
	},
	show: function(){
		this.el.style.display = '';
		return this;
	},
	hide: function(){
		this.el.style.display = 'none';
		return this;
	}
});

return View;

});