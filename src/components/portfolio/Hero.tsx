import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import DataFlowBackground from "./DataFlowBackground";
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
    <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
      {/* Data Flow Background */}
      <DataFlowBackground />
      
      <div ref={ref} className="relative z-10 w-full">
        {/* Interactive data pulse spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(500px_500px_at_center,black,transparent)]"
          style={{
            background: `radial-gradient(800px 800px at ${pos.x}% ${pos.y}%, hsl(var(--primary)/0.2), hsl(var(--primary-glow)/0.1), transparent 70%)`,
          }}
          aria-hidden
        />

        <div className="container mx-auto grid items-center gap-12 py-20 md:grid-cols-2 md:py-32">
          <div className="relative z-20 fade-in-up">
            {/* Data Stream Indicator */}
            <div className="mb-6 inline-flex items-center rounded-full bg-card/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-primary ring-1 ring-primary/30 shadow-neon">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-glow node-glow"></span>
              </span>
              <span className="data-flow bg-gradient-data-flow bg-[length:200%_100%] bg-clip-text text-transparent">
                LIVE DATA STREAM • {profile.role}
              </span>
            </div>

            {/* Pipeline Visualization */}
            <div className="mb-8 flex items-center gap-3 opacity-60">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary data-flow"></div>
              <div className="h-2 w-2 rounded-full bg-primary-glow node-glow"></div>
              <div className="h-px w-12 bg-gradient-data-flow data-flow"></div>
              <div className="h-2 w-2 rounded-full bg-primary node-glow"></div>
              <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent data-flow"></div>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
              <span className="gradient-text data-pulse">{profile.name.split(' ')[0]}</span>
              <br />
              <span className="text-foreground">{profile.name.split(' ')[1]}</span>
            </h1>
            
            <div className="mb-6 max-w-2xl space-y-4">
              <p className="text-xl leading-relaxed text-muted-foreground">
                <span className="text-foreground font-medium">Architecting data systems</span> that process billions of events while staying invisible to users. I transform complex data challenges into elegant, scalable solutions.
              </p>
              
              <div className="control-panel">
                <div className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 rounded-full bg-primary-glow node-glow"></span>
                  <span className="text-muted-foreground">Processing</span>
                  <span className="font-mono text-primary">∞ events/sec</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-mono text-primary-glow">99.99%</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-mono text-primary">{profile.experienceYears}+ years</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#projects" className="fade-in-up stagger-1">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-neon data-pulse group">
                  <span>Explore Systems</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">⚡</span>
                </Button>
              </a>
              <a href="#leadership" className="fade-in-up stagger-2">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-primary/30 hover:border-primary hover:bg-primary/10 group">
                  <span>Leadership Insights</span>
                  <span className="ml-2 text-primary-glow">🎯</span>
                </Button>
              </a>
            </div>
          </div>
          
          <div className="relative z-20 order-first justify-self-center md:order-none fade-in-up stagger-3">
            <div className="relative">
              {/* Data nodes around image */}
              <div className="absolute -inset-8">
                <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-primary-glow node-glow"></div>
                <div className="absolute top-1/2 -right-4 h-2 w-2 rounded-full bg-primary node-glow"></div>
                <div className="absolute bottom-8 right-8 h-4 w-4 rounded-full bg-primary/60 node-glow"></div>
                <div className="absolute bottom-4 -left-4 h-2 w-2 rounded-full bg-primary-glow node-glow"></div>
                <div className="absolute top-8 -left-4 h-3 w-3 rounded-full bg-primary node-glow"></div>
              </div>
              
              <div className="relative floating-animation">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-primary-glow/30 blur-xl data-pulse"></div>
                <div className="relative rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card to-secondary/20 p-3 shadow-data-node backdrop-blur-sm">
                  <img
                    src="/lovable-uploads/pawan-headshot.png"
                    alt={`${profile.name}, ${profile.role} - Data Engineering Leader`}
                    className="h-64 w-64 rounded-2xl object-cover md:h-80 md:w-80 lg:h-96 lg:w-96"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
