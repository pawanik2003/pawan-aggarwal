import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

type Props = {
  title: string
  description: string
  link: string
  platform: string
  date?: string
}

const PublicationCard = ({ title, description, link, platform, date }: Props) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <Card className="h-full transition-all hover-scale group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg group-hover:text-primary">{title}</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </div>
          <CardDescription className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground">{platform}</span>
            {date && <span className="text-xs text-muted-foreground">{date}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
};

export default PublicationCard;
