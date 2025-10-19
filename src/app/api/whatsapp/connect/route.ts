import { NextRequest, NextResponse } from 'next/server'
import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { WhatsAppManager } from '@/lib/whatsapp-client'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (WhatsAppManager.isConnected()) {
      return NextResponse.json({ success: false, message: 'Already connected' })
    }

    const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    })

    WhatsAppManager.setClient(client)

    return new Promise<NextResponse>((resolve) => {
      client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr)
        
        // Generate QR code as text for display
        let qrText = ''
        qrcode.generate(qr, { small: true }, (qrcode) => {
          qrText = qrcode
        })
        
        resolve(NextResponse.json({ 
          success: true, 
          qrCode: qrText,
          message: 'Please scan the QR code with your phone' 
        }))
      })

      client.on('ready', () => {
        console.log('Client is ready!')
        resolve(NextResponse.json({ 
          success: true, 
          connected: true,
          message: 'WhatsApp connected successfully!' 
        }))
      })

      client.on('auth_failure', (msg) => {
        console.error('Authentication failed', msg)
        resolve(NextResponse.json({ 
          success: false, 
          message: 'Authentication failed' 
        }))
      })

      client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason)
        WhatsAppManager.clearClient()
      })

      client.initialize()
    })
  } catch (error) {
    console.error('Error connecting to WhatsApp:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Error connecting to WhatsApp' 
    })
  }
}

