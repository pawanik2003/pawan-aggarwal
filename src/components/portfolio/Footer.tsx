import { profile } from "@/content/profile";

const Footer = () => {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
