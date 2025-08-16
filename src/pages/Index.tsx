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
          <article className="max-w-3xl leading-relaxed text-muted-foreground">
            <p className="mb-4">
              With {profile.experienceYears}+ years in data engineering and AI, I've led teams to build scalable platforms and production ML systems across finance, retail, and SaaS. I enjoy designing robust data architectures, championing engineering best practices, and mentoring the next generation of data leaders.
            </p>
            <p>
              My work focuses on high-leverage foundations: reliable ingestion, strong data contracts, observability, and MLOps that close the loop between models and business outcomes. I value clarity, pragmatism, and delivering impact.
            </p>
          </article>
        </Section>

        <Section id="projects" title="Projects" subtitle="Selected work across data platforms, ML, and cloud architecture.">
          <div className="grid gap-6 md:grid-cols-2">
            {profile.projects.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills" subtitle="Technologies and tools I use regularly.">
          <ul className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <li key={s} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{s}</li>
            ))}
          </ul>
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
