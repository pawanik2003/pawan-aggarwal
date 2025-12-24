import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Section from "@/components/portfolio/Section";
import ProjectCard from "@/components/portfolio/ProjectCard";
import InteractiveProjectCard from "@/components/portfolio/InteractiveProjectCard";
import LeadershipSection from "@/components/portfolio/LeadershipSection";
import PublicationCard from "@/components/portfolio/PublicationCard";
import ContactForm from "@/components/portfolio/ContactForm";
import Footer from "@/components/portfolio/Footer";
import VoiceAgent from "@/components/VoiceAgent";
import { profile } from "@/content/profile";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />

        <Section id="story" title="My Story" subtitle="How I learned to make complex data systems beautifully simple.">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="glass-card p-8 rounded-3xl fade-in-up group hover:scale-[1.02] transition-all duration-300">
              <article className="leading-relaxed text-lg text-muted-foreground space-y-6">
                <p className="text-xl font-medium text-foreground mb-4">
                  <span className="text-primary">🚀</span> Picture this: You have <span className="gradient-text font-bold">{profile.experienceYears} years</span> to figure out how to move billions of data points without breaking anything. That's been my adventure across finance, retail, and SaaS.
                </p>
                <p>
                  <span className="text-primary mr-2">🎯</span>I learned early that the best data architectures are like good conversations—they flow naturally, make sense, and people actually want to use them.
                </p>
                <p>
                  <span className="text-primary mr-2">🌟</span>These days, I focus on what I call "invisible infrastructure"—systems so reliable and well-designed that teams forget they exist. That's when you know you've built something special.
                </p>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic text-muted-foreground">
                    <span className="text-primary font-medium">💡 Fun fact:</span> The most successful data platform I built saved the company $2M annually—and the CEO said it was "boring" because it never broke. Best compliment ever!
                  </p>
                </div>
              </article>
            </div>
            <div className="space-y-6 fade-in-up stagger-1">
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary group hover:shadow-floating transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-semibold text-lg gradient-text">Leadership Philosophy</h3>
                </div>
                <p className="text-muted-foreground">Teams thrive when they understand the "why" behind decisions. I believe in mentoring through doing, not just telling.</p>
                <div className="mt-3 text-xs text-primary/60 italic">
                  Tip: Great data leaders are translators between business and tech
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary-glow group hover:shadow-floating transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-semibold text-lg gradient-text">Technical Approach</h3>
                </div>
                <p className="text-muted-foreground">Start simple, scale smart. Every architecture decision should make the next engineer's life easier, not harder.</p>
                <div className="mt-3 text-xs text-primary/60 italic">
                  Mantra: "If you can't explain it simply, you don't understand it well enough"
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary group hover:shadow-floating transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-semibold text-lg gradient-text">Business Impact</h3>
                </div>
                <p className="text-muted-foreground">Data without context is just noise. I connect technical excellence to real business outcomes that matter.</p>
                <div className="mt-3 text-xs text-primary/60 italic">
                  Secret: The best metrics are the ones executives actually use
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Data Engineering Showcases" subtitle="Real projects, real challenges, real impact. Here's how we solved complex problems together.">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Real-time Streaming Data Platform",
                description: "When your fraud detection needs to catch bad actors in under 100ms, traditional batch processing won't cut it.",
                technologies: ["Kafka", "Spark Streaming", "AWS Kinesis", "Scala", "Terraform"],
                challenge: {
                  problem: "Legacy batch system was taking 6+ hours to detect fraud, costing millions in losses",
                  solution: "Built a real-time streaming architecture with Kafka and Spark that processes events as they happen",
                  outcome: "Reduced fraud detection time from hours to milliseconds, saving $15M annually"
                },
                businessImpact: "99.9% uptime, sub-second fraud detection, $15M annual savings",
                teamSize: "8 engineers"
              },
              {
                title: "MLOps Pipeline for Demand Forecasting", 
                description: "Turning data science experiments into production-ready ML that actually helps business decisions.",
                technologies: ["TensorFlow", "MLflow", "Airflow", "Docker", "Kubernetes"],
                challenge: {
                  problem: "Data scientists were building great models that never made it to production",
                  solution: "Created an end-to-end MLOps pipeline with automated training, testing, and deployment",
                  outcome: "18% improvement in forecast accuracy, models now deploy in hours not months"
                },
                businessImpact: "18% better forecasts, 10x faster model deployment, $5M inventory optimization",
                teamSize: "6 engineers + 4 data scientists"
              },
              {
                title: "Cloud Data Lakehouse Modernization",
                description: "Sometimes the best migration is the one your users don't even notice happened.",
                technologies: ["Databricks", "Delta Lake", "dbt", "AWS S3", "Glue"],
                challenge: {
                  problem: "On-premise data warehouse was slow, expensive, and couldn't scale with business growth",
                  solution: "Migrated to a modern lakehouse architecture with zero downtime during peak business season",
                  outcome: "40% cost reduction, 10x faster queries, unlimited scalability"
                },
                businessImpact: "40% cost savings, 10x query performance, zero migration downtime",
                teamSize: "12 engineers"
              },
              {
                title: "Batch + CDC Data Pipelines",
                description: "Building the data nervous system that keeps 200+ teams moving at the speed of insight.",
                technologies: ["Airbyte", "Debezium", "Snowflake", "Great Expectations", "OpenLineage"],
                challenge: {
                  problem: "Data was siloed across 50+ systems, analytics teams waited days for fresh data",
                  solution: "Implemented unified ingestion with change data capture and comprehensive monitoring",
                  outcome: "Real-time data availability, 200+ automated use cases, full data lineage"
                },
                businessImpact: "Real-time analytics, 95% automated data quality, 200+ active use cases",
                teamSize: "10 engineers"
              }
            ].map((project, index) => (
              <InteractiveProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg border border-primary/20">
              <span className="text-primary text-xl">🎯</span>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Curious about the technical details?</span> Each project has unique architectural decisions—happy to dive deeper in a conversation!
              </p>
            </div>
          </div>
        </Section>

        <Section id="skills" title="My Toolkit" subtitle="The technologies I reach for when building robust, scalable data systems.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                category: "Core Languages", 
                skills: profile.skills.slice(0, 5),
                emoji: "💻",
                tooltip: "My daily drivers for data processing and ML"
              },
              { 
                category: "Cloud & Infrastructure", 
                skills: profile.skills.slice(5, 10),
                emoji: "☁️",
                tooltip: "Building scalable, reliable systems in the cloud"
              },
              { 
                category: "Data & ML Ecosystem", 
                skills: profile.skills.slice(10),
                emoji: "🔧",
                tooltip: "Specialized tools for data pipelines and ML operations"
              }
            ].map((group, groupIndex) => (
              <div key={group.category} className={`fade-in-up stagger-${groupIndex + 1} glass-card p-6 rounded-2xl group hover:shadow-floating transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{group.emoji}</span>
                  <h3 className="font-semibold text-lg gradient-text">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.skills.map((skill, index) => (
                    <span 
                      key={skill} 
                      className={`rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-default fade-in-up hover-scale`}
                      style={{ animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s` }}
                      title={`${skill} - Click to learn more!`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground italic p-3 bg-primary/5 rounded-lg border-l-2 border-primary/30">
                  <span className="text-primary">💡</span> {group.tooltip}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              <span className="text-primary font-medium">🤔 Wondering about a specific technology?</span> 
              I love talking shop about data architecture, performance optimization, and choosing the right tool for the job.
            </p>
          </div>
        </Section>

        <LeadershipSection />

        <Section id="speaking" title="Speaking & Publications" subtitle="Talks, articles, and contributions.">
          <div className="grid gap-6 md:grid-cols-2">
            {profile.publications.map((p) => (
              <PublicationCard key={p.title} {...p} />
            ))}
          </div>
        </Section>

        <Section id="contact" title="Let's Talk Data, Systems, or Scaling Teams" subtitle="Whether you're tackling a gnarly data problem or building your next engineering team, I'd love to hear about it.">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <div className="glass-card p-6 rounded-2xl fade-in-up">
                <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center gap-2">
                  <span>💬</span> What I love chatting about
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Designing data platforms that don't break at 3am</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Building engineering teams that ship fast and learn faster</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Making ML systems that actually work in production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Cloud architecture decisions (and the mistakes I've learned from)</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card p-6 rounded-2xl fade-in-up stagger-1">
                <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center gap-2">
                  <span>🚀</span> Ready to connect?
                </h3>
                <div className="space-y-4">
                  <a 
                    href={`https://www.linkedin.com/in/pawan-aggarwal-3113a19`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200 hover-scale group"
                  >
                    <span className="text-blue-600 text-xl">💼</span>
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">LinkedIn</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Professional discussions & career updates</p>
                    </div>
                    <span className="ml-auto text-blue-600 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  
                  <a 
                    href={`mailto:pawanik2003@gmail.com?subject=Let's talk about data systems&body=Hi Pawan,%0D%0A%0D%0AI'd love to chat about...`}
                    className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200 hover-scale group"
                  >
                    <span className="text-green-600 text-xl">📧</span>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Email</p>
                      <p className="text-xs text-green-600 dark:text-green-400">For longer conversations & project discussions</p>
                    </div>
                    <span className="ml-auto text-green-600 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  
                  <a 
                    href="https://github.com/pawanik2003"
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 hover-scale group"
                  >
                    <span className="text-gray-600 text-xl">💻</span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">GitHub</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Code samples & open source contributions</p>
                    </div>
                    <span className="ml-auto text-gray-600 transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg border border-primary/20">
                <span className="text-primary text-xl">☕</span>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Response time:</span> Usually within 24 hours (unless I'm debugging a particularly stubborn pipeline!)
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
      <VoiceAgent />
    </div>
  );
};

export default Index;
