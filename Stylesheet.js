app.module("Stylesheet", [], function(){

var Base = app.Base;

var Stylesheet = Base.extend({
	instantiate: function(){
		this.selectors = [];
	},
	select: function(selector){
		var selector = new Selector(selector);
		this.selectors.push(selector);
		return selector;
	}
});

var Selector = Base.extend({
	instantiate: function(selector){
		this.selector = selector;
	}
});

return Stylesheet;

});