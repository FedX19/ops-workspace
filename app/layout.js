import './globals.css'

export const metadata = {
  title: 'Ops Workspace',
  description: 'Tim & Jack operational dashboard',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.jpg',
  },
  themeColor: '#00d4ff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ops',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="theme-color" content="#00d4ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
      }}>
        {children}
      </body>
    </html>
  )
}
