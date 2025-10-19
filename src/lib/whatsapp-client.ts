import { Client, LocalAuth } from 'whatsapp-web.js'

let client: Client | null = null

export class WhatsAppManager {
  static getClient(): Client | null {
    return client
  }

  static setClient(newClient: Client): void {
    client = newClient
  }

  static clearClient(): void {
    if (client) {
      client.destroy()
      client = null
    }
  }

  static isConnected(): boolean {
    return client !== null
  }

  static async getConnectionState(): Promise<string | null> {
    if (!client) return null
    try {
      return await client.getState()
    } catch {
      return null
    }
  }
}