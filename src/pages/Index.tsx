import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Section from "@/components/portfolio/Section";
import ProjectCard from "@/components/portfolio/ProjectCard";
import PublicationCard from "@/components/portfolio/PublicationCard";
import ContactForm from "@/components/portfolio/ContactForm";
import Footer from "@/components/portfolio/Footer";
import { profile } from "@/content/profile";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />

        <Section id="about" title="About Me" subtitle="Career journey, values, and leadership philosophy.">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="glass-card p-8 rounded-3xl fade-in-up">
              <article className="leading-relaxed text-lg text-muted-foreground space-y-6">
                <p className="text-xl font-medium text-foreground mb-4">
                  With <span className="gradient-text font-bold">{profile.experienceYears}+ years</span> in data engineering and AI, I've led teams to build scalable platforms and production ML systems across finance, retail, and SaaS.
                </p>
                <p>
                  I enjoy designing robust data architectures, championing engineering best practices, and mentoring the next generation of data leaders.
                </p>
                <p>
                  My work focuses on high-leverage foundations: reliable ingestion, strong data contracts, observability, and MLOps that close the loop between models and business outcomes. I value clarity, pragmatism, and delivering impact.
                </p>
              </article>
            </div>
            <div className="space-y-6 fade-in-up stagger-1">
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary">
                <h3 className="font-semibold text-lg mb-2 gradient-text">Leadership Philosophy</h3>
                <p className="text-muted-foreground">Build high-performing teams through mentorship, clear communication, and focus on impactful solutions.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary-glow">
                <h3 className="font-semibold text-lg mb-2 gradient-text">Technical Approach</h3>
                <p className="text-muted-foreground">Design for scale, reliability, and maintainability. Always prioritize data quality and observability.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary">
                <h3 className="font-semibold text-lg mb-2 gradient-text">Business Impact</h3>
                <p className="text-muted-foreground">Connect technical excellence to business outcomes through data-driven decision making.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Projects" subtitle="Selected work across data platforms, ML, and cloud architecture.">
          <div className="grid gap-6 md:grid-cols-2">
            {profile.projects.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills" subtitle="Technologies and tools I use regularly.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { category: "Languages & Frameworks", skills: profile.skills.slice(0, 5) },
              { category: "Cloud & Infrastructure", skills: profile.skills.slice(5, 10) },
              { category: "Data & ML Tools", skills: profile.skills.slice(10) }
            ].map((group, groupIndex) => (
              <div key={group.category} className={`fade-in-up stagger-${groupIndex + 1} glass-card p-6 rounded-2xl`}>
                <h3 className="font-semibold text-lg mb-4 gradient-text">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, index) => (
                    <span 
                      key={skill} 
                      className={`rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-default fade-in-up`}
                      style={{ animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="speaking" title="Speaking & Publications" subtitle="Talks, articles, and contributions.">
          <div className="grid gap-6 md:grid-cols-2">
            {profile.publications.map((p) => (
              <PublicationCard key={p.title} {...p} />
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact" subtitle="Let's discuss how I can help your team.">
          <ContactForm />
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
