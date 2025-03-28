
import { Home, Receipt, PiggyBank, Target, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: PiggyBank, label: "Savings", path: "/savings" },
  { icon: Target, label: "Goals", path: "/goals" },
];

export function MainNavigation() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="hidden md:block">
        <nav className="flex h-16 items-center justify-between bg-background px-4 shadow-sm">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Union</span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/lovable-uploads/90c58b81-fea0-4aac-a205-3e08e87bc860.png"
                alt="User"
                className="h-10 w-10 rounded-full"
              />
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden h-16 items-center justify-between bg-background px-4 shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Union</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </nav>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs border-l bg-background p-6 shadow-lg animate-in slide-in-from-right">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">Union</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="sr-only">Close</span>
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
                    className="h-6 w-6"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-2 rounded-md px-4 py-2">
                  <img
                    src="/lovable-uploads/90c58b81-fea0-4aac-a205-3e08e87bc860.png"
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">Alex Johnson</p>
                    <p className="text-xs text-muted-foreground">alex@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
