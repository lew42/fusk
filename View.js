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
	route: function(path){
		// 1. match against current url upon creation
		// 2. assume only end-node activate (no sequential)

		window.addEventListener("popstate", function(){

		});


		/*

Maybe we do something like new View(el(), el(), new MyView(), ...)?

For many modules, displaying something will be a simple one line function.   And the view could be constructed entirely in one function:

obj.render(){
	return new View(
		el(".header", this.name),
		el("")
	);
}


Partial activation is required for lazy routes.
For example, a .test.js file creates several test blocks, each of which with their own URL.

In order for this to work, we need the root-most routes to activate in order for the sub routes to even get defined...

But, once they're defined, then we have to go back to the original protocol?  Once they're defined, and they're listening on their own, then we don't want partial activations...
	Otherwise, they would be redefined...


The secondary lifecycle is a little tricky:
1. the views have been rendered, and just get hidden
	Do views need any re-activation logic?
	Should tests re-run?
2. if you've already rendered, maybe re-doing a partial activation isn't a big deal?

firstPassPartialMatch
* if window.location.pathname.indexOf(this.path) === 0

It's basically... if there is a partial match, regardless of exact match, and we haven't rendered yet...


Also - if views auto render, regardless of route matching, aren't we doing a lot of extra work?

We probably don't want to render until needed...
		*/
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