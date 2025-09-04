import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ShoppingBag, Utensils, Clock } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/rex-dinner-logo.png"
                alt="Rex Dinner Logo"
                width={60}
                height={60}
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">Rex Dinner</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/bestellen" className="text-gray-700 hover:text-orange-600">
                Speisekarte
              </Link>
              <Link href="/bewertung" className="text-gray-700 hover:text-orange-600">
                Bewertungen
              </Link>
              <Link href="#" className="text-gray-700 hover:text-orange-600">
                Über uns
              </Link>
              <a
                href="https://discord.gg/HcFFb6tX4S"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-orange-600"
              >
                Kontakt
              </a>
              <Link href="/login" className="text-gray-700 hover:text-orange-600">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">Willkommen bei Rex Dinner</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Genießen Sie köstliche Gerichte in gemütlicher Atmosphäre. Frische Zutaten, traditionelle Rezepte und
            herzlicher Service erwarten Sie bei Rex Dinner.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link href="/reservierung">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
            >
              <Calendar className="h-6 w-6" />
              Jetzt Tisch reservieren
            </Button>
          </Link>

          <Link href="/bestellen">
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 bg-transparent"
            >
              <ShoppingBag className="h-6 w-6" />
              Jetzt bestellen
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Utensils className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Frische Küche</h3>
              <p className="text-gray-600">
                Täglich frisch zubereitete Gerichte mit den besten Zutaten aus der Region.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schneller Service</h3>
              <p className="text-gray-600">
                Professioneller und freundlicher Service für ein unvergessliches Erlebnis.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Einfache Reservierung</h3>
              <p className="text-gray-600">
                Reservieren Sie Ihren Tisch bequem online oder bestellen Sie direkt nach Hause.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
