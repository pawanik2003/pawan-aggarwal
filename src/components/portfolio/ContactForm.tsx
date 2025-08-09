import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { profile } from "@/content/profile";

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const message = String(formData.get("message") || "");

    setLoading(true);
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    const mailto = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    window.location.href = mailto;
    setTimeout(() => setLoading(false), 500);
    toast({
      title: "Thanks!",
      description: "Your email client should open. If not, write to me directly.",
    });
    form.reset();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-1">
        <label className="mb-2 block text-sm font-medium">Your Name</label>
        <Input name="name" required placeholder="Jane Doe" />
      </div>
      <div className="md:col-span-1">
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input name="email" type="email" required placeholder="jane@company.com" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Message</label>
        <Textarea name="message" required rows={6} placeholder="How can I help?" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" variant="hero" size="lg" disabled={loading}>
          {loading ? "Sending…" : "Send Message"}
        </Button>
      </div>
      <div className="md:col-span-2 text-sm text-muted-foreground">
        Or reach me via: <a className="story-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · <a className="story-link" href={profile.github} target="_blank" rel="noreferrer">GitHub</a> · <a className="story-link" href={`mailto:${profile.email}`}>Email</a>
      </div>
    </form>
  );
};

export default ContactForm;
