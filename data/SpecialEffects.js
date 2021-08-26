define([], function () {
	var SpecialEffects = function (root) {
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
				},
				{
					"name": Resource.heatMap,
					"path": root + "/data/examples/heatMap.html",
					"thumbnail": root + "/data/examples/thumbnails/heatMap.jpg",
					"description": Resource.heatMap
				},
				{
					"name": Resource.ParticleSystem,
					"path": root + "/data/examples/ParticleSystem.html",
					"thumbnail": root + "/data/examples/thumbnails/ParticleSystem.jpg",
					"description": Resource.ParticleSystem
				}
			]
		}
	}
	return SpecialEffects;
});
