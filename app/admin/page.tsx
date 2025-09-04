"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  Users,
  Calendar,
  ShoppingBag,
  Download,
  Upload,
  Key,
  Star,
} from "lucide-react"
import { getMenuItems, saveMenuItems, exportMenuToFile, importMenuFromFile, type MenuItem } from "@/lib/menu-data"

type User = {
  id: number
  username: string
  password: string
  role: string
  group: string
  mustChangePassword: boolean
  isTemporaryPassword: boolean
  discordUserId?: string
}

type Reservation = {
  id: number
  name: string
  date: string
  time: string
  guests: number
  phone: string
  email: string
  timestamp: number
  status: string
  notes?: string
}

type Order = {
  id: number
  customerInfo: {
    name: string
    phone: string
    address: string
  }
  items: {
    name: string
    price: string
    quantity: number
  }[]
  total: number
  timestamp: number
  status: string
}

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

const getUsers = (): User[] => {
  if (typeof window !== "undefined") {
    const users = localStorage.getItem("users")
    return users
      ? JSON.parse(users)
      : [
          {
            id: 1,
            username: "admin",
            password: "Rex_dinner03.09",
            role: "admin",
            group: "owner",
            mustChangePassword: false,
            isTemporaryPassword: false,
          },
        ]
  }
  return [
    {
      id: 1,
      username: "admin",
      password: "Rex_dinner03.09",
      role: "admin",
      group: "owner",
      mustChangePassword: false,
      isTemporaryPassword: false,
    },
  ]
}

const saveUsers = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(users))
  }
}

