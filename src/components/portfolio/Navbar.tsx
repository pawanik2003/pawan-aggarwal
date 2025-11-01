import { profile } from "@/content/profile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, Github, Linkedin, Mail } from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Speaking", href: "#speaking" },
  { label: "Contact", href: "#contact" },
  { label: "Talk to Avatar", href: "/avatar" },
  { label: "AI Assistant", href: "/chat" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">{profile.name}</span>
          <span className="hidden text-muted-foreground md:inline">/ {profile.role}</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            item.href.startsWith('/') ? (
              <Link key={item.href} to={item.href} className="text-sm text-muted-foreground hover:text-foreground story-link">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground story-link">
                {item.label}
              </a>
            )
          ))}
          <div className="flex items-center gap-3 ml-4">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <a href="#contact"><Button variant="hero" size="lg">Get in Touch</Button></a>
        </div>
        <div className="md:hidden flex items-center gap-3">
          <Link to="/avatar" className="text-sm text-muted-foreground hover:text-foreground">
            Avatar
          </Link>
          <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground">
            AI
          </Link>
          <div className="flex items-center gap-2">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
