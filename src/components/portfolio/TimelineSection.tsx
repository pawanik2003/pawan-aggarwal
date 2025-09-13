import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  skills: string[];
}

const timelineData: TimelineItem[] = [
  {
    year: "2024",
    title: "Senior Data Engineering Leader",
    company: "Tech Innovators Inc.",
    description: "Leading data transformation initiatives across multiple business units.",
    achievements: [
      "Reduced data processing time by 60%",
      "Built ML pipelines serving 10M+ users",
      "Led team of 15 data engineers"
    ],
    skills: ["Python", "Apache Spark", "AWS", "Team Leadership"]
  },
  {
    year: "2022",
    title: "Principal Data Engineer",
    company: "Scale Systems",
    description: "Architected enterprise-scale data infrastructure and analytics platforms.",
    achievements: [
      "Designed real-time analytics for 50M+ events/day",
      "Implemented data governance framework",
      "Mentored 8 junior engineers"
    ],
    skills: ["Kafka", "Snowflake", "dbt", "Kubernetes"]
  },
  {
    year: "2020",
    title: "Senior Data Engineer",
    company: "Growth Analytics Co.",
    description: "Built scalable data pipelines and machine learning infrastructure.",
    achievements: [
      "Optimized ETL performance by 40%",
      "Deployed ML models to production",
      "Established data quality monitoring"
    ],
    skills: ["Python", "Airflow", "PostgreSQL", "Docker"]
  }
];

const TimelineSection = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-foreground">Career Milestones</h2>
          <p className="lead max-w-2xl mx-auto">
            A journey of scaling data systems and empowering teams to innovate through intelligent data solutions.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/20"></div>

          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <div key={index} className="relative">
                {/* Timeline Node */}
                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-soft"></div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-1/2 md:mr-8' : 'md:pl-1/2 md:ml-8'}`}>
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-floating ${
                      activeItem === index ? 'shadow-floating border-primary/30' : ''
                    }`}
                    onMouseEnter={() => setActiveItem(index)}
                    onMouseLeave={() => setActiveItem(null)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary" className="font-mono">
                          {item.year}
                        </Badge>
                        <h3 className="text-foreground">{item.title}</h3>
                      </div>
                      
                      <p className="text-primary font-medium mb-3">{item.company}</p>
                      <p className="mb-4">{item.description}</p>

                      {activeItem === index && (
                        <div className="space-y-4 animate-in fade-in-50 duration-300">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Key Achievements</h4>
                            <ul className="text-sm space-y-1">
                              {item.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-1.5 text-xs">▶</span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.skills.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;