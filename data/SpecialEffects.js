define([], function(){
	var SpecialEffects = function() {
		return {
		  "effects": [
			{
			  "name": Resource.windParticle,
			  "path": "./data/examples/windParticle.html",
			  "thumbnail": "./data/examples/thumbnails/windParticle.jpg",
			  "description": Resource.windParticle
			},
			{
			  "name": Resource.trailLines,
			  "path": "./data/examples/airlinesTrailLines.html",
			  "thumbnail": "./data/examples/thumbnails/airlinesTrailLines.jpg",
			  "description": Resource.trailLines
			},
			{
			  "name": Resource.scanLine,
			  "path": "./data/examples/scanEffect.html",
			  "thumbnail": "./data/examples/thumbnails/scanEffect.jpg",
			  "description": Resource.scanLine
			}
		  ]
		}
	};
	return SpecialEffects;
});
