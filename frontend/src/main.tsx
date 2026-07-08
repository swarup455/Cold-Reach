import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/themeProvider.tsx'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/app/store.ts'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Toaster />
        <App />
      </BrowserRouter>
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
