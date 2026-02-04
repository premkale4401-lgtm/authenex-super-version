"use client";

import { useEffect, useRef } from "react";

interface FloatingLinesProps {
  lineCount?: number;
  color?: string;
  speed?: number;
  opacity?: number;
}

interface Line {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  width: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export default function FloatingLines({
  lineCount = 50,
  color = "#06b6d4",
  speed = 1,
  opacity = 0.3,
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lines: Line[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createLine = (): Line => {
      const line: Line = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 50 + Math.random() * 150,
        angle: Math.random() * Math.PI * 2,
        speed: (0.5 + Math.random() * 1.5) * speed,
        opacity: 0.1 + Math.random() * opacity,
        width: 0.5 + Math.random() * 1.5,
        
        update() {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;

          if (this.x < -this.length) this.x = canvas.width + this.length;
          if (this.x > canvas.width + this.length) this.x = -this.length;
          if (this.y < -this.length) this.y = canvas.height + this.length;
          if (this.y > canvas.height + this.length) this.y = -this.length;
        },

        draw(ctx: CanvasRenderingContext2D) {
          const endX = this.x + Math.cos(this.angle) * this.length;
          const endY = this.y + Math.sin(this.angle) * this.length;

          const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
          gradient.addColorStop(0, `${color}00`);
          gradient.addColorStop(0.5, `${color}${Math.floor(this.opacity * 255).toString(16).padStart(2, "0")}`);
          gradient.addColorStop(1, `${color}00`);

          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = this.width;
          ctx.stroke();
        }
      };
      return line;
    };

    const init = () => {
      resize();
      lines = [];
      for (let i = 0; i < lineCount; i++) {
        lines.push(createLine());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      lines.forEach((line) => {
        line.update();
        line.draw(ctx);
      });

      // Draw connections
      lines.forEach((line1, i) => {
        lines.slice(i + 1).forEach((line2) => {
          const dx = line1.x - line2.x;
          const dy = line1.y - line2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const connectionOpacity = (1 - distance / 150) * 0.1 * opacity;
            ctx.beginPath();
            ctx.moveTo(line1.x, line1.y);
            ctx.lineTo(line2.x, line2.y);
            ctx.strokeStyle = `${color}${Math.floor(connectionOpacity * 255).toString(16).padStart(2, "0")}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationId);
    };
  }, [lineCount, color, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}