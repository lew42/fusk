app.module("Router", [], function(){

var Base = app.Base;
var is = app.is;



var cleanPathParts = function(pathParts){
	if (pathParts[0] === "")
		pathParts = pathParts.slice(1);

	if (pathParts[pathParts.length - 1] === "")
		pathParts = pathParts.slice(0, -1);

	return pathParts;
};

var getParts = function(path){
	return is.arr(path) ? path :
		cleanPathParts(path.split("/"));
};

var getOption = function(options, name){
	if (is.obj(options))
		return options[name];
	else
		return options;
};

var Route = Base.extend({
	add: function(path, options){
		path = getOption(path, 'path');

	},
	match: function(part){
		return part === this.part;
	}
});

var Router = Route.extend({});


});


// var Base2 = require("base42/v2");
var Base3 = require("mod42/v1a");
var is = require("util42").is;

var View = require("view42/v1");

require("./router.less");

var RouteView = View.extend({
	name: "RouteView",
	render: function(){

		this.hide();

		this.route.router.routerView.views.append(this);
	},
	update: function(){
		this.el.innerHTML = "";
		this.route.each(function(r){
			this.append_view(r.link());
		}.bind(this));
	}
});

var RouterView = View.extend({
	name: "RouterView",
	render: function(){
		this.append({
			crumbs: View(),
			views: View()
		});

		var router = this.route;

		// this.rebuildCrumbs();
	},
	update: function(){
		this.rebuildCrumbs();
	},
	rebuildCrumbs: function(){
		this.crumbs.el.innerHTML = "";


		var router = this.route;
		var next = router.activeNode;
		var crumbs = [];

		while (next){
			next.tab.removeClass("active");
			crumbs.push(next.tab);
			next = next.parent;
		}

		// this.myCrumb = this.myCrumb || View("/").click(function(){
		// 	router.activate();
		// });

		// this.crumbs.append(this.myCrumb);

		if (crumbs.length){
			this.crumbs.append.apply(this.crumbs, crumbs.reverse());
			crumbs[crumbs.length - 1].addClass("active");
		}
	}
});

// var Method = require("method42/v4");



