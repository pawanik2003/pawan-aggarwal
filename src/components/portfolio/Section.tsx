type SectionProps = {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
}

const Section = ({ id, title, subtitle, children }: SectionProps) => {
  return (
    <section id={id} className="scroll-mt-28 py-20 md:py-32">
      <div className="container mx-auto">
        <header className="mb-12 md:mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">{subtitle}</p>
          )}
          <div className="mx-auto mt-6 h-1 w-20 bg-gradient-to-r from-primary to-primary-glow rounded-full"></div>
        </header>
        <div className="fade-in-up">
          {children}
        </div>
      </div>
    </section>
  )
}

export default Section
