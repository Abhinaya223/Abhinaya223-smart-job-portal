import React, { useRef, useEffect } from 'react';

export default function JobPortal3DCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Nodes array for Canvas 3D particle network simulation
    const nodeCount = 55;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 2,
        color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#06b6d4' : '#ec4899',
      });
    }

    // 3D Floating Polyhedrons (cubes/diamonds)
    const shapes = [
      { x: width * 0.2, y: height * 0.3, z: 50, rotX: 0, rotY: 0, size: 40, color: 'rgba(99, 102, 241, 0.4)' },
      { x: width * 0.8, y: height * 0.25, z: -20, rotX: 0, rotY: 0, size: 50, color: 'rgba(6, 182, 212, 0.35)' },
      { x: width * 0.85, y: height * 0.75, z: 80, rotX: 0, rotY: 0, size: 35, color: 'rgba(236, 72, 153, 0.4)' },
      { x: width * 0.15, y: height * 0.8, z: -40, rotX: 0, rotY: 0, size: 45, color: 'rgba(168, 85, 247, 0.35)' }
    ];

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background ambient light radial spots
      const grad1 = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, width * 0.6);
      grad1.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      grad1.addColorStop(1, 'rgba(8, 11, 20, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Update & Draw 3D Floating Polyhedrons
      shapes.forEach((s) => {
        s.rotX += 0.008;
        s.rotY += 0.012;

        const perspective = 600 / (600 + s.z);
        const px = (s.x - width / 2) * perspective + width / 2;
        const py = (s.y - height / 2) * perspective + height / 2;
        const pSize = s.size * perspective;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(s.rotX);
        
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.rect(-pSize / 2, -pSize / 2, pSize, pSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-pSize * 0.7, 0);
        ctx.lineTo(0, -pSize * 0.7);
        ctx.lineTo(pSize * 0.7, 0);
        ctx.lineTo(0, pSize * 0.7);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      });

      // Update & Render Nodes & Connecting Lines
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        if (node.z < -200 || node.z > 200) node.vz *= -1;

        const scale = 500 / (500 + node.z);
        const projX = (node.x - width / 2) * scale + width / 2;
        const projY = (node.y - height / 2) * scale + height / 2;

        // Draw node
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(1, node.radius * scale), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Connect nearby nodes with lines
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const oScale = 500 / (500 + other.z);
          const oProjX = (other.x - width / 2) * oScale + width / 2;
          const oProjY = (other.y - height / 2) * oScale + height / 2;

          const dx = projX - oProjX;
          const dy = projY - oProjY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(projX, projY);
            ctx.lineTo(oProjX, oProjY);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 130) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
