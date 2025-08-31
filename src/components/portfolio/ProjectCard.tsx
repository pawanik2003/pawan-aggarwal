import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string
  description: string
  technologies: string[]
  link?: string
}

const ProjectCard = ({ title, description, technologies, link }: Props) => {
  const Wrapper = link ? (props: any) => <a {...props} href={link} target="_blank" rel="noreferrer" /> : (props: any) => <div {...props} />

  return (
    <Wrapper>
      <Card className="group h-full transition-all duration-300 hover-scale border-2 hover:border-primary/20 bg-gradient-to-br from-card to-muted/30 hover:shadow-floating overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10 pb-4">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap gap-2">
            {technologies.map((t, index) => (
              <span 
                key={t} 
                className={`rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 fade-in-up stagger-${(index % 4) + 1}`}
              >
                {t}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default ProjectCard;
