"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Library, Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/search", label: "Search", Icon: Search },
  { href: "/library", label: "Library", Icon: Library },
  { href: "/upload", label: "Upload", Icon: Upload },
  { href: "/about", label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {items.map(({ href, label, Icon }) => {
          const active =
            pathname === href || pathname?.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(href);
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
                aria-label={label}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
