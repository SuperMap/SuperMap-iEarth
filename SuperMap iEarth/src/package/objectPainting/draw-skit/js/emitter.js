//根据一个面发射面内的某个随机点坐标，主要用于粒子发射
class Emitter {
    constructor() {
        this._positions = null;
        this.boundingSphere = null;
        this._geometry = null;
        this._triangleArrayByWeight = null;
    }
    initPolygonEmitter(positions) {
        this._positions = SuperMap3D.defaultValue(positions, [new SuperMap3D.Cartesian3(), new SuperMap3D.Cartesian3(), new SuperMap3D.Cartesian3()]);
        this.boundingSphere = SuperMap3D.BoundingSphere.fromPoints(positions);
        if (SuperMap3D.defaultValue(positions)) {
            var PolygonGeometry = SuperMap3D.PolygonGeometry.fromPositions({
                positions: positions,
                perPositionHeight: true
            });
            this._geometry = SuperMap3D.PolygonGeometry.createGeometry(PolygonGeometry);
            this._triangleArrayByWeight = this.initWeight(this._geometry);
        }
    }

    get positions() {
        return this._positions;
    };
    set positions(positions) {
        if (!SuperMap3D.defaultValue(positions)) {
            return;
        }
        this._positions = positions;
        var PolygonGeometry = SuperMap3D.PolygonGeometry.fromPositions({
            positions: this._positions,
            perPositionHeight: true
        });
        this._geometry = SuperMap3D.PolygonGeometry.createGeometry(PolygonGeometry);
        this._triangleArrayByWeight = this.initWeight(this._geometry);
        this.boundingSphere = SuperMap3D.BoundingSphere.fromPoints(positions);
    }


    initWeight(geometry) {
        var vertex0 = new SuperMap3D.Cartesian3();
        var vertex1 = new SuperMap3D.Cartesian3();
        var vertex2 = new SuperMap3D.Cartesian3();
        var indices = geometry.indices;
        var triangleCount = indices.length / 3;
        var vertices = geometry.attributes.position.values;
        var i, j;
        var areaArray = [];
        var totalArea = 0.0;
        for (i = 0; i < triangleCount; i++) {
            var vertexIndex0 = indices[i * 3];
            var vertexIndex1 = indices[i * 3 + 1];
            var vertexIndex2 = indices[i * 3 + 2];
            vertex0.x = vertices[vertexIndex0 * 3];
            vertex0.y = vertices[vertexIndex0 * 3 + 1];
            vertex0.z = vertices[vertexIndex0 * 3 + 2];

            vertex1.x = vertices[vertexIndex1 * 3];
            vertex1.y = vertices[vertexIndex1 * 3 + 1];
            vertex1.z = vertices[vertexIndex1 * 3 + 2];

            vertex2.x = vertices[vertexIndex2 * 3];
            vertex2.y = vertices[vertexIndex2 * 3 + 1];
            vertex2.z = vertices[vertexIndex2 * 3 + 2];
            var area = this.triangleArea(vertex0, vertex1, vertex2);
            totalArea += area;
            areaArray.push(area);
        }

        var weightArraySize = Math.max(100, triangleCount * 10);
        var triangleWeightArray = [];
        for (i = 0; i < triangleCount; i++) {
            var weight = Math.floor(areaArray[i] / totalArea * weightArraySize);
            weight = Math.max(1, weight);
            for (j = 0; j < weight; j++) {
                triangleWeightArray.push(i);
            }
        }
        return triangleWeightArray;
    }

    triangleArea(v0, v1, v2) {
        var scratchCartesian0 = new SuperMap3D.Cartesian3();
        var scratchCartesian1 = new SuperMap3D.Cartesian3();
        var scratchCartesian2 = new SuperMap3D.Cartesian3();
        scratchCartesian0 = SuperMap3D.Cartesian3.subtract(v1, v0, scratchCartesian0);
        scratchCartesian1 = SuperMap3D.Cartesian3.subtract(v2, v0, scratchCartesian1);
        scratchCartesian2 = SuperMap3D.Cartesian3.cross(scratchCartesian0, scratchCartesian1, scratchCartesian2);
        return 0.5 * SuperMap3D.Cartesian3.magnitude(scratchCartesian2);
    }

    randomVertex(r1, r2, A, B, C) {
        return (1 - Math.sqrt(r1)) * A + Math.sqrt(r1) * (1 - r2) * B + Math.sqrt(r1) * r2 * C;
    }

    getOneRandomPosition () {
        if (!SuperMap3D.defaultValue(this._geometry)) {
            return;
        }
        var indexInWeightArray = Math.floor(SuperMap3D.Math.randomBetween(0.0, this._triangleArrayByWeight.length));
        var triangleIndex = this._triangleArrayByWeight[indexInWeightArray];
        var vertexIndex0 = this._geometry.indices[triangleIndex * 3];
        var vertexIndex1 = this._geometry.indices[triangleIndex * 3 + 1];
        var vertexIndex2 = this._geometry.indices[triangleIndex * 3 + 2];
        var vertices = this._geometry.attributes.position.values;
        var vertex0X = vertices[vertexIndex0 * 3];
        var vertex0Y = vertices[vertexIndex0 * 3 + 1];
        var vertex0Z = vertices[vertexIndex0 * 3 + 2];

        var vertex1X = vertices[vertexIndex1 * 3];
        var vertex1Y = vertices[vertexIndex1 * 3 + 1];
        var vertex1Z = vertices[vertexIndex1 * 3 + 2];

        var vertex2X = vertices[vertexIndex2 * 3];
        var vertex2Y = vertices[vertexIndex2 * 3 + 1];
        var vertex2Z = vertices[vertexIndex2 * 3 + 2];

        var r1 = SuperMap3D.Math.randomBetween(0.0, 1.0);
        var r2 = SuperMap3D.Math.randomBetween(0.0, 1.0);
        var x = this.randomVertex(r1, r2, vertex0X, vertex1X, vertex2X);
        var y = this.randomVertex(r1, r2, vertex0Y, vertex1Y, vertex2Y);
        var z = this.randomVertex(r1, r2, vertex0Z, vertex1Z, vertex2Z);

        return SuperMap3D.Cartesian3.fromElements(x, y, z);
    };
}

export default Emitter;