import { useState } from 'react'
    import { FiSettings, FiMessageSquare } from 'react-icons/fi'

    export default function App() {
      const [messages, setMessages] = useState([])
      const [settingsOpen, setSettingsOpen] = useState(false)
      const [persona, setPersona] = useState('friendly')
      const [temperature, setTemperature] = useState(0.7)
      const [input, setInput] = useState('')

      const handleSend = async () => {
        if (!input.trim()) return
        
        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [...messages, userMessage],
              persona,
              temperature
            })
          })
          
          const data = await response.json()
          setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
        } catch (error) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Sorry, something went wrong. Please try again.' 
          }])
        }
      }

      return (
        <div className="flex h-screen bg-gray-50">
          {/* Settings Panel */}
          <div className={`fixed inset-0 bg-black bg-opacity-50 ${settingsOpen ? '' : 'hidden'}`}>
            <div className="absolute right-0 h-full w-96 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Persona</label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="friendly">Friendly Assistant</option>
                    <option value="professional">Professional Consultant</option>
                    <option value="creative">Creative Writer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperature: {temperature.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Prompt Assistance</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setInput('Can you help me brainstorm ideas for...')}
                      className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Brainstorming
                    </button>
                    <button
                      onClick={() => setInput('What are the key points about...')}
                      className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Key Points
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="flex-1 flex flex-col max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-xl font-bold">AI Chat</h1>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FiSettings className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-2 border rounded"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FiMessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
