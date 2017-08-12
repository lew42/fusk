app.module("MyClass_index", ["MyClass"], function(MyClass){
	// this is a web index, not an... include alias
	// for example, /path/ will ask for /path/index.js
	// but, when requesting as a dep, "path" (from the root) will ask for "path.js"
	// but, these index.js files shouldn't export anything, and therefor shouldn't be imported anywhere


var is = app.is;
var Base = app.Base;

var el = document.createElement.bind(document);

var Test = Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		this.render();

		if (this.match())
			this.run();
	},
	render: function(){
		this.el = el("div");
		this.el.classList.add("test");

		this.link = el("a");
		this.link.innerText = this.name;
		this.link.href = "#" + this.name;
		this.el.appendChild(this.link);

		document.body.appendChild(this.el);
	},
	match: function(){
		return !window.location.hash || window.location.hash.substring(1) === this.name;
	},
	run: function(){
		this.el.classList.add("active");
		console.group(this.name);
		this.fn();
		console.groupEnd();
	}
});

var test = function(name, fn){
	return new Test({
		name: name,
		fn: fn
	});
};

var assert = console.assert.bind(console);
var log = console.log.bind(console);

console.assert(is.fn(MyClass));


test("this is a test", function(){
	log("hello world, this is just a test");
});

test("another test", function(){
	log("hello again, another test");
});

});