import { profile } from "@/content/profile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Speaking", href: "#speaking" },
  { label: "Contact", href: "#contact" },
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
            <a key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground story-link">
              {item.label}
            </a>
          ))}
          <a href="#contact"><Button variant="hero" size="lg">Get in Touch</Button></a>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
