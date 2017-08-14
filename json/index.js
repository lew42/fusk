app.module("json", [], function(){

var Base = app.Base;
var is = app.is;

var Q = Base.extend({
	instantiate: function(){
		this.cbs = [];
	},
	then: function(cb, eb){
		this.cbs.push(cb);
	},
	exec: function(){
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].apply(this.ctx || this, arguments);
		}
	}
});



var Prop = Evented.extend({
	name: "defaultPropName",
	value: undefined,
	instantiate: function(){
	},
	set_name: function(newName){
		if (this.isValidPropName(newName)){
			this.name = newName;
			this.emit("name", newName);
		} else {
			this.emit("invalid-name");	
		}

	},
	isValidPropName: function(propName){
		var caught = false,
			nameTester = {};
		try {
			nameTester[propName] = null;
		} catch (e) {
			return false;
		}
		return true;
	}
});

var PropView = Evented.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		this.render();
		this.update();
	},
	render: function(){
		// automatically use this.name as class?
		this.tpl({
			propNameAndClass: 123,
			anyViewableValue: fn,
			objectsAreContainers: {
				useTheElFn: el("span", viewable),
				another: el("input")
			}
		});
	}
});

var el = document.createElement.bind(document);

var DataView = Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		this.render();
		this.update();
	},
	render: function(){
		this.el = el("div");
		this.el.classList.add("data");
		this.el.innerText = "Hello Data";

		this.meta = el("div");
		this.meta.classList.add("meta");
		this.el.appendChild(this.meta);

		this.addPropertyBtn = el("button");
		this.addPropertyBtn.innerText = "add property";
		this.meta.appendChild(this.addPropertyBtn);
		this.addPropertyBtn.addEventListener("click", function(){
			this.data.addProp();
		}.bind(this));

		this.properties = el("div");
		this.properties.classList.add("properties");
		this.el.appendChild(this.properties);

		this.handlers();
	},
	handlers: function(){
		this.data.on("addProp", function(prop){
			this.properties.appendChild(prop.view({
				dataView: this
			}).el);
		}.bind(this));
	},
	update: function(){

	}
});

var Data = Evented.extend({
	Prop: Prop,
	View: DataView,
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		this.events = {};

		if (this.name){
			this.load();
		} else {
			this.raw = {};
		}

		document.addEventListener("DOMContentLoaded", function(){
			document.body.appendChild(this.view().el);
		}.bind(this));
	},
	save: function(){
		if (!this.name)
			throw "must have a name";

		window.localStorage.setItem(this.name, JSON.stringify(this.raw));
	},
	load: function(){
		this.raw = JSON.parse(window.localStorage.getItem(this.name));

		if (!this.raw){
			console.log("no localStorage for", this.name, "- creating new blank object");
			this.raw = {};
			this.save();
		}
	},
	setup: function(){
		for (var i in this.raw){

		}
	},
	view: function(){
		return new this.View({
			data: this
		});
	},
	set: function(name, value){
		this.prop(name).set(value);
	},
	prop: function(propName){
		if (this.props[propName]){
			return this.props[propName];
		} else {
			return this.addProp(new this.Prop({
				name: propName,
				data: this
			}));
		}
	},
	addProp: function(prop, n){
		if (is.def(n)){
			this.addPropAt(prop, n);
		} else {
			this.props[prop.name] = prop;
			this.raw[prop.name] = prop.value;
		}

		this.emit("addProp", prop);

		return prop;  // don't like this - just to make 1 function a little easier?
	}
});





var data = new Data({
	name: "test"
});

});

/*

new Data('name'); --> auto loads?
let's make these dumb objects...

// assign only...
new Data({
	
})

*/