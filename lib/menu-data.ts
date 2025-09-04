export interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  category: string
  rating: number
}

export const getMenuItems = (): MenuItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("menuItems")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Fehler beim Laden der Speisekarte:", error)
        // Fallback zu Standard-Menü bei Parsing-Fehlern
      }
    }
  }

  // Default menu items
  return [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Klassische Pizza mit Tomaten, Mozzarella und frischem Basilikum",
      price: "12.90",
      category: "Vorspeisen",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Spaghetti Carbonara",
      description: "Cremige Pasta mit Speck, Ei und Parmesan",
      price: "14.50",
      category: "Hauptgerichte",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Lasagne della Casa",
      description: "Hausgemachte Lasagne mit Hackfleisch und Béchamelsauce",
      price: "16.90",
      category: "Hauptgerichte",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Tiramisu",
      description: "Klassisches italienisches Dessert mit Mascarpone und Kaffee",
      price: "6.90",
      category: "Desserts",
      rating: 4.9,
    },
  ]
}

export const saveMenuItems = (items: MenuItem[]): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("menuItems", JSON.stringify(items))
      localStorage.setItem(
        "menuItems_backup",
        JSON.stringify({
          items,
          timestamp: Date.now(),
          version: "1.0",
        }),
      )
    } catch (error) {
      console.error("Fehler beim Speichern der Speisekarte:", error)
    }
  }
}

export const exportMenuToFile = (items: MenuItem[]): void => {
  const dataStr = JSON.stringify(items, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `speisekarte_${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importMenuFromFile = (file: File): Promise<MenuItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string
        const items = JSON.parse(result) as MenuItem[]
        resolve(items)
      } catch (error) {
        reject(new Error("Ungültige JSON-Datei"))
      }
    }
    reader.onerror = () => reject(new Error("Fehler beim Lesen der Datei"))
    reader.readAsText(file)
  })
}
