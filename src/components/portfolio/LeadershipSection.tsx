import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LeadershipSection = () => {
  const insights = [
    {
      title: "System Thinking",
      icon: "🏗️",
      quote: "Architecture isn't just about technology—it's about enabling teams to move fast without breaking things.",
      metric: "5x faster deployment cycles",
      principle: "Design for observability, not just functionality"
    },
    {
      title: "Team Scaling",
      icon: "👥",
      quote: "The best data platforms are built by diverse teams who understand the business, not just the bytes.",
      metric: "20+ engineers mentored",
      principle: "Hire for curiosity, train for expertise"
    },
    {
      title: "Decision Making",
      icon: "⚡",
      quote: "Data-driven decisions are only as good as the systems that generate the data and the humans who interpret it.",
      metric: "40% cost reduction achieved",
      principle: "Measure twice, migrate once"
    },
    {
      title: "Innovation Balance",
      icon: "⚖️",
      quote: "Innovation without stability is chaos. Stability without innovation is stagnation.",
      metric: "99.9% uptime maintained",
      principle: "Progressive enhancement over revolutionary replacement"
    }
  ];

  return (
    <section id="leadership" className="py-20">
      <div className="container mx-auto">
        <div className="mb-16 text-center fade-in-up">
          <div className="mb-4 inline-flex items-center rounded-full bg-card/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-primary ring-1 ring-primary/30 shadow-neon">
            <span className="mr-3 h-2 w-2 rounded-full bg-primary-glow node-glow"></span>
            CONTROL ROOM • LEADERSHIP INSIGHTS
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="gradient-text">Leading Through</span>
            <br />
            <span className="text-foreground">Complex Systems</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Every great data platform starts with great people. Here's how I approach building teams, 
            making decisions, and creating systems that scale beyond just the technology.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <Card 
              key={insight.title} 
              className={`group h-full transition-all duration-500 data-card hover:shadow-data-node fade-in-up stagger-${(index % 4) + 1}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 data-pulse"></div>
              
              {/* Control Panel Header */}
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{insight.icon}</span>
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {insight.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 w-1 rounded-full bg-primary-glow node-glow"></div>
                        <span className="text-xs text-muted-foreground font-mono">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    Core Principle
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                {/* Quote Section */}
                <div className="control-panel">
                  <p className="text-sm text-muted-foreground mb-2">Leadership Philosophy:</p>
                  <blockquote className="italic text-foreground leading-relaxed">
                    "{insight.quote}"
                  </blockquote>
                </div>

                {/* Metrics Display */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg border border-primary/20">
                  <div>
                    <p className="text-xs text-muted-foreground">Impact Metric</p>
                    <p className="text-sm font-bold text-primary">{insight.metric}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary-glow node-glow"></div>
                    <div className="h-px w-8 bg-gradient-data-flow data-flow"></div>
                    <div className="h-2 w-2 rounded-full bg-primary node-glow"></div>
                  </div>
                </div>

                {/* Core Principle */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-primary/70 mb-1">Core Principle:</p>
                  <p className="text-sm font-medium text-foreground">{insight.principle}</p>
                </div>

                {/* System Status Indicator */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary-glow node-glow"></span>
                  <span>System optimal • Leadership framework active</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Panel */}
        <div className="mt-12 fade-in-up stagger-4">
          <Card className="data-card border-primary/30 shadow-data-node">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold gradient-text">Leadership Operating System</h3>
                <p className="mb-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                  Building teams and systems that thrive in complex environments requires balancing 
                  technical excellence with human-centered leadership. The best architectures serve both code and people.
                </p>
                <div className="flex justify-center items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary-glow node-glow"></div>
                    <span className="text-sm text-muted-foreground">Teams</span>
                  </div>
                  <div className="h-px w-8 bg-gradient-data-flow data-flow"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary node-glow"></div>
                    <span className="text-sm text-muted-foreground">Systems</span>
                  </div>
                  <div className="h-px w-8 bg-gradient-data-flow data-flow"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary-glow node-glow"></div>
                    <span className="text-sm text-muted-foreground">Impact</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;