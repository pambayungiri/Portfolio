import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppManager } from '@/lib/whatsapp-client'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { recipient, message } = await request.json()

    if (!recipient || !message) {
      return NextResponse.json({ 
        success: false, 
        message: 'Recipient and message are required' 
      })
    }

    const client = WhatsAppManager.getClient()
    if (!client) {
      return NextResponse.json({ 
        success: false, 
        message: 'WhatsApp client not connected. Please connect first.' 
      })
    }

    // Format phone number (remove any non-digits and add country code if needed)
    const formattedNumber = recipient.replace(/\D/g, '')
    const chatId = `${formattedNumber}@c.us`

    // Send the message
    await client.sendMessage(chatId, message)

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Error sending message. Make sure the number is correct and has WhatsApp.' 
    })
  }
}

// Status check endpoint
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const state = await WhatsAppManager.getConnectionState()
    const isConnected = state === 'CONNECTED'
    
    return NextResponse.json({ 
      success: true, 
      connected: isConnected,
      message: isConnected ? 'WhatsApp is connected' : 'WhatsApp is not connected'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      connected: false,
      message: 'Error checking connection status' 
    })
  }
}
