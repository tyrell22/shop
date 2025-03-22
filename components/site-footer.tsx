import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-black text-white">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <img src="/images/crisptvlogo.png" alt="Crisp TV Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-yellow-400">Crisp TV</span>
          </div>
          <p className="text-sm text-gray-300">Premium IPTV service with thousands of channels worldwide.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-12">
          <div className="space-y-2">
            <h4 className="text-base font-medium text-yellow-400">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-yellow-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-yellow-400">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-yellow-400">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-medium text-yellow-400">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-yellow-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-yellow-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-300 hover:text-yellow-400">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t bg-black">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-gray-400">© 2024 Crisp TV. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

