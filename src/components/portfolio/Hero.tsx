import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import headshot from "@/assets/headshot.jpg";
import { profile } from "@/content/profile";

const Hero = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x, y });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      <div ref={ref} className="relative">
        {/* Signature gradient spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(400px_400px_at_center,black,transparent)]"
          style={{
            background: `radial-gradient(600px 600px at ${pos.x}% ${pos.y}%, hsl(var(--primary)/0.15), transparent 60%)`,
          }}
          aria-hidden
        />

        <div className="container mx-auto grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="relative z-10 animate-enter">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
              {profile.role}
            </p>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {profile.name} — Data Engineering & AI Expert
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              {profile.summary}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects"><Button variant="hero" size="lg">View My Work</Button></a>
              <a href="#contact"><Button variant="outline" size="lg">Get in Touch</Button></a>
            </div>
          </div>
          <div className="relative z-10 order-first justify-self-center md:order-none">
            <div className="rounded-2xl border bg-card p-2 shadow-elevated">
              <img
                src={headshot}
                alt={`Professional headshot of ${profile.name}, ${profile.role}`}
                className="h-56 w-56 rounded-xl object-cover md:h-72 md:w-72"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
