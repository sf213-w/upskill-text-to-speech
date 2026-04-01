import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Mic, Search, Settings, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

function LanguageToggle() {
  const { i18n } = useTranslation();
  const isES = i18n.language === "es";

  return (
    <button
      onClick={() => i18n.changeLanguage(isES ? "en" : "es")}
      className="flex items-center bg-muted border border-border rounded-full px-1 py-1 gap-0.5 shadow-sm hover:shadow transition-shadow"
      aria-label="Switch language"
    >
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          !isES
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground"
        }`}
      >
        EN
      </span>
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          isES
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground"
        }`}
      >
        ES
      </span>
    </button>
  );
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/search", icon: Search, label: t("nav.search") },
    { href: "/book", icon: CalendarDays, label: t("nav.book") },
    { href: "/consultation", icon: Mic, label: t("nav.translate") },
    { href: "/settings", icon: Settings, label: t("nav.settings") },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-background w-full max-w-md mx-auto relative overflow-hidden shadow-2xl sm:border-x sm:border-border">
      {/* Top bar with language toggle — hidden on consultation (it has its own header) */}
      {!hideNav && (
        <div className="flex justify-end items-center px-4 pt-3 pb-1">
          <LanguageToggle />
        </div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${hideNav ? "" : "pb-20"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 pb-safe flex justify-between items-center z-50">
          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "stroke-[2.5px]" : "stroke-2"
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      isActive ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}