type SectionProps = {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
}

const Section = ({ id, title, subtitle, children }: SectionProps) => {
  return (
    <section id={id} className="scroll-mt-28 py-16 md:py-24">
      <div className="container mx-auto">
        <header className="mb-8 md:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}

export default Section
