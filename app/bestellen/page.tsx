"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ShoppingBag, Plus, Star, Minus } from "lucide-react"
import { getMenuItems, type MenuItem } from "@/lib/menu-data"

type CartItem = {
  id: number
  name: string
  price: string
  quantity: number
}

export default function BestellenPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    setMenuItems(getMenuItems())
  }, [])

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === id)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
      } else {
        return prevCart.filter((cartItem) => cartItem.id !== id)
      }
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + Number.parseFloat(item.price) * item.quantity, 0).toFixed(2)
  }

  const sendDiscordNotification = async (orderData: any) => {
    try {
      await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "new_order",
          data: orderData,
        }),
      })
    } catch (error) {
      console.error("Failed to send Discord notification:", error)
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return

    const order = {
      id: Date.now(),
      items: cart,
      customerInfo,
      total: Number.parseFloat(getTotalPrice()),
      timestamp: Date.now(),
      status: "Neu",
    }

    // Bestellungen in localStorage speichern
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("orders", JSON.stringify(existingOrders))

    await sendDiscordNotification(order)

    alert("Bestellung erfolgreich aufgegeben!")

    // Warenkorb und Formular zurücksetzen
    setCart([])
    setCustomerInfo({ name: "", phone: "", address: "" })
    setShowCheckout(false)
  }

  const getItemsByCategory = () => {
    const categories = [...new Set(menuItems.map((item) => item.category).filter(Boolean))]
    const grouped: { [key: string]: MenuItem[] } = {}

    categories.sort().forEach((category) => {
      grouped[category] = menuItems.filter((item) => item.category === category)
    })

    return grouped
  }

  const itemsByCategory = getItemsByCategory()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Online bestellen</h1>
          <p className="text-xl text-gray-600">Bestellen Sie Ihre Lieblingsspeisen direkt nach Hause</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Unsere Speisekarte</h2>

            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-orange-200 pb-2 mb-4">{category}</h3>
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-xl font-semibold text-gray-900">{item.name}</h4>
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-orange-600 mb-3">€{item.price}</p>
                          <Button
                            onClick={() => addToCart(item)}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Hinzufügen
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-orange-600" />
                  Ihre Bestellung
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ihr Warenkorb ist leer</p>
                    <p className="text-sm">Fügen Sie Gerichte hinzu, um zu bestellen</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">€{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                description: "",
                                category: "",
                                rating: 0,
                              })
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Gesamt:</span>
                    <span className="text-xl font-bold text-orange-600">€{getTotalPrice()}</span>
                  </div>

                  {showCheckout && cart.length > 0 && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <Label htmlFor="customer-name">Name</Label>
                        <Input
                          id="customer-name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-phone">Telefon</Label>
                        <Input
                          id="customer-phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-address">Lieferadresse</Label>
                        <Input
                          id="customer-address"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {cart.length > 0 && !showCheckout && (
                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Zur Kasse
                    </Button>
                  )}

                  {showCheckout && (
                    <div className="space-y-2">
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                      >
                        Bestellung aufgeben
                      </Button>
                      <Button onClick={() => setShowCheckout(false)} variant="outline" className="w-full">
                        Zurück
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
