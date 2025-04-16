import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-[#E6E6FA] backdrop-blur supports-[backdrop-filter]:bg-[#E6E6FA]">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-800">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-sm text-muted-foreground hover:text-foreground">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-800">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-800">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex flex-col items-center">
  <h3 className="text-lg font-semibold mb-4 text-purple-800">Connect</h3>
  <div className="flex space-x-4">
    <Button variant="ghost" size="icon">
      <Twitter className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon">
      <Discord className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon">
      <Github className="h-4 w-4" />
    </Button>
  </div>
      </div>
      </div>
        </div>
        <div className="mt-10 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ZenCue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
