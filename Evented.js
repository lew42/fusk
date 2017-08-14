app.module("Evented", [], function(){

var Evented = Base.extend({
	init: function(){
		this.events = {};
	},
	on: function(event, cb){
		var cbs = this.events[event] = this.events[event] || [];
		cbs.push(cb);
		return this;
	},
	emit: function(event){
		var cbs = this.events[event] || [];
		for (var i = 0; i < cbs; i++){
			cbs[i].apply(this, [].slice.call(arguments, 1));
		}
		return this;
	}
});

return Evented;
	
});
