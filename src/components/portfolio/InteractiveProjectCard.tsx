import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type Challenge = {
  problem: string;
  solution: string;
  outcome: string;
}

type InteractiveProject = {
  title: string;
  description: string;
  technologies: string[];
  challenge: Challenge;
  businessImpact: string;
  teamSize: string;
  link?: string;
}

type Props = {
  project: InteractiveProject;
  index: number;
}

const InteractiveProjectCard = ({ project, index }: Props) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'challenge' | 'impact'>('overview');
  
  const Wrapper = project.link ? (props: any) => <a {...props} href={project.link} target="_blank" rel="noreferrer" /> : (props: any) => <div {...props} />

  const tabContent = {
    overview: {
      icon: "📋",
      title: "The Challenge",
      content: project.description
    },
    challenge: {
      icon: "🧩", 
      title: "How We Solved It",
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">The Problem:</p>
            <p className="text-sm text-red-700 dark:text-red-300">{project.challenge.problem}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Our Solution:</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">{project.challenge.solution}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">The Result:</p>
            <p className="text-sm text-green-700 dark:text-green-300">{project.challenge.outcome}</p>
          </div>
        </div>
      )
    },
    impact: {
      icon: "🎯",
      title: "Business Impact",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Business Outcome:</p>
            <p className="font-medium">{project.businessImpact}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Team Size:</span>
            <Badge variant="outline">{project.teamSize}</Badge>
          </div>
        </div>
      )
    }
  };

  return (
    <Wrapper>
      <Card className={`group h-full transition-all duration-500 hover-scale border-2 hover:border-primary/20 bg-gradient-to-br from-card to-muted/30 hover:shadow-floating overflow-hidden fade-in-up stagger-${(index % 4) + 1}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardHeader className="relative z-10 pb-4">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            {project.title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            <span className="italic text-primary/70">"Let me tell you about this one..."</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            {Object.entries(tabContent).map(([key, content]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                  activeTab === key 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <span className="mr-1">{content.icon}</span>
                {content.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[120px] transition-all duration-300">
            <div className="text-sm leading-relaxed">
              {typeof tabContent[activeTab].content === 'string' ? (
                <p>{tabContent[activeTab].content}</p>
              ) : (
                tabContent[activeTab].content
              )}
            </div>
          </div>

          {/* Technologies */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Built with:</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech, techIndex) => (
                <Badge 
                  key={tech} 
                  variant="secondary" 
                  className="text-xs px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  style={{ animationDelay: `${techIndex * 0.1}s` }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Did you know section */}
          <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border-l-2 border-primary/30">
            <p className="text-xs text-primary/70 font-medium mb-1">💡 Did you know?</p>
            <p className="text-xs text-muted-foreground italic">
              {index === 0 && "This system handles more daily transactions than most banks!"}
              {index === 1 && "The ML models retrain themselves when they detect data drift."}
              {index === 2 && "Migration was done with zero downtime during Black Friday."}
              {index === 3 && "The observability dashboard prevented 15+ incidents last month."}
            </p>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default InteractiveProjectCard;