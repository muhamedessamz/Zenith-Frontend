import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Calendar,
  Shield,
  Clock,
  Kanban,
  Menu,
  X,
} from "lucide-react";

export const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-effect border-b border-white/20">
          <nav className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo size={36} showText={true} />
              </div>

              {/* Center Navigation - Desktop */}
              <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                <a
                  href="features"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Features
                </a>
                <a
                  href="how-it-works"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  How It Works
                </a>
                <a
                  href="pricing"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Pricing
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Right Actions - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn btn-ghost text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            <a
              href="features"
              className="block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span>Features</span>
                <ArrowRight
                  size={16}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
            <a
              href="how-it-works"
              className="block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span>How It Works</span>
                <ArrowRight
                  size={16}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
            <a
              href="pricing"
              className="block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span>Pricing</span>
                <ArrowRight
                  size={16}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
            <Link
              to="/login"
              className="block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span>Sign In</span>
                <ArrowRight
                  size={16}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>
            <Link
              to="/register"
              className="block px-4 py-3 rounded-lg text-lg font-medium text-indigo-600 font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span>Get Started Free</span>
                <ArrowRight size={16} className="ml-auto" />
              </div>
            </Link>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Zenith - Reach the Peak of Productivity
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6 animate-fadeIn">
            <Zap size={16} className="text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">
              Boost Your Productivity by 10x
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight animate-fadeIn">
            Reach the <span className="gradient-text">Peak</span> of
            <br />
            Productivity
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fadeIn">
            Zenith is the ultimate task management platform that helps teams
            collaborate, track progress, and achieve their goals faster than
            ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeIn">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <a href="features" className="btn btn-secondary text-lg px-8 py-4">
              Explore Features
            </a>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative max-w-6xl mx-auto animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-4 sm:p-6">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Dashboard
                    </h3>
                    <p className="text-sm text-gray-500">
                      Welcome back, Ahmed!
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100"></div>
                    <div className="w-8 h-8 rounded-lg bg-cyan-100"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                      <span className="text-xs text-green-600 font-semibold">
                        +12%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">48</p>
                    <p className="text-xs text-gray-500">Total Tasks</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                      <span className="text-xs text-green-600 font-semibold">
                        +8%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">32</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <Calendar size={16} className="text-white" />
                      </div>
                      <span className="text-xs text-amber-600 font-semibold">
                        12
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">16</p>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                        <Users size={16} className="text-white" />
                      </div>
                      <span className="text-xs text-cyan-600 font-semibold">
                        5
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">8</p>
                    <p className="text-xs text-gray-500">Team Members</p>
                  </div>
                </div>

                {/* Charts and Tasks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Chart */}
                  <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-700">
                        Weekly Progress
                      </h4>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-2">
                      <div
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                        style={{ height: "60%" }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                        style={{ height: "80%" }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                        style={{ height: "45%" }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                        style={{ height: "90%" }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                        style={{ height: "70%" }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                        style={{ height: "95%" }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                        style={{ height: "85%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Tasks */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Recent Tasks
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            Design Review
                          </p>
                          <p className="text-xs text-gray-400">Completed</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            API Integration
                          </p>
                          <p className="text-xs text-gray-400">In Progress</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            Team Meeting
                          </p>
                          <p className="text-xs text-gray-400">Pending</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            Code Review
                          </p>
                          <p className="text-xs text-gray-400">Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white scroll-mt-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you and your team reach new
              heights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group hover:shadow-xl hover:border-indigo-200 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* View All Features Button */}
          <div className="text-center">
            <Link to="/features" className="btn btn-primary text-lg px-8 py-4">
              View All Features
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-cyan-50 scroll-mt-20"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Simple, Yet <span className="gradient-text">Powerful</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes, master in hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="pricing"
        className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-cyan-600 text-white scroll-mt-20"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Reach Your Peak?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of teams already using Zenith to achieve their goals
          </p>
          <Link
            to="/register"
            className="btn bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl"
          >
            Start Free Trial
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Logo variant="white" size={36} />
              <p className="text-gray-400 mt-6 text-sm leading-relaxed max-w-sm">
                The ultimate task management platform for modern teams.
                Collaborate, track, and achieve more together.
              </p>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Zenith. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: CheckCircle2,
    title: "Task Management",
    description:
      "Complete CRUD operations with filters, priorities, categories, and tags for perfect organization.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Multi-user assignments, real-time updates, comments, and shared workspaces.",
  },
  {
    icon: Kanban,
    title: "Multiple Views",
    description:
      "Kanban boards, Calendar view, List view, and Dashboard for flexible workflow visualization.",
  },
  {
    icon: Clock,
    title: "Time & Progress",
    description:
      "Built-in time tracking, task dependencies, checklists, and detailed analytics.",
  },
  {
    icon: Calendar,
    title: "Smart Integration",
    description:
      "Google Calendar sync, file attachments, shared links, and real-time notifications.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description:
      "Secure authentication, encrypted data, role-based access, and 99.9% uptime.",
  },
];

const steps = [
  {
    title: "Create Account",
    description: "Sign up in seconds and start your free trial",
  },
  {
    title: "Set Up Projects",
    description: "Create projects and invite your team members",
  },
  {
    title: "Start Achieving",
    description: "Track tasks, collaborate, and reach your goals",
  },
];
