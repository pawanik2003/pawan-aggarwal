import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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

        <div className="container mx-auto grid items-center gap-12 py-20 md:grid-cols-2 md:py-32">
          <div className="relative z-10 fade-in-up">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {profile.role}
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
              <span className="gradient-text">{profile.name.split(' ')[0]}</span>
              <br />
              <span className="text-foreground">{profile.name.split(' ')[1]}</span>
            </h1>
            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {profile.summary}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#projects" className="fade-in-up stagger-1">
                <Button variant="hero" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-floating pulse-glow">
                  View My Work
                </Button>
              </a>
              <a href="#contact" className="fade-in-up stagger-2">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 hover:shadow-floating">
                  Get in Touch
                </Button>
              </a>
            </div>
          </div>
          <div className="relative z-10 order-first justify-self-center md:order-none fade-in-up stagger-3">
            <div className="relative floating-animation">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary-glow/20 blur-xl"></div>
              <div className="relative rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white to-gray-50 p-3 shadow-floating dark:from-gray-900 dark:to-gray-800">
                <img
                  src="/lovable-uploads/61149ba0-5866-45d4-bda3-53174a593234.png"
                  alt={`Professional headshot of ${profile.name}, ${profile.role}`}
                  className="h-64 w-64 rounded-2xl object-cover md:h-80 md:w-80 lg:h-96 lg:w-96"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
