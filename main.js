app.module("main", ["dep1", "dep2", "View"], function(dep1, dep2, View){
	console.log("main module executed", dep1, dep2, View);


	var ObjView = View.extend({
		render: function(){
			this.el = document.createElement("div");
		},
		update: function(){
			this.el.innerHTML = "";
			for (var i in this.obj){
				this.el.appendChild(this.prop(i));
			}
		},
		prop: function(i){
			var prop = document.createElement("div");
			prop.classList.add("prop");
			prop.append(i + ": " + this.obj[i].toString());
			return prop;
		}
	});

	var obj = {
		prop: 1,
		two: true,
		three: "weeeeeeee???e"
	};

	var objView = new ObjView({
		obj: obj
	});

	document.body.appendChild(objView.el);
});