"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn, AlertCircle } from "lucide-react"

type User = {
  id: number
  username: string
  password: string
  role: string
  group: string
  mustChangePassword: boolean
  isTemporaryPassword: boolean
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
            group: "perso",
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
      group: "perso",
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

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      if (user.mustChangePassword || user.isTemporaryPassword) {
        setCurrentUser(user)
        setShowPasswordChange(true)
        setIsLoading(false)
        return
      }

      // Store login state in localStorage
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("currentUser", user.username)
      localStorage.setItem("userGroup", user.group)
      router.push("/admin")
    } else {
      setError("Ungültige Anmeldedaten")
    }

    setIsLoading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      return
    }

    if (newPassword.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein")
      return
    }

    if (currentUser) {
      const users = getUsers()
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id
          ? { ...user, password: newPassword, mustChangePassword: false, isTemporaryPassword: false }
          : user,
      )
      saveUsers(updatedUsers)

      // Login after password change
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", currentUser.role)
      localStorage.setItem("currentUser", currentUser.username)
      localStorage.setItem("userGroup", currentUser.group)
      router.push("/admin")
    }
  }

  if (showPasswordChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Startseite
          </Link>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Passwort ändern</CardTitle>
              <p className="text-gray-600">Sie müssen Ihr Passwort vor dem ersten Login ändern</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Neues Passwort eingeben"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Passwort wiederholen"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Passwort ändern
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <LogIn className="h-6 w-6 text-orange-600" />
              Admin Login
            </CardTitle>
            <p className="text-gray-600">Melden Sie sich an, um das Admin-Panel zu verwenden</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Benutzername eingeben"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passwort eingeben"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Anmelden..." : "Anmelden"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