const generateTemporaryPassword = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userGroup, setUserGroup] = useState<string>("")
  const [activeTab, setActiveTab] = useState("menu")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [websiteConfig, setWebsiteConfig] = useState({
    discordChannels: {
      reservations: "1381651223140241438",
      orders: "1412869710474772631",
      reviews: "1412869710474772631",
    },
    websiteSettings: {
      title: "Rex Dinner",
      description: "Authentisches 50er Jahre Diner-Erlebnis mit T-Rex Thema",
      contactDiscord: "https://discord.gg/HcFFb6tX4S",
    },
  })
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: "",
    category: "",
    rating: 5.0,
  })
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    username: "",
    password: "",
    role: "admin",
    group: "mitarbeiter",
    mustChangePassword: true,
    isTemporaryPassword: false,
    discordUserId: "",
  })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)
  const [temporaryPassword, setTemporaryPassword] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const getCategories = () => {
    const categories = [...new Set(menuItems.map((item) => item.category).filter(Boolean))]
    return categories.sort()
  }

  const getItemsByCategory = () => {
    const categories = getCategories()
    const grouped: { [key: string]: MenuItem[] } = {}

    categories.forEach((category) => {
      grouped[category] = menuItems.filter((item) => item.category === category)
    })

    return grouped
  }

  const loadReservationsAndOrders = () => {
    if (typeof window !== "undefined") {
      const savedReservations = JSON.parse(localStorage.getItem("reservations") || "[]")
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const savedReviews = JSON.parse(localStorage.getItem("rex_dinner_reviews") || "[]")
      setReservations(savedReservations)
      setOrders(savedOrders)
      setReviews(savedReviews)
    }
  }

  const updateReservationStatus = (id: number, status: string) => {
    const updatedReservations = reservations.map((res) => (res.id === id ? { ...res, status } : res))
    setReservations(updatedReservations)
    localStorage.setItem("reservations", JSON.stringify(updatedReservations))
  }

  const updateOrderStatus = (id: number, status: string) => {
    const updatedOrders = orders.map((order) => (order.id === id ? { ...order, status } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userGroup")
    router.push("/")
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item })
    setIsAddingNew(false)
  }

  const handleSave = () => {
    if (editingItem) {
      const updatedItems = menuItems.map((item) => (item.id === editingItem.id ? editingItem : item))
      setMenuItems(updatedItems)
      saveMenuItems(updatedItems)
      setEditingItem(null)
    }
  }

  const handleDelete = (id: number) => {
    const updatedItems = menuItems.filter((item) => item.id !== id)
    setMenuItems(updatedItems)
    saveMenuItems(updatedItems)
  }

  const handleAddNew = () => {
    const id = Math.max(...menuItems.map((item) => item.id)) + 1
    const updatedItems = [...menuItems, { ...newItem, id }]
    setMenuItems(updatedItems)
    saveMenuItems(updatedItems)
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      rating: 5.0,
    })
    setIsAddingNew(false)
  }

  const sendDiscordNotification = async (type: string, data: any) => {
    try {
      await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, data }),
      })
    } catch (error) {
      console.error("Failed to send Discord notification:", error)
    }
  }

  const handleAddUser = async () => {
    const id = Math.max(...users.map((user) => user.id)) + 1
    const updatedUsers = [...users, { ...newUser, id }]
    setUsers(updatedUsers)
    saveUsers(updatedUsers)

    if (newUser.discordUserId) {
      await sendDiscordNotification("send_login_dm", {
        discordUserId: newUser.discordUserId,
        username: newUser.username,
        password: newUser.password,
      })
    }

    setNewUser({
      username: "",
      password: "",
      role: "admin",
      group: "mitarbeiter",
      mustChangePassword: true,
      isTemporaryPassword: false,
      discordUserId: "",
    })
    setIsAddingUser(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
  }

  const handleSaveUser = () => {
    if (editingUser) {
      const updatedUsers = users.map((user) => (user.id === editingUser.id ? editingUser : user))
      setUsers(updatedUsers)
      saveUsers(updatedUsers)
      setEditingUser(null)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (users.length > 1) {
      const userToDelete = users.find((user) => user.id === id)
      const currentUser = users.find((user) => user.username === "admin") // Oder aktuell eingeloggter User

      if (userToDelete) {
        await sendDiscordNotification("user_access_revoked", {
          revokedUser: userToDelete,
          adminName: currentUser?.username || "Admin",
        })
      }

      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)
      saveUsers(updatedUsers)
    }
  }

  const handleExportMenu = () => {
    exportMenuToFile(menuItems)
  }

  const handleImportMenu = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const importedItems = await importMenuFromFile(file)
        setMenuItems(importedItems)
        saveMenuItems(importedItems)
        alert("Speisekarte erfolgreich importiert!")
      } catch (error) {
        alert("Fehler beim Importieren der Speisekarte: " + (error as Error).message)
      }
    }
  }

  const handleResetPassword = (user: User) => {
    const tempPassword = generateTemporaryPassword()
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, password: tempPassword, mustChangePassword: true, isTemporaryPassword: true } : u,
    )
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setResetPasswordUser(user)
    setTemporaryPassword(tempPassword)
  }

  const handleDeleteReview = (id: string) => {
    const updatedReviews = reviews.filter((review) => review.id !== id)
    setReviews(updatedReviews)
    localStorage.setItem("rex_dinner_reviews", JSON.stringify(updatedReviews))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${rating >= index + 1 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const hasPermission = (section: string): boolean => {
    if (userGroup === "owner" || userGroup === "perso") return true
    if (userGroup === "mitarbeiter") {
      return section === "reservations" || section === "orders"
    }
    return false
  }

  const saveWebsiteConfig = () => {
    localStorage.setItem("websiteConfig", JSON.stringify(websiteConfig))
    updateDiscordChannels(websiteConfig.discordChannels)
    alert("Konfiguration erfolgreich gespeichert!")
  }

  const updateDiscordChannels = async (channels: any) => {
    try {
      await fetch("/api/discord", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update_channels",
          channels: channels,
        }),
      })
    } catch (error) {
      console.error("Failed to update Discord channels:", error)
    }
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    const userRole = localStorage.getItem("userRole")
    const group = localStorage.getItem("userGroup") || "mitarbeiter"

    if (loggedIn === "true" && userRole === "admin") {
      setIsAuthenticated(true)
      setUserGroup(group)
      setMenuItems(getMenuItems())
      setUsers(getUsers())
      loadReservationsAndOrders()
    } else {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    const savedConfig = localStorage.getItem("websiteConfig")
    if (savedConfig) {
      setWebsiteConfig(JSON.parse(savedConfig))
    }
  }, [])

  if (!isAuthenticated) {
    return <div>Laden...</div>
  }

  const itemsByCategory = getItemsByCategory()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Gruppe: {userGroup}</Badge>
            <Button onClick={handleLogout} variant="outline">
              Abmelden
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Settings className="h-10 w-10 text-orange-600" />
            Mitarbeiter Panel
          </h1>
          <p className="text-xl text-gray-600">
            Verwalten Sie Ihre Speisekarte, Benutzer, Reservierungen und Bestellungen
          </p>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "menu" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Speisekarte
          </button>
          {hasPermission("users") && (
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "users" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Benutzer
            </button>
          )}
          {hasPermission("reservations") && (
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "reservations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Reservierungen
            </button>
          )}
          {hasPermission("orders") && (
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "orders" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Bestellungen
            </button>
          )}
          {hasPermission("orders") && (
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "reviews" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Bewertungen
            </button>
          )}
          {hasPermission("users") && (
            <button
              onClick={() => setActiveTab("config")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "config" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Konfiguration
            </button>
          )}
        </div>

        {activeTab === "config" && hasPermission("users") && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Website-Konfiguration</h2>

              {/* Discord Channel Konfiguration */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Discord Channel IDs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reservations-channel">Reservierungen Channel</Label>
                    <Input
                      id="reservations-channel"
                      value={websiteConfig.discordChannels.reservations}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          discordChannels: {
                            ...websiteConfig.discordChannels,
                            reservations: e.target.value,
                          },
                        })
                      }
                      placeholder="Discord Channel ID für Reservierungen"
                    />
                  </div>
                  <div>
                    <Label htmlFor="orders-channel">Bestellungen Channel</Label>
                    <Input
                      id="orders-channel"
                      value={websiteConfig.discordChannels.orders}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          discordChannels: {
                            ...websiteConfig.discordChannels,
                            orders: e.target.value,
                          },
                        })
                      }
                      placeholder="Discord Channel ID für Bestellungen"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviews-channel">Bewertungen Channel</Label>
                    <Input
                      id="reviews-channel"
                      value={websiteConfig.discordChannels.reviews}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          discordChannels: {
                            ...websiteConfig.discordChannels,
                            reviews: e.target.value,
                          },
                        })
                      }
                      placeholder="Discord Channel ID für Bewertungen"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Website Einstellungen */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Website-Einstellungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="website-title">Website-Titel</Label>
                    <Input
                      id="website-title"
                      value={websiteConfig.websiteSettings.title}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          websiteSettings: {
                            ...websiteConfig.websiteSettings,
                            title: e.target.value,
                          },
                        })
                      }
                      placeholder="Website-Titel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website-description">Website-Beschreibung</Label>
                    <Input
                      id="website-description"
                      value={websiteConfig.websiteSettings.description}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          websiteSettings: {
                            ...websiteConfig.websiteSettings,
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Website-Beschreibung"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-discord">Kontakt Discord-Link</Label>
                    <Input
                      id="contact-discord"
                      value={websiteConfig.websiteSettings.contactDiscord}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          websiteSettings: {
                            ...websiteConfig.websiteSettings,
                            contactDiscord: e.target.value,
                          },
                        })
                      }
                      placeholder="Discord Einladungslink"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end mb-6">
                <Button onClick={saveWebsiteConfig} className="bg-orange-600 hover:bg-orange-700">
                  Konfiguration Speichern
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="mb-6 flex gap-4 flex-wrap">
              <Button onClick={() => setIsAddingNew(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Neues Gericht hinzufügen
              </Button>
              <Button
                onClick={handleExportMenu}
                variant="outline"
                className="text-green-600 hover:text-green-700 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Speisekarte exportieren
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="text-blue-600 hover:text-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Speisekarte importieren
              </Button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportMenu} className="hidden" />
            </div>

            {isAddingNew && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Neues Gericht hinzufügen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-name">Name</Label>
                      <Input
                        id="new-name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-category">Kategorie</Label>
                      <Input
                        id="new-category"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="z.B. Vorspeisen, Hauptgerichte, Desserts"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-description">Beschreibung</Label>
                    <Textarea
                      id="new-description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-price">Preis (€)</Label>
                      <Input
                        id="new-price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-rating">Bewertung</Label>
                      <Input
                        id="new-rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={newItem.rating}
                        onChange={(e) => setNewItem({ ...newItem, rating: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Hinzufügen
                    </Button>
                    <Button onClick={() => setIsAddingNew(false)} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Abbrechen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-8">
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">{category}</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-6">
                          {editingItem?.id === item.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-category">Kategorie</Label>
                                  <Input
                                    id="edit-category"
                                    value={editingItem.category}
                                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Beschreibung</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingItem.description}
                                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-price">Preis (€)</Label>
                                  <Input
                                    id="edit-price"
                                    value={editingItem.price}
                                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-rating">Bewertung</Label>
                                  <Input
                                    id="edit-rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={editingItem.rating}
                                    onChange={(e) =>
                                      setEditingItem({ ...editingItem, rating: Number.parseFloat(e.target.value) })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                  <Save className="h-4 w-4 mr-2" />
                                  Speichern
                                </Button>
                                <Button onClick={() => setEditingItem(null)} variant="outline">
                                  <X className="h-4 w-4 mr-2" />
                                  Abbrechen
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                                  <Badge variant="secondary">{item.category}</Badge>
                                </div>
                                <p className="text-gray-600 mb-2">{item.description}</p>
                                <p className="text-sm text-gray-500">Bewertung: {item.rating}/5</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-2xl font-bold text-orange-600 mb-3">€{item.price}</p>
                                <div className="flex gap-2">
                                  <Button onClick={() => handleEdit(item)} size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(item.id)}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reservations" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Reservierungen verwalten</h2>
              {reservations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Reservierungen vorhanden</p>
                  </CardContent>
                </Card>
              ) : (
                reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{reservation.name}</h3>
                            <Badge variant={reservation.status === "Bestätigt" ? "default" : "secondary"}>
                              {reservation.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <p>
                              <strong>Datum:</strong> {reservation.date}
                            </p>
                            <p>
                              <strong>Uhrzeit:</strong> {reservation.time}
                            </p>
                            <p>
                              <strong>Personen:</strong> {reservation.guests}
                            </p>
                            <p>
                              <strong>Telefon:</strong> {reservation.phone}
                            </p>
                            <p>
                              <strong>E-Mail:</strong> {reservation.email}
                            </p>
                            <p>
                              <strong>Eingegangen:</strong> {new Date(reservation.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {reservation.notes && (
                            <p className="mt-2 text-sm">
                              <strong>Notizen:</strong> {reservation.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => updateReservationStatus(reservation.id, "Bestätigt")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Bestätigen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReservationStatus(reservation.id, "Abgelehnt")}
                            className="text-red-600 hover:text-red-700"
                          >
                            Ablehnen
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Bestellungen verwalten</h2>
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Bestellungen vorhanden</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{order.customerInfo.name}</h3>
                            <Badge variant={order.status === "Zubereitet" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <p>
                              <strong>Telefon:</strong> {order.customerInfo.phone}
                            </p>
                            <p>
                              <strong>Adresse:</strong> {order.customerInfo.address}
                            </p>
                            <p>
                              <strong>Gesamt:</strong> €{order.total}
                            </p>
                            <p>
                              <strong>Eingegangen:</strong> {new Date(order.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Bestellte Artikel:</h4>
                            <div className="space-y-1">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span>€{(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "In Zubereitung")}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            In Zubereitung
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "Zubereitet")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Zubereitet
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "Ausgeliefert")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Ausgeliefert
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Bewertungen verwalten</h2>
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Keine Bewertungen vorhanden</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{review.name}</h3>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-500">Eingegangen am: {review.date}</p>
                          </div>
                          <div className="ml-4">
                            <Button
                              onClick={() => handleDeleteReview(review.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="mb-6">
              <Button onClick={() => setIsAddingUser(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Neuen Benutzer hinzufügen
              </Button>
            </div>

            {isAddingUser && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Neuen Benutzer hinzufügen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-username">Benutzername</Label>
                      <Input
                        id="new-username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">Passwort</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-discord-id">Discord User ID (optional)</Label>
                    <Input
                      id="new-discord-id"
                      value={newUser.discordUserId || ""}
                      onChange={(e) => setNewUser({ ...newUser, discordUserId: e.target.value })}
                      placeholder="z.B. 123456789012345678"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Wenn angegeben, erhält der Benutzer eine DM mit den Login-Daten
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="new-group">Benutzergruppe</Label>
                    <Select value={newUser.group} onValueChange={(value) => setNewUser({ ...newUser, group: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gruppe auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner (Vollzugriff)</SelectItem>
                        <SelectItem value="perso">Personal (Vollzugriff)</SelectItem>
                        <SelectItem value="mitarbeiter">Mitarbeiter (Reservierungen & Bestellungen)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Hinzufügen
                    </Button>
                    <Button onClick={() => setIsAddingUser(false)} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Abbrechen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {resetPasswordUser && (
              <Card className="mb-6 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">Passwort zurückgesetzt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Das temporäre Passwort für <strong>{resetPasswordUser.username}</strong> lautet:
                  </p>
                  <div className="bg-white p-4 rounded border font-mono text-lg text-center">{temporaryPassword}</div>
                  <p className="text-sm text-orange-700 mt-4">
                    Bitte teilen Sie dieses Passwort dem Benutzer mit. Der Benutzer muss das Passwort beim nächsten
                    Login ändern.
                  </p>
                  <Button
                    onClick={() => {
                      setResetPasswordUser(null)
                      setTemporaryPassword("")
                    }}
                    className="mt-4"
                  >
                    Verstanden
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    {editingUser?.id === user.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-username">Benutzername</Label>
                            <Input
                              id="edit-username"
                              value={editingUser.username}
                              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-password">Passwort</Label>
                            <Input
                              id="edit-password"
                              type="password"
                              value={editingUser.password}
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="edit-group">Benutzergruppe</Label>
                          <Select
                            value={editingUser.group}
                            onValueChange={(value) => setEditingUser({ ...editingUser, group: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner (Vollzugriff)</SelectItem>
                              <SelectItem value="perso">Personal (Vollzugriff)</SelectItem>
                              <SelectItem value="mitarbeiter">Mitarbeiter (Reservierungen & Bestellungen)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveUser} className="bg-green-600 hover:bg-green-700">
                            <Save className="h-4 w-4 mr-2" />
                            Speichern
                          </Button>
                          <Button onClick={() => setEditingUser(null)} variant="outline">
                            <X className="h-4 w-4 mr-2" />
                            Abbrechen
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Users className="h-8 w-8 text-orange-600" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{user.role}</Badge>
                              <Badge variant={user.group === "perso" || user.group === "owner" ? "default" : "outline"}>
                                {user.group === "owner" ? "Owner" : user.group === "perso" ? "Personal" : "Mitarbeiter"}
                              </Badge>
                              {user.mustChangePassword && (
                                <Badge variant="destructive">Passwort ändern erforderlich</Badge>
                              )}
                              {user.isTemporaryPassword && <Badge variant="secondary">Temporäres Passwort</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleResetPassword(user)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleEditUser(user)} size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {users.length > 1 && (
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
