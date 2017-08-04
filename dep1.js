app.module("dep1", ['deps/dep3'], function(dep3){
	console.log("dep1 executed with dep3:", dep3);
	return "dep1-value";
});

//# sourceURL=test.whatever