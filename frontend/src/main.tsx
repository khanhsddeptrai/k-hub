// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import theme from './theme.ts'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux';
import store, { persistor } from './store/index.ts';
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  // </StrictMode>,
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
