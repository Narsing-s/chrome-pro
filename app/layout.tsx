import './globals.css';
import type {Metadata} from 'next';
export const metadata: Metadata={title:'Chrome Pro',description:'Fast, private and intelligent browser workspace'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}