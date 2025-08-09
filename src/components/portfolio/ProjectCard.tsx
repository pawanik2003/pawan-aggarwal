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
      <Card className="h-full transition-all hover-scale">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <li key={t} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                {t}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default ProjectCard;
