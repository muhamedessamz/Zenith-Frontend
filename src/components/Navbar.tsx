import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { ProfileAvatar } from "./ProfileAvatar";
import { MobileMenu } from "./MobileMenu";
import { NotificationBell } from "./NotificationBell";
import { useAuthStore } from "../store/authStore";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/tasks", label: "Tasks" },
    { path: "/projects", label: "Projects" },
    { path: "/calendar", label: "Calendar" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - visible on all screen sizes */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Menu - hidden logout button on mobile, mobile menu always visible */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ProfileAvatar
              name={user?.displayName || user?.email}
              imageUrl={user?.profilePicture}
            />

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile menu button always visible on mobile */}
            <MobileMenu onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};