var Route = Base3.extend({
	name: "Route1",
	// log: true,
	link: function(){
		return View(this.part).click(function(){ 
			this.activate(); 
		}.bind(this));
	},
	render: function(){
		this.tab = View(this.part).click(function(){
			this.activate();
		}.bind(this));
		return this.view = new RouteView({
			route: this
		});
	},
	instantiate: function(o){
		this.config_name(o);
		this.cbs = [];
		this.routes = {};

		this.set.apply(this, arguments);

		if (this.parent)
			this.router = this.parent.router;

		this.render();
	},
	config_name: function(o){
		// console.log(o);
		if (o && o.part){
			// console.log(o.part);
			this.name = o.part;
		}
		// o && o.part && (this.name = o.part);
	},
	/*
	*  .match should be changed to "matchSelf"

	*  		returned {
				match: obj/value,
				remainder: [],
				depth: 1 // if we only match self, it defaults to 1, and increments as we "find" child "matches".
			}
	*  .find should be used to "findChildren"
	*  both can work roughly the same - if you pass in an array of path parts, it'll match/find as far as it can.
	*  
	*  THIS LOGIC SHOULD BE EXTRACTED so it can be used for JavaScript paths (app[one][two][...]).
	*  And file paths:  "dir1/dir2"
	*  And URLs...
	*  And anonymous trees:  trees without identifiers, where you have to loop to search the properties.
	*  It's basically like the lodash filter functions for arrays, only with recursive support, so you can "search", "filter", "map" on a deep basis...?
	*  I think recursive operations should happen on a flat basis:
			The top-level item has a match/find/filter function, and it can optionally decide to call the same function on its children.
	*/
	match: function(path){
		var parts = getParts(path); // ensure ["one", "two", "three"]
		var firstPart = parts[0]; // "one"
		var route; // the direct child route that matches the firstPart, if it exists
		var match;
		var remainder;

		if (firstPart in this.routes){
			// this.log("Found %cfirstPart: %c%s", "font-weight: bold", "color: red; font-style: italic;", '"' + firstPart + '"');
			// this.log.f("Found ", this.log.var(firstPart, "firstPart"))();

			// store for frequent access
			route = this.routes[firstPart];

			
			// this.log("Begin search for the %cremainder", "font-weight: bold", "parts:", remainder);
			
			// there may have only been one part
			if (parts.length > 1){
				// the remaining unmatched parts
				remainder = parts.slice(1);

				// this.log("Recursively match", remainder);
				match = route.match(remainder);

				if (match)
					return match;
			}

			// if no deeper match, return the first child as match
			return {
				part: route.part,
				route: route,
				remainder: remainder
			}

		}


		// this.log('%cfirstPart: %c"' + firstPart + '"', "font-weight: bold", "color: red; font-style: italic:", "not found.");
		this.log.var(firstPart, "firstPart")("not found");
		return false;
	},
	/*
	router doesn't have parent, and can have multiple 'parts' as its .part
	 router.part = "/one/two/three/"; // or
	 router.part = "/"

	The router.part SHOULD include  */
	path: function(){
		if (this.parent)
			return this.parent.path() + this.part + "/";
		else
			return this.part;
	},
	make: function(path, options){
		var parts = getParts(path),
			part = parts[0],
			rest = parts.slice(1),
			route;

		options = options || {}; // don't pass undefined to a constructor

		if (!(part in this.routes)){
			route = new this.router.Route({
				part: part,
				parent: this,
				log: this.log.isActive
			}, options);

			
			this.routes[part] = route;
			this.view.update();

			if (rest.length) 
				return route.make(rest, options);
			else 
				return route;

		} else {
			console.warn("Attempted to re.make() a path that already exists.");
			// Shouldn't use .make directly.  Other methods, such as .add
			// will check if it exists, and return that...
		}

		return false;
	},
	add: function(path, options){
		var parts = getParts(path);
		// this.log.off();
		var match = this.match(parts);
		// this.log.restore();
		/* this.log = false; this.log = true; converted the state from 'auto' to 'on', which then started logging way too much.  This is confusing...

		*/
		if (match){
			if (match.remainder.length){
				// this.log.f("Partial match: ", this.log.var(match.route, "match.route"))();
				// this.log.f("Plus remainder: ", this.log.var(match.remainder, "match.remainder"))();
				return match.route.make(match.remainder, options);
			} else {
				this.log("Exact route:", match.route.path(), "already exists.");
				return match.route;
			}
		} else {
			this.log("No match found.  Make all.");
			return this.make(parts, options);
		}
	},
	set_parent: function(parent, name){
		this.parent = parent;
		this.router = parent.router;
	},
	push: function(){
		if (window.location.pathname === this.path){
			// console.warn("path matches, no need to push");
			// this happens on first load.. i think this is ok for now
		} else {
			window.history.pushState(null, null, this.path());
			this.googleAnalytics();
		}
	},
	googleAnalytics: function(){
		if (typeof ga !== "undefined"){
			ga('set', {
				page: this.path,
				// title: this.page.name //?
			});

			ga('send','pageview');
		}
	},
	isActiveNode: function(){
		return this.router.activeNode === this;
	},
	activate: function(push){
		if (!this.isActiveNode()){
			console.log("activating", this.part);
			this.router.activeNode && this.router.activeNode.view.hide();
			this.router.activeNode = this;
			this.view.show();
			this.router.routerView.update();
			this.router.routerView.active = this.view;
			if (push !== false)
				this.push();
			this.exec();
		} else {
			console.warn("already active route", this.part);
		}
	},
	exec: function(){
		this.cbs.forEach(function(cb){
			cb.call(this);
		}.bind(this));
	},
	then: function(cb){
		this.cbs.push(cb);
		return this;
	},
	each: function(cb){
		for (var i in this.routes){
			cb.call(this, this.routes[i]);
		}
		return this;
	},
	_logger: function(){
		console.group(this.part);
		this.log.off(this, function(){
			this.each(function(route){
				route._logger();
			});
		});
		console.groupEnd();
	},
	rematch: function(){
		var match = this.router.getMatch();
		if (match.route === this)
			return false;
		
		match.route.remainder = match.remainder;
		match.route.activate(false);
		return true;
	}
});

var Router = module.exports = Route.extend({
	name: "Router1",
	Route: Route,
	listen: true,
	part: "/",
	// log: true,
	// needs to come before path
	renderRouter: function(){
		return this.routerView = new RouterView({
			route: this
		});
	},
	instantiate: function(){
		this.router = this;
		this.cbs = [];
		this.routes = [];

		window.addEventListener("popstate", this.listener.bind(this));

		this.renderRouter();
		this.render();

		this.set.apply(this, arguments);
		this.initialize.apply(this, arguments);
	},
	listener: function(location, action){
		// toggled by routes, to skip when the action originates from ourselves
		if (this.listen){
			this.matchAndActivate();
		}
	},
	getCurrentURLPathParts: function(){
		// an attempt to make the router work when dropped on any given relative page
		return getParts(window.location.pathname.replace(this.part, ""));
	},
	matchAndActivate: function(){
		this.log("matchAndActivate()");
		var match = this.getMatch();
		if (match){
			this.log("match", match);
			match.route.remainder = match.remainder;
			match.route.activate(false);
		} else if (!this.activeNode){
			this.activate();
		}
		return this;
	},
	getMatch: function(){
		return this.match(this.getCurrentURLPathParts());
	}
});

/*
Alternative, simpler API

route.match("some/path/or" || "single-part");


Loop through sub routes, and match?
If we don't use the parts, and map the first part to the first child route..
It's worked well, I don't know why I should change that part.

So, the router and route structure is basically just a tree, with activations.
I think it's working.  I could always come back...



Use cases
1. Initial load and popstate:  any arbitrary URL to match
2. Add arbitrary paths, potentially based on a folder structure.  I'd like to keep this in effect, even if I'm using my own "loader" system (which honestly might not happen for a while...);
3. route.activate() and route.activate(false)


*/