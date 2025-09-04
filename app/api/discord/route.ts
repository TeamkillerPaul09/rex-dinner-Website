import { type NextRequest, NextResponse } from "next/server"

const DISCORD_TOKEN = "xxx"
const CLIENT_ID = "1397346773688647680"
const GUILD_ID = "1293655038501064917"

// Discord API Base URL
const DISCORD_API = "https://discord.com/api/v10"

// Send message to Discord channel
async function sendToDiscordChannel(channelId: string, content: string, embeds?: any[]) {
  try {
    const response = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        embeds: embeds || [],
      }),
    })

    if (!response.ok) {
      console.error("Discord API Error:", await response.text())
    }

    return response.ok
  } catch (error) {
    console.error("Discord send error:", error)
    return false
  }
}

// Send DM to user
async function sendDirectMessage(userId: string, content: string, embeds?: any[]) {
  try {
    // Create DM channel
    const dmResponse = await fetch(`${DISCORD_API}/users/@me/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_id: userId,
      }),
    })

    if (!dmResponse.ok) {
      console.error("Failed to create DM channel:", await dmResponse.text())
      return false
    }

    const dmChannel = await dmResponse.json()

    // Send message to DM channel
    const messageResponse = await fetch(`${DISCORD_API}/channels/${dmChannel.id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        embeds: embeds || [],
      }),
    })

    return messageResponse.ok
  } catch (error) {
    console.error("Discord DM error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "new_reservation":
        await sendToDiscordChannel(
          "1381651223140241438", // Reservierungen bleiben im ursprünglichen Channel
          "🍽️ **Neue Reservierung bei Rex Dinner!**",
          [
            {
              title: "Neue Tischreservierung",
              color: 0xff6b35,
              fields: [
                { name: "Name", value: data.name, inline: true },
                { name: "Datum", value: data.date, inline: true },
                { name: "Uhrzeit", value: data.time, inline: true },
                { name: "Personen", value: data.guests.toString(), inline: true },
                { name: "Telefon", value: data.phone, inline: true },
                { name: "E-Mail", value: data.email, inline: true },
                { name: "Notizen", value: data.notes || "Keine", inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        )
        break

      case "new_order":
        const orderItems = data.items.map((item: any) => `${item.quantity}x ${item.name} (€${item.price})`).join("\n")

        await sendToDiscordChannel(
          "1412869710474772631", // Bestellungen gehen in separaten Channel
          "🛒 **Neue Bestellung bei Rex Dinner!**",
          [
            {
              title: "Neue Online-Bestellung",
              color: 0x28a745,
              fields: [
                { name: "Kunde", value: data.customerInfo.name, inline: true },
                { name: "Telefon", value: data.customerInfo.phone, inline: true },
                { name: "Adresse", value: data.customerInfo.address, inline: false },
                { name: "Bestellte Artikel", value: orderItems, inline: false },
                { name: "Gesamtsumme", value: `€${data.total}`, inline: true },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        )
        break

      case "new_review":
        const stars = "⭐".repeat(data.rating)

        await sendToDiscordChannel(
          "1412869621844934806", // Bewertungen gehen in separaten Channel
          "⭐ **Neue Bewertung für Rex Dinner!**",
          [
            {
              title: "Neue Kundenbewertung",
              color: 0xffd700,
              fields: [
                { name: "Name", value: data.name, inline: true },
                { name: "Bewertung", value: `${stars} (${data.rating}/5)`, inline: true },
                { name: "Kommentar", value: data.comment, inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        )
        break

      case "send_login_dm":
        const { discordUserId, username, password } = data

        await sendDirectMessage(discordUserId, "🔑 **Rex Dinner - Zugriff gewährt**", [
          {
            title: "Du hast bei Rex Dinner Zugriff bekommen!",
            color: 0xff6b35,
            description: "Hier sind deine Login-Daten für das Admin-Panel:",
            fields: [
              { name: "Benutzername", value: username, inline: true },
              { name: "Passwort", value: password, inline: true },
              { name: "Login-URL", value: "https://rex-dinner-club-germanlife.vercel.app/login", inline: false },
            ],
            footer: {
              text: "Bitte ändere dein Passwort beim ersten Login!",
            },
            timestamp: new Date().toISOString(),
          },
        ])
        break

      case "user_access_revoked":
        const { revokedUser, adminName } = data

        if (revokedUser.discordUserId) {
          await sendDirectMessage(revokedUser.discordUserId, "🚫 **Rex Dinner - Zugriff entzogen**", [
            {
              title: "Dein Zugriff wurde entzogen",
              color: 0xff0000,
              description: "Dein Zugriff auf das Rex Dinner Admin-Panel wurde entfernt.",
              fields: [
                { name: "Betroffener Benutzer", value: revokedUser.username, inline: true },
                { name: "Entfernt von", value: adminName, inline: true },
              ],
              timestamp: new Date().toISOString(),
            },
          ])
        }

        // Auch Benachrichtigung an Admin-Channel senden
        await sendToDiscordChannel(
          "1381651223140241438", // Admin-Benachrichtigungen
          "🚫 **Benutzer-Zugriff entzogen**",
          [
            {
              title: "Benutzer-Zugriff wurde entfernt",
              color: 0xff0000,
              fields: [
                { name: "Entfernter Benutzer", value: revokedUser.username, inline: true },
                { name: "Gruppe", value: revokedUser.group, inline: true },
                { name: "Entfernt von", value: adminName, inline: true },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        )
        break

      default:
        return NextResponse.json({ error: "Unknown notification type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Discord notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
