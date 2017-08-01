;(function(){

var is = {
	arr: function(value){
		return toString.call(value) === '[object Array]';
	},
	obj: function(value){
		return typeof value === "object" && !is.arr(value);
	},
	val: function(value){
		return ['boolean', 'number', 'string'].indexOf(typeof value) > -1;
	},
	str: function(value){
		return typeof value === "string";
	},
	num: function(value){
		return typeof value === "number";
	},
	bool: function(value){
		return typeof value === 'boolean';
	},
	fn: function(value){
		return typeof value === 'function';
	},
	sfn: function(value){
		return is.fn(value) && value.main;
	},
	def: function(value){
		return typeof value !== 'undefined';
	},
	undef: function(value){
		return typeof value === 'undefined';
	},
	simple: function(value){ // aka non-referential
		return typeof value !== 'object' && !is.fn(value); // null, NaN, or other non-referential values?

		// typeof null === "object"...
	},
	Class: function(value){
		return is.fn(value) && value.extend;
	},
	// better than "Class"
	Mod: function(value){
		return is.fn(value) && value.extend;
	},
	/// seems to work
	pojo: function(value){
		return is.obj(value) && value.constructor === Object;
	},
	mod: function(value){
		return is.obj(value) && is.Mod(value.constructor);
	},
	proto: function(value){
		return is.obj(value) && value.constructor && value.constructor.prototype === value;
	}
};

var assign = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		for (var prop in arg){
			this[prop] = arg[prop];
		}
	}
	return this;
};

var Base = function(){
	this.instantiate.apply(this, arguments);
};

Base.prototype.assign = assign;

Base.prototype.assign({
	instantiate: function(){}
});

Base.extend = function(){
	var Ext = function(){
		this.instantiate.apply(this, arguments);
	};
	Ext.assign = assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};

var app = window.app = {
	initialize: function(){
		this.modules = new Modules({
			app: this
		});
	},
	module: function(name, deps, fn){
		this.modules.loaded(name, deps, fn);
	},
	moduleLoaded: function(name, deps, fn){
		for (var i = 0; i < deps.length; i++){
			if (this.modules[name]){
				this.modules[name].then(function(){});
			}
		}
	},
	createModuleManager: function(name, deps, fn){

	}
};

var View = Base.extend({
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


var Modules = Base.extend({
	instantiate: function(){
		this.modules = {};
	},
	get: function(name){
		// returns the Module object, not the module's exported (returned) value)
		return this.modules[name] ? this.modules[name] : this.make(name);
	},
	make: function(name){
		return this.modules[name] = new Module({
			name: name,
			app: this.app,
			modules: this
		});
	},
	loaded: function(name, deps, fn){
		this.get(name).loaded(deps, fn);
	}
});

/*

app.module("main", [], function(){
	// should run immediately...
});

app.module("main", [])

*/

var Module = Base.extend({
	instantiate: function(){
		this.cbs = [];
		this.deps = [];

		// expecting { app, name }
		// { deps, fn } aren't known until module is loaded
		this.assign.apply(this, arguments);

		this.exec = this.exec.bind(this);

		if (this.name !== "main")
			this.request();
	},
	request: function(){
		this.script = document.createElement("script");
		this.script.src = this.name + ".js";
		document.head.appendChild(this.script);
	},
	getDeps: function(deps){
		for (var i = 0; i < deps.length; i++){
			this.deps.push(this.modules.get(deps[i]));
		}
	},
	loaded: function(deps, fn){
		// called via the app.module interface method
		this.fn = fn;
		// must wait for all deps before executing this module

		if (deps.length){
			this.getDeps(deps);
			this.buildCompoundCB(this.deps, this.fn);
		} else {
			this.exec();
		}
	},
	buildCompoundCB: function(){
		var addNextCB = this.exec;

		var wrapCB = function(dep, cb){
			return function(){
				dep.then(cb);
			};
		};

		for (var i = this.deps.length - 1; i > 0; i--){
			addNextCB = wrapCB(this.deps[i], addNextCB);
		}

		this.deps[0].then(addNextCB);
	},
	exec: function(){
		// exec 
		this.isLoaded = true;
		console.group(this.name, this.args());
		this.value = this.fn.apply(null, this.args());
		this.execCBs();
		console.groupEnd();
	},
	args: function(){
		var dep, args = [];
		for (var i = 0; i < this.deps.length; i++){
			dep = this.deps[i];
			if (dep.isLoaded)
				args.push(dep.value);
			else
				throw "whoops";
		}
		return args;
	},
	execCBs: function(){
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].call(null, this.value);
		}
	},
	then: function(cb){
		if (this.isLoaded){
			cb.call(null, this.value);
		} else {
			this.cbs.push(cb);
		}
	}
});


/*

For each dep, we need to create a function that calls the next..?

module("a", ["b", "c", "d"])

b.then(function(){
	c.then(function(){
		d.then(function(){
			a.exec();
		})
	})
})

1.  create exec cb:  

execCB = this.exec;


2.  create first dep cb:

firstCB = function(){
	firstDep.then(execCB)
}


second.then(function(){
	first.then(exec)
});

the first cb is

function(){
	first.then(exec);
}

and is applied to the second

second.then(firstCB)

the next:

third.then(function(){
	second.then(function(){
		first.then(exec);
	});
})

nextDep.then(function(){
	lastDep.then(function(){
	
	})
});

lastDep.then(function(){
	add
});


addNextCB = function(){
	exec();
};
for (var i = 0; i < deps.length; i++){
	addNextCB = wrapCB(dep[i], addNextCB);
		--> returns function(){
			dep[i].then(addNextCB);
		}
	deps[i].then(function(){
		
	});
}


*/


app.initialize();

app.Base = Base;
app.is = is;


})();