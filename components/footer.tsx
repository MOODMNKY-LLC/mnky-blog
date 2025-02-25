import Link from 'next/link'
import {
  Twitter,
  Github,
  MessageCircle,
  Facebook,
  Instagram,
  Mail
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const companyLinks = [
  { name: 'Blog', href: '/blog', tooltip: 'Read our latest articles' },
  { name: 'Community', href: '/community', tooltip: 'Join our community' },
  { name: 'Contact', href: '/contact', tooltip: 'Get in touch with us' },
]

const legalLinks = [
  { name: 'Terms', href: '/terms', tooltip: 'Terms of Service' },
  { name: 'Privacy', href: '/privacy', tooltip: 'Privacy Policy' },
  { name: 'RSS', href: '/rss', tooltip: 'Subscribe to our RSS feed' },
]

const socialLinks = [
  { name: 'Discord', href: 'https://discord.gg/moodmnky', icon: MessageCircle, tooltip: 'Join our Discord community' },
  { name: 'GitHub', href: 'https://github.com/moodmnky', icon: Github, tooltip: 'Follow our open source work' },
  { name: 'Twitter', href: 'https://twitter.com/moodmnky', icon: Twitter, tooltip: 'Follow us on Twitter' },
  { name: 'Instagram', href: 'https://instagram.com/moodmnky', icon: Instagram, tooltip: 'Follow us on Instagram' },
  { name: 'Facebook', href: 'https://facebook.com/moodmnky', icon: Facebook, tooltip: 'Connect on Facebook' },
  { name: 'Email', href: 'mailto:hello@moodmnky.com', icon: Mail, tooltip: 'Email us' },
]

export function Footer() {
  return (
    <footer className="relative mt-12">
      <div className="flex justify-center p-4">
        <div className="relative flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-full glass">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-wider text-gradient-gold">MNKY</span>
            <span className="text-base font-medium tracking-wide text-muted-foreground">BLOG</span>
          </Link>

          {/* Main Links */}
          <nav className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-6">
              {companyLinks.map((link) => (
                <TooltipProvider key={link.href} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <span className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((link) => (
                <TooltipProvider key={link.href} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <link.icon className="h-4 w-4" />
                        <span className="sr-only">{link.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </nav>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
            {legalLinks.map((link) => (
              <TooltipProvider key={link.href} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 