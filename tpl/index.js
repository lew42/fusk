app.module("tpl", [], function(){
/*
either el has to handle refs, or .tpl has to dig for them?

if nodeType === 1, for each child w/ nodeType === 1, if it has a class, use the first class..?

digging is a little complicated:
* invalid class names ("some-thing")?
	actually, that's not a problem, it shouldn't error...

this.dig(el)?


Or, el() does ._refs?

this.tpl({
	some: {
		deep: el("section", {
			another: {
				aside: el("aside", ...)
			}
		})
	}
});

all these refs get bumped to the root?
this.some; this.deep; this.another; this.aside?

so, el() takes the object, creates a div out of it, and calls itself?

el({
	subs
}) --> 

1. determine tag
2. add classes
3. append children

makes the div for return
creates children from {}

appendChildren(node, [children]);
	if child is an object, 
		see what the prop value is, if its a node, use that
		if not, create a node
		add the propName as class
	if the child is string, append it
	if the child is a node, append it
	if the child is a number, append it

	just use .append?

renderObject({});
* need root el
* 


el({}) --> <div></div>
el(".class") --> <div.class></div>
el("")

This function could do the heavy lifting?
We need a way to specify where the references go?

el(".class")


one(class){
	var el = document.createElement
}

elPojo(el, pojo){
	for (var i in pojo){
		if (is.pojo(pojo[i])){
			
		}

	}
}

How much easier would it be to create an element in an object oriented way?
You could still have simple templating functions.  But instead of all this functional back and forth, you just create a new Element(), .addClass, .attr(), etc..


*/

// var el = document.createElement.bind(document);
var el = function(tag){
	return document.createElement(tag || "div");
};


var addClass = function(el, cls){
	el.classList.add(cls);
	return el;
};

var appendDefault = function(el, value){
	el.append(value);
	return el;
};

var append = function(el, value){
	if (is.pojo(value)){
		return appendPojo(el, value);
	} else if (is.el(value)){
		return appendEl(el, value);
	} else {
		return appendDefault(el, value);
	}
};

var promoteRefs = function(frm, to){
	var refs;
	if (frm._refs){
		refs = to._refs = to._refs || {};
		for (var prop in frm._refs){
			if (!refs[prop]){
				refs[prop] = frm._refs[prop];
			}
		}
	}
};

var appendEl = function(el, child){
	promoteRefs(child, el);
	el.appendChild(child);
	return el;
};

var appendPojo = function(ele, pojo){
	if (ele._refs){
		console.info("already has refs");
	} else {
		ele._refs = {};
	}

	var child, value;

	for (var prop in pojo){
		value = pojo[prop];
		if (is.el(value)){
			// use value as child
			child = addClass(value, prop);
		} else {
			// make new child and append value
			child = append(addClass(el(), prop), value);
		}

		// append and reference
		ele._refs[prop] = appendEl(ele, child);
	}

	return ele;
};

is.el = function(value){
	return value && value.nodeType === 1;
};

var tpl = function(token, children){
	var element;
	if (is.str(token)){
		token = token.split(".");
		if (token[0] === ""){
			// token starts with a .class
			element = el();
			// remove empty string
			token = token.slice(1);
		} else {
			// token starts with a tag
			element = el(token[0]);
			// remove tag
			token = token.slice(1);
		}

		for (var j = 0; j < token.length; j++){
			addClass(element, token[j]);
		}

		children = [].slice.call(arguments, 1);
	} else {
		element = el();
		children = arguments;
	}

	for (var i = 0; i < children.length; i++){
		append(element, children[i]);
	}

	return element;
};

var View = Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){},
	tpl: function(token, children){
		var ele = tpl.apply(null, arguments);
		if (ele._refs){
			for (var i in ele._refs){
				if (!this[i])
					this[i] = ele._refs[i];
				else
					console.warn("collision at", i);
			}
		}
		this.el = ele;
		return this;
	}
});

var view = new View({
	render: function(){
		this.tpl("section.my.cool.sect", {
			one: "hello",
			two: tpl("aside.e.f.g", {
				top: "top",
				middle: "middle",
				bottom: "bottom"
			}),
			three: {
				auto: "div?",
				another: "div",
				extra: tpl(".classes.pls", "muahaha")
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", function(){

	view.render();
	document.body.appendChild(view.el);
	window.tst = view;
});

});