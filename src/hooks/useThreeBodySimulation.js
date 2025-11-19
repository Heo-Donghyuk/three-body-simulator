import { useState, useEffect, useRef, useCallback } from 'react';

const G = 1.0;
const SOFTENING = 10;
const MAX_DISTANCE_FROM_ORIGIN = 600;
const BASE_DT = 0.1;

export const useThreeBodySimulation = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [bodies, setBodies] = useState([]);
    const [trails, setTrails] = useState([]);
    const [simulationType, setSimulationType] = useState('random');
    const [isAutoReset, setIsAutoReset] = useState(true);
    const [isAutoCamera, setIsAutoCamera] = useState(true);
    const [speed, setSpeed] = useState(50);
    const [zoom, setZoom] = useState(1);

    const speedRef = useRef(50);
    const requestRef = useRef();

    const generateBodies = (type) => {
        if (type === 'figure8') {
            return [
                { x: 97.000436, y: -24.308753, vx: 0.4662036850, vy: 0.4323657300, mass: 100, color: '#FF3366' },
                { x: -97.000436, y: 24.308753, vx: 0.4662036850, vy: 0.4323657300, mass: 100, color: '#33FF66' },
                { x: 0, y: 0, vx: -2 * 0.4662036850, vy: -2 * 0.4323657300, mass: 100, color: '#3366FF' }
            ];
        } else if (type === 'dynamic') {
            // Dynamic & Long-lasting preset (Fixed values for tuning)
            const newBodies = [
                {
                    x: 0,
                    y: 100,
                    vx: 0.4,
                    vy: 0,
                    mass: 120,
                    color: '#FF3366'
                },
                {
                    x: 100,
                    y: -70,
                    vx: -0.8,
                    vy: 0.4,
                    mass: 100,
                    color: '#33FF66'
                },
                {
                    x: -100,
                    y: -70,
                    vx: 0,
                    vy: -0.66,
                    mass: 80,
                    color: '#3366FF'
                }
            ];

            // Enforce Zero Net Momentum to keep system centered
            let totalMass = 0;
            let totalMomentumX = 0;
            let totalMomentumY = 0;

            newBodies.forEach(b => {
                totalMass += b.mass;
                totalMomentumX += b.mass * b.vx;
                totalMomentumY += b.mass * b.vy;
            });

            const vComX = totalMomentumX / totalMass;
            const vComY = totalMomentumY / totalMass;

            newBodies.forEach(b => {
                b.vx -= vComX;
                b.vy -= vComY;
            });

            return newBodies;
        } else {
            // Random (Standard)
            const newBodies = [];
            for (let i = 0; i < 3; i++) {
                newBodies.push({
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    vx: Math.random() * 4 - 2,
                    vy: Math.random() * 4 - 2,
                    mass: Math.random() * 60 + 80,
                    color: i === 0 ? '#FF3366' : i === 1 ? '#33FF66' : '#3366FF'
                });
            }

            let totalMass = 0;
            let totalMomentumX = 0;
            let totalMomentumY = 0;

            newBodies.forEach(b => {
                totalMass += b.mass;
                totalMomentumX += b.mass * b.vx;
                totalMomentumY += b.mass * b.vy;
            });

            const vComX = totalMomentumX / totalMass;
            const vComY = totalMomentumY / totalMass;

            newBodies.forEach(b => {
                b.vx -= vComX;
                b.vy -= vComY;
            });

            return newBodies;
        }
    };

    const initializeBodies = useCallback((type) => {
        setBodies(generateBodies(type));
        setTrails([[], [], []]);
        setSimulationType(type);
    }, []);

    useEffect(() => {
        initializeBodies('dynamic');
    }, [initializeBodies]);

    const handleSpeedChange = (e) => {
        const newSpeed = parseInt(e.target.value, 10);
        setSpeed(newSpeed);
        speedRef.current = newSpeed;
    };

    const handleZoomChange = (e) => {
        setZoom(parseFloat(e.target.value));
    };

    const updatePhysics = useCallback(() => {
        setBodies(prevBodies => {
            const newBodies = prevBodies.map(b => ({ ...b }));
            const iterations = speedRef.current;

            for (let step = 0; step < iterations; step++) {
                for (let i = 0; i < newBodies.length; i++) {
                    let fx = 0;
                    let fy = 0;
                    for (let j = 0; j < newBodies.length; j++) {
                        if (i === j) continue;
                        const dx = newBodies[j].x - newBodies[i].x;
                        const dy = newBodies[j].y - newBodies[i].y;
                        const distSq = dx * dx + dy * dy + SOFTENING;
                        // const dist = Math.sqrt(distSq); // Unused
                        const f = (G * newBodies[i].mass * newBodies[j].mass) / distSq;
                        const dist = Math.sqrt(distSq);
                        fx += f * (dx / dist);
                        fy += f * (dy / dist);
                    }
                    newBodies[i].vx += (fx / newBodies[i].mass) * BASE_DT;
                    newBodies[i].vy += (fy / newBodies[i].mass) * BASE_DT;
                }

                for (let i = 0; i < newBodies.length; i++) {
                    newBodies[i].x += newBodies[i].vx * BASE_DT;
                    newBodies[i].y += newBodies[i].vy * BASE_DT;
                }
            }

            if (isAutoReset) {
                const outOfBoundsCount = newBodies.filter(b => {
                    const distFromOrigin = Math.sqrt(b.x * b.x + b.y * b.y);
                    return distFromOrigin > MAX_DISTANCE_FROM_ORIGIN;
                }).length;

                if (outOfBoundsCount >= 2) {
                    setTrails([[], [], []]);
                    return generateBodies(simulationType);
                }
            }

            setTrails(prevTrails => {
                const newTrails = prevTrails.map((trail, i) => {
                    const newTrail = [...trail, { x: newBodies[i].x, y: newBodies[i].y }];
                    const maxTrailLength = Math.min(2000, 300 + (speedRef.current * 20));
                    if (newTrail.length > maxTrailLength) newTrail.shift();
                    return newTrail;
                });
                return newTrails;
            });

            return newBodies;
        });
    }, [isAutoReset, simulationType]);

    const animate = useCallback(() => {
        updatePhysics();
        requestRef.current = requestAnimationFrame(animate);
    }, [updatePhysics]);

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, animate]);

    return {
        bodies,
        trails,
        isPlaying,
        setIsPlaying,
        simulationType,
        isAutoReset,
        setIsAutoReset,
        isAutoCamera,
        setIsAutoCamera,
        speed,
        handleSpeedChange,
        zoom,
        handleZoomChange,
        initializeBodies
    };
};
