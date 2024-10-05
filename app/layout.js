import "./globals.css";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-bellotaText">
        <Navbar />
        {children}
      </body>
    </html>
  )
}