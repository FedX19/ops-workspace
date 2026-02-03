import '../../app/globals.css'
import AppShell from '../../components/AppShell'
export const metadata = { title: 'Ops Workspace' }
export default function AppLayout({ children }){
  return (<html><body><AppShell>{children}</AppShell></body></html>)
}
