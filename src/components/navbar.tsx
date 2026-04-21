"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Use cases", href: "/#use-cases" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

type NavbarMode = "default" | "pill-on-scroll";

export function Navbar({ mode = "default" }: { mode?: NavbarMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pillMode = mode === "pill-on-scroll";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        pillMode ? "px-4 pt-4 sm:px-6" : undefined,
        !pillMode &&
          (scrolled
            ? "border-b border-border bg-background/80 shadow-sm backdrop-blur-lg"
            : "bg-transparent"),
      )}
    >
      <nav
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-300",
          pillMode
            ? scrolled
              ? "max-w-5xl rounded-full border border-border/70 bg-background/85 px-5 py-3 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:px-6"
              : "max-w-6xl px-0 py-2"
            : "max-w-6xl px-6 py-4",
        )}
      >
        <Link href="/" className="text-xl tracking-tight text-foreground">
          <span className="font-semibold">SuperAI</span>
          <span className="font-display italic">coach</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground/90 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="rounded-full px-5 text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-primary px-5 text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Link
              href="https://calendly.com/levineam/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <button
          className="rounded-full p-2 text-foreground transition-colors hover:bg-background/70 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div
          className={cn(
            "backdrop-blur-lg md:hidden",
            pillMode
              ? "mx-auto mt-3 max-w-5xl rounded-[28px] border border-border/70 bg-background/95 px-6 pb-6 pt-4 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.32)]"
              : "border-t border-border bg-background/95 px-6 pb-6 pt-4",
          )}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              variant="outline"
              className="mt-2 w-full rounded-full"
            >
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link
                href="https://calendly.com/levineam/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
              >
                Book a Call
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
