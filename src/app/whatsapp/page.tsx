'use client'

import { useState } from 'react'

export default function WhatsAppAutoChat() {
  const [isConnected, setIsConnected] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('')
  const [status, setStatus] = useState('')

  const connectWhatsApp = async () => {
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.qrCode) {
        setQrCode(data.qrCode)
        setStatus('Please scan the QR code with your phone')
      }
    } catch (error) {
      setStatus('Error connecting to WhatsApp')
    }
  }

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          message,
        }),
      })
      
      const data = await response.json()
      setStatus(data.success ? 'Message sent successfully!' : 'Failed to send message')
    } catch (error) {
      setStatus('Error sending message')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          WhatsApp Auto Chat
        </h1>

        {/* Connection Status */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg text-center ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Connect Button */}
        {!isConnected && (
          <div className="mb-6 text-center">
            <button
              onClick={connectWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Connect to WhatsApp
            </button>
          </div>
        )}

        {/* QR Code */}
        {qrCode && (
          <div className="mb-6 text-center">
            <div className="bg-white p-4 border rounded-lg inline-block">
              <pre className="text-xs">{qrCode}</pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Scan this QR code with your WhatsApp mobile app
            </p>
          </div>
        )}

        {/* Message Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient (Phone number with country code)
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., 1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!recipient || !message}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Send Message
          </button>
        </div>

        {/* Status Messages */}
        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}