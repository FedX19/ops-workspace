import './globals.css'

export const metadata = {
  title: 'Ops Workspace',
  description: 'Tim & Jack operational dashboard',
  icons: {
    icon: '/favicon.svg'
  },
  themeColor: '#00d4ff'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#00d4ff" />
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
