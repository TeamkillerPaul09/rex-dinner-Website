import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Clock, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-primary">Rex Dinner</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline gap-8">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Speisekarte
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Bewertungen
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Über uns
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Kontakt
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance">
              Willkommen bei Rex Dinner
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Erleben Sie authentische deutsche Küche in gemütlicher Atmosphäre. Frische Zutaten, traditionelle Rezepte
              und herzlicher Service erwarten Sie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                Jetzt Tisch reservieren
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg bg-transparent"
              >
                Jetzt bestellen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fresh Cuisine */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Frische Küche</h3>
                <p className="text-muted-foreground text-pretty">
                  Täglich frisch zubereitete Gerichte mit den besten regionalen Zutaten und traditionellen deutschen
                  Rezepten.
                </p>
              </CardContent>
            </Card>

            {/* Fast Service */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Schneller Service</h3>
                <p className="text-muted-foreground text-pretty">
                  Professioneller und aufmerksamer Service, damit Sie Ihr Essen in entspannter Atmosphäre genießen
                  können.
                </p>
              </CardContent>
            </Card>

            {/* Easy Reservations */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Einfache Reservierung</h3>
                <p className="text-muted-foreground text-pretty">
                  Reservieren Sie Ihren Tisch bequem online oder telefonisch. Wir sorgen für den perfekten Platz für
                  Sie.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-muted py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Bereit für ein unvergessliches Dinner?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Lassen Sie sich von unserer authentischen deutschen Küche verwöhnen. Reservieren Sie noch heute Ihren Tisch
            oder bestellen Sie bequem nach Hause.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              Tisch reservieren
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 bg-transparent"
            >
              Online bestellen
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Rex Dinner</h3>
              <p className="text-muted-foreground mb-4 text-pretty">
                Ihr authentisches deutsches Restaurant mit Tradition und Qualität. Seit Jahren verwöhnen wir unsere
                Gäste mit köstlichen Gerichten und herzlichem Service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>Musterstraße 123</p>
                <p>12345 Berlin</p>
                <p>Tel: +49 30 12345678</p>
                <p>info@rex-dinner.de</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Öffnungszeiten</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>Mo-Do: 17:00 - 23:00</p>
                <p>Fr-Sa: 17:00 - 24:00</p>
                <p>So: 12:00 - 22:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Rex Dinner. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}