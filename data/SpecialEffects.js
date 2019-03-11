define([], function(){
	var SpecialEffects = function(root) {
		return {
		  "effects": [
			{
			  "name": Resource.windParticle,
			  "path": root + "/data/examples/windParticle.html",
			  "thumbnail": root + "/data/examples/thumbnails/windParticle.jpg",
			  "description": Resource.windParticle
			},
			{
			  "name": Resource.trailLines,
			  "path": root + "/data/examples/airlinesTrailLines.html",
			  "thumbnail": root + "/data/examples/thumbnails/airlinesTrailLines.jpg",
			  "description": Resource.trailLines
			},
			{
			  "name": Resource.scanLine,
			  "path": root + "/data/examples/scanEffect.html",
			  "thumbnail": root + "/data/examples/thumbnails/scanEffect.jpg",
			  "description": Resource.scanLine
			}
		  ]
		}
	}
	return SpecialEffects;
});
