import React, { useRef, useEffect } from 'react';

const SimulationCanvas = ({ bodies, trails, zoom, isAutoCamera }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const viewRef = useRef({ x: 0, y: 0, zoom: 1 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Resize canvas to match container with DPR
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();

        // Set actual size in memory (scaled to account for extra pixel density)
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            // Normalize coordinate system to use css pixels
            // We will scale the context instead of setting style width/height which is handled by CSS
        }

        const width = rect.width;
        const height = rect.height;

        const ctx = canvas.getContext('2d');
        ctx.resetTransform(); // Reset transform to clear previous frame's scaling
        ctx.scale(dpr, dpr); // Scale all drawing operations by dpr

        // Dark background
        ctx.fillStyle = '#050b14';
        ctx.fillRect(0, 0, width, height);

        ctx.save();

        const S = Math.min(width, height) / 600;

        let targetX = 0;
        let targetY = 0;
        let targetZoom = zoom;

        if (isAutoCamera && bodies.length > 0) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            bodies.forEach(b => {
                minX = Math.min(minX, b.x);
                maxX = Math.max(maxX, b.x);
                minY = Math.min(minY, b.y);
                maxY = Math.max(maxY, b.y);
            });

            const dx = Math.max(maxX - minX, 150);
            const dy = Math.max(maxY - minY, 150);

            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;

            const contentWidth = dx * 1.8;
            const contentHeight = dy * 1.8;

            const zoomX = (width / S) / contentWidth;
            const zoomY = (height / S) / contentHeight;

            targetZoom = Math.min(zoomX, zoomY);
            targetZoom = Math.max(0.2, Math.min(targetZoom, 2.5)); // Clamp zoom

            targetX = cx;
            targetY = cy;
        } else {
            targetX = 0;
            targetY = 0;
            targetZoom = zoom;
        }

        const lerp = (start, end, factor) => start + (end - start) * factor;
        const smoothFactor = 0.05; // Slightly faster camera response

        viewRef.current.x = lerp(viewRef.current.x, targetX, smoothFactor);
        viewRef.current.y = lerp(viewRef.current.y, targetY, smoothFactor);
        viewRef.current.zoom = lerp(viewRef.current.zoom, targetZoom, smoothFactor);

        ctx.translate(width / 2, height / 2);
        const currentScale = S * viewRef.current.zoom;
        ctx.scale(currentScale, currentScale);
        ctx.translate(-viewRef.current.x, -viewRef.current.y);


        ctx.globalCompositeOperation = 'screen';

        bodies.forEach((body, index) => {
            const trail = trails[index];
            if (trail && trail.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = body.color;
                for (let i = 0; i < trail.length - 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(trail[i].x, trail[i].y);
                    ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
                    // Dynamic line width based on zoom
                    ctx.lineWidth = (2 * (i / trail.length)) / Math.sqrt(viewRef.current.zoom);
                    ctx.globalAlpha = i / trail.length;
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.arc(body.x, body.y, Math.sqrt(body.mass) * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = body.color;

            ctx.shadowBlur = 30;
            ctx.shadowColor = body.color;
            ctx.fill();

            ctx.shadowBlur = 10;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(body.x, body.y, Math.sqrt(body.mass) * 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
        });

        ctx.restore();
    }, [bodies, trails, zoom, isAutoCamera]);

    return (
        <div className="flex-1 relative" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
        </div>
    );
};

export default SimulationCanvas;
