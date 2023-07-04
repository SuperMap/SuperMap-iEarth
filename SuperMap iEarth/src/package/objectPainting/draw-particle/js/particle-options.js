export default [
    {
        id: 0,
        iconName: "drawParticle-fire",
        name: "火焰",
        nameEN: 'flame',
        children: [
            {
                image: './images/particleSystem/base_fire.png',
                startColor: 'rgba(255, 255, 255, 0.3)',
                endColor: 'rgba(0, 0, 0, 0)',
                lifetime: 6.0,
                loop: true,
                sizeInMeters: true,
                emissionRate: 50.0,
                gravity: 0.0,
                particleLife: [1.5, 1.6],
                speed: [3.5, 4],
                startScale: 2.5,
                endScale: 1.0,
                particleSize: 2,
                emitter: ['ConeEmitter', [60]]
            },
            {
                image: './images/particleSystem/explosive_fire.png',
                startColor: 'rgba(255, 255, 255, 1)',
                endColor: 'rgba(51,51, 51, 0)',
                lifetime: 5,
                loop: true,
                sizeInMeters: true, //
                emissionRate: 30,
                gravity: 0.5,
                particleLife: [1.6, 2.2],
                speed: [3, 4],
                startScale: 3,
                endScale: 1.5,
                particleSize: 2,
                emitter: ['ConeEmitter', [65]]
            },
            {
                image: './images/particleSystem/circle_fire.png',
                startColor: 'rgba(255, 255, 255, 0.3)',
                endColor: 'rgba(102, 76.5, 0, 0)',
                lifetime: 6.0,
                loop: true,
                sizeInMeters: true, //
                emissionRate: 200.0,
                gravity: 0.0,
                particleLife: [3, 4],
                speed: [0.1, 3],
                startScale: 1,
                endScale: 2,
                particleSize: 5,
                emitter: ['CircleEmitter', [25, 30]]
            },
            {
                image: './images/particleSystem/flowing_fire.png',
                startColor: 'rgba(255, 255, 255, 0.8)',
                endColor: 'rgba(0, 0, 0, 0)',
                lifetime: 16.0,
                loop: true,
                sizeInMeters: true, //
                emissionRate: 1800.0,
                gravity: 1.0,
                particleLife: [1.5, 5],
                speed: [6, 24],
                startScale: 2,
                endScale: 4,
                particleSize: 6,
                emitter: ['PolygonEmitter', []]
            }
        ],
        isSelect: true,
    },
    {
        id: 1,
        iconName: "drawParticle-water",
        name: "水",
        nameEN: 'water',
        children: [
            {
                image: './images/particleSystem/waterspout.png',
                startColor: 'rgba(255, 255, 255, 0.6)',
                endColor: 'rgba(204, 219, 255, 0.4)',
                lifetime: 16.0,
                loop: true,
                sizeInMeters: true, //
                emissionRate: 40.0,
                gravity: -2.6,
                particleLife: [5, 6],
                speed: [9, 9.5],
                startScale: 1,
                endScale: 20.0,
                particleSize: 1,
                emitter: ['CircleEmitter', [0.2]]
            },
            {
                image: './images/particleSystem/waterspout.png',
                startColor: 'rgba(146, 170, 193, 1)',
                endColor: 'rgba(146, 170, 193, 0)',
                lifetime: 16.0,
                loop: true,
                sizeInMeters: true, //
                emissionRate: 40.0,
                gravity: -0.5,
                particleLife: [7, 7],
                speed: [4, 4],
                startScale: 1,
                endScale: 1.5,
                particleSize: 1,
                emitter: ['CircleEmitter', [0.2]]
            },
        ],
        isSelect: false
    },
    {
        id: 2,
        iconName: "drawParticle-fireworks",
        name: "烟花",
        nameEN: 'fireworks',
        children: [],
        isSelect: false
    },
]