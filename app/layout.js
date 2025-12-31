import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderClient from "@/components/headerClient";
import {ClerkProvider} from "@clerk/nextjs"
import { dark } from "@clerk/themes";
import HeaderServer from "@/components/headerServer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediMeet - Doctors Appointment App",
  description: "Connect with doctors anytime anywhere",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider appearance ={{
      baseTheme : dark,
     }}>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <HeaderServer />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>

          {/* footer */}
          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center">
              <p>Making healthcare access smoother for everyone.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
