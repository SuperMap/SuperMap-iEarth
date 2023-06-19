
class ParticleSystem {
    constructor() {
        this.gravityScratch = new Cesium.Cartesian3();
        this.option = null;
        this.particleSystem = null;
        this.particleSystems = [];
        this.gravity = 1;
        this.emitterModelMatrix = new Cesium.Matrix4();
        this.translation = new Cesium.Cartesian3();
        this.rotation = new Cesium.Quaternion();
        this.hpr = new Cesium.HeadingPitchRoll();
        this.trs = new Cesium.TranslationRotationScale();

                // 烟花
                this.fireWokes = [];
                this.emitterInitialLocation = new Cesium.Cartesian3(0.0, 0.0, 200.0);
                this.emitterModelMatrixScratch = new Cesium.Matrix4();
                this.applyGravity;
    }
    create(option, position) {//模型位置/区域火位置
        this.option = Object.assign({}, option);
        this.gravity = this.option.gravity;
        let applyGravity = (p, dt) => {
            Cesium.Cartesian3.normalize(p.position, this.gravityScratch);
            Cesium.Cartesian3.multiplyByScalar(this.gravityScratch, Number(this.gravity) * dt, this.gravityScratch);
            p.velocity = Cesium.Cartesian3.add(p.velocity, this.gravityScratch, p.velocity);
        }
        this.particleSystem = viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                image: option.image,
                startColor: Cesium.Color.fromCssColorString(option.startColor),
                endColor: Cesium.Color.fromCssColorString(option.endColor),
                startScale: Number(option.startScale),
                endScale: Number(option.endScale),
                minimumParticleLife: Number(option.particleLife[0]),
                maximumParticleLife: Number(option.particleLife[1]),
                minimumSpeed: Number(option.speed[0]),
                maximumSpeed: Number(option.speed[1]),
                imageSize: new Cesium.Cartesian2(Number(option.particleSize), Number(option.particleSize)),
                emissionRate: Number(option.emissionRate),
                lifetime: Number(option.lifetime),
                //循环是否开启
                loop: true,
                //爆炸效果
                // bursts: option.bursts,
                sizeInMeters: true,
                // performance: false,
                emitter: this.computeEmitter(option.emitter, position),
                // emitterModelMatrix: this.computeEmitterModelMatrix(undefined, undefined, position),
                // updateCallback: applyGravity,
                // modelMatrix: this.computeModelMatrix(position),
            }))
        this.particleSystems.push(this.particleSystem);
        return this.particleSystem;
    }


    computeModelMatrix(position) {
        if (!position || Array.isArray(position)) return Cesium.Matrix4.IDENTITY;
        return Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4())
    }
    computeEmitterModelMatrix(HeadingPitchRoll, translation, position) {
        if (!position || Array.isArray(position)) return Cesium.Matrix4.IDENTITY;
        this.hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0, this.hpr);
        this.trs.translation = Cesium.Cartesian3.fromElements(0, 0, 3, this.translation);
        if (HeadingPitchRoll)
            this.hpr = Cesium.HeadingPitchRoll.fromDegrees(HeadingPitchRoll.heading, HeadingPitchRoll.pitch, HeadingPitchRoll.roll, this.hpr);
        if (translation)
            this.trs.translation = Cesium.Cartesian3.fromElements(translation.x, translation.y, translation.z, this.translation);
        this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(this.hpr, this.rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(this.trs, this.emitterModelMatrix);
    }

    computeEmitter(emitterOptions, positions) {
        let emitter;
        let type = emitterOptions[0];
        let data = emitterOptions[1];
        switch (type) {
            case "CircleEmitter":
                emitter = new Cesium.CircleEmitter(...data);
                break;
            case "SphereEmitter":
                emitter = new Cesium.SphereEmitter(...data);
                break;
            case "ConeEmitter":
                emitter = new Cesium.ConeEmitter(Cesium.Math.toRadians(...data));
                break;
            case "BoxEmitter":
                emitter = new Cesium.BoxEmitter(new Cesium.Cartesian3(...data));
                break;
            case "PolygonEmitter":
                emitter = new Cesium.PolygonEmitter(positions);
                //关闭时，拉远看粒子数量不会减少
                // setTimeout(()=>this.particleSystem.lodRangeScale=100,1000)
                break;
            default: emitter = new Cesium.CircleEmitter(2.0);
                break;
        }
        return emitter
    }

    // 添加烟花
    createFirework(offset, color, bursts, centerPosition) {
        let position = Cesium.Cartesian3.add(this.emitterInitialLocation, offset, new Cesium.Cartesian3());
        let emitterModelMatrix = Cesium.Matrix4.fromTranslation(position, this.emitterModelMatrixScratch);
        function applyGravity(particle, dt) {
            let position = particle.position;
            let gravityVector = Cesium.Cartesian3.normalize(position, new Cesium.Cartesian3());
            Cesium.Cartesian3.multiplyByScalar(gravityVector, 1 * dt, gravityVector);
            particle.velocity = Cesium.Cartesian3.add(particle.velocity, gravityVector, particle.velocity);
        }
        let fireWoke = viewer.scene.primitives.add(new Cesium.ParticleSystem({
            // image: getImage(),
            image: './images/particleSystem/flaretrail6.png',
            startColor: color,
            endColor: color.withAlpha(0.0),
            // particleLife: 0.5,
            minimumParticleLife: 1,
            maximumParticleLife: 2,
            speed: 80.0,
            // minimumSpeed: 80,
            // maximumSpeed: 120,
            imageSize: new Cesium.Cartesian2(15, 15),
            emissionRate: 0,
            emitter: new Cesium.SphereEmitter(0.1),
            bursts: bursts,
            lifetime: 12,
            updateCallback: applyGravity,
            modelMatrix: this.computeModelMatrix(centerPosition),
            emitterModelMatrix: emitterModelMatrix,
            performance:false
        }));
        this.fireWokes.push(fireWoke);
    }


    clearFireWoke() {
        this.fireWokes.forEach((fw) => { viewer.scene._primitives.remove(fw) });
        this.fireWokes.length = 0;
    }

    clear() {
        if (!Cesium.defaultValue(this.particleSystem)) return;
        viewer.scene._primitives.remove(this.particleSystem);
    }

    clearAll() {
        if (this.particleSystems.length < 1) return;
        this.particleSystems.forEach((ps) => viewer.scene._primitives.remove(ps));
        this.particleSystems.length = 0;
    }
}


export default ParticleSystem