import { useEffect, useRef } from "react";

const DataFlowBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Data nodes
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];
    
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.4
      });
    }

    // Connection lines
    const connections: Array<{ from: number; to: number; strength: number }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.3) {
          connections.push({
            from: i,
            to: j,
            strength: Math.random() * 0.5 + 0.1
          });
        }
      }
    }

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "rgba(13, 13, 13, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Update and draw nodes
      nodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        // Pulsing effect
        const pulseSize = node.size + Math.sin(time * 2 + index) * 1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 191, 255, ${node.opacity * (0.8 + Math.sin(time + index) * 0.2)})`;
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0, 191, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 127, ${node.opacity * 0.6})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];
        
        const distance = Math.sqrt(
          Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
        );
        
        if (distance < 200) {
          const opacity = (1 - distance / 200) * conn.strength;
          
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(0, 191, 255, ${opacity * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Data flow particles
          if (Math.random() < 0.1) {
            const progress = Math.random();
            const x = nodeA.x + (nodeB.x - nodeA.x) * progress;
            const y = nodeA.y + (nodeB.y - nodeA.y) * progress;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 127, ${opacity})`;
            ctx.fill();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-50"
      style={{ zIndex: 0 }}
    />
  );
};

export default DataFlowBackground;