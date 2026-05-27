import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#00FF66',
          colorBackground: '#050505',
          colorInputBackground: '#0a0a0a',
          colorInputText: '#ffffff',
        },
        elements: {
          card: 'bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl',
          headerTitle: 'text-white',
          headerSubtitle: 'text-gray-400',
          socialButtonsBlockButton: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white',
          socialButtonsBlockButtonText: 'text-white font-semibold',
          dividerLine: 'bg-white/10',
          dividerText: 'text-gray-500',
          formFieldLabel: 'text-gray-300',
          formFieldInput: 'bg-black/40 border border-white/10 text-white focus:border-[#00FF66]/50 transition-colors',
          footerActionText: 'text-gray-400',
          footerActionLink: 'text-[#00FF66] hover:text-[#00FF66]/80',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-[#00FF66] hover:text-[#00FF66]/80',
          formButtonPrimary: 'neon-btn',
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)