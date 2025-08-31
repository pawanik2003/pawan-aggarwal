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
      <Card className="group h-full transition-all duration-300 hover-scale border-2 hover:border-primary/20 bg-gradient-to-br from-card to-muted/30 hover:shadow-floating overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight">
              {title}
            </CardTitle>
            <div className="flex-shrink-0 rounded-full bg-primary/10 p-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-medium text-primary">
              {platform}
            </span>
            {date && (
              <span className="text-sm text-muted-foreground font-medium">{date}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-4 text-sm font-medium text-primary group-hover:text-primary-glow transition-colors duration-300">
            Read article →
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default PublicationCard;
