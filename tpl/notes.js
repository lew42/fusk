/*

View.use(element) --> looks for _refs?


Quarantine:  app.js is way too big.
What is the minimal initial load?

Hardcoded deps?
--> need to know when they load
--> which means we need to predefine a global to register with

If this is just for separating them into files - why not just hardcode them with <script> tags?

Especially for the globals...
-> App.js and app.js?
-> is.js
-> Module.js?
-> View.js?


*/





// so, only this.tpl() and el()?


this.tpl({
	meta: {},
	meta: {
		addPropertyBtn: el("button", "add property")
	},
	properties: {}
});

this.tpl(
	el(".meta", 
		el("button.addPropertyBtn", "add property")
	),
	el(".properties")
);



template(ctx, "tag.class", child, ren);

tpl("tag.class.optional", child, ren);
tpl("span")
	// <span> or <div>span?


el("tag.class.required", child, ren)

this.tpl("tag.class.optional", child, ren);

tpl(".whatever", {
	one: "string",
	two: el(".additional.classes", child, ren),
	three: {
		nested: "elements",
		someBtn: el("button", "whatever")
	},
	nested: tpl("tag.class", {
		// must use tpl to trigger the reference stuff?
	}),
	we: el("tag.class", /*doesn't support {}?*/),
	nested: new Mine(),
	onlyClasses: el({ // but, does this.onlyClasses = the el?  or we skip that one too?
		/* to bypass the reference stuff, you could use the 'el' fn...? */
		someClass: "whatever", // div.someClass>whatever
		another: el("span", child, ren), // span.another>child,ren
	})
});

this.tpl({
	nested: new Mine()
})
this.nested instanceof Mine;
this.nested.parent === this;

/*
Nested views should only be used when necessary - keep things light, and just manage it from a single view, when possible.

Nesting creates complicated syntax requirements for separate objects to communicate...
*/