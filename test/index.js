app.module("test", [], function(){

	if (confirm("test2? cancel for test4")){
		app.module("test2", ["test3"], function(test3){
			console.log("test2 running. test3:", test3);
		});
	} else {
		app.module("test4", ["test5"], function(test5){
			console.log("test4 running. test5:", test5);
		})
	}
});

/*

We need a way to conditionally load/run different modules.

I suppose, simply defining a new module within a module is fine?


Relative requires:
* If a <script> is appended ONLY on a certain route, you could use relative module path.

But, if you want to load a script from various scripts, you'd have to reference it differently...

This is ok, I suppose.

*/