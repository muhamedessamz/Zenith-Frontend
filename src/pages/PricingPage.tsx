import { useState } from "react";
import { Logo } from "../components/Logo";
import { Link } from "react-router-dom";
import { Check, ArrowRight, HelpCircle } from "lucide-react";

export const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans text-gray-900">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-effect border-b border-white/20">
          <nav className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo size={36} showText={true} />
              </div>

              {/* Center Navigation */}
              <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Features
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  How It Works
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
                >
                  Pricing
                </Link>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
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

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for you and your team. No hidden fees.
            Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <span
              className={`text-sm font-medium ${
                !isAnnual ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly
            </span>

            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
                className="sr-only"
              />
              <div
                onClick={() => setIsAnnual(!isAnnual)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out flex-shrink-0 ${
                  isAnnual ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                    isAnnual ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>

            <span
              className={`text-sm font-medium text-center ${
                isAnnual ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Annual
              <span className="block sm:inline text-indigo-600 font-bold sm:ml-1">
                (Save 20%)
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all relative">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-500 text-sm mb-6">
              Perfect for individuals and hobbyists.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <Link
              to="/register"
              className="btn w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none mb-8"
            >
              Get Started
            </Link>
            <ul className="space-y-4 text-sm text-gray-600">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className="text-green-500 flex-shrink-0 mt-0.5"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-indigo-600 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-500 text-sm mb-6">
              For growing teams that need more power.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">
                ${isAnnual ? "12" : "15"}
              </span>
              <span className="text-gray-500">/user/month</span>
            </div>
            <Link
              to="/register"
              className="btn w-full btn-primary mb-8 shadow-lg shadow-indigo-200"
            >
              Start Free Trial
            </Link>
            <ul className="space-y-4 text-sm text-gray-600">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className="text-indigo-600 flex-shrink-0 mt-0.5"
                  />
                  <span className="font-medium text-gray-900">{feature}</span>
                </li>
              ))}
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400">
                  <Check
                    size={18}
                    className="text-indigo-200 flex-shrink-0 mt-0.5"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-gray-500 text-sm mb-6">
              Advanced security and control for large organizations.
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            <Link
              to="/contact"
              className="btn w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 mb-8"
            >
              Contact Sales
            </Link>
            <ul className="space-y-4 text-sm text-gray-600">
              {enterpriseFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className="text-indigo-600 flex-shrink-0 mt-0.5"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-lg mb-2 flex items-start gap-3">
                  <HelpCircle
                    size={20}
                    className="text-indigo-500 mt-1 flex-shrink-0"
                  />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white mt-20">
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
                  <Link
                    to="/features"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </Link>
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

const freeFeatures = [
  "Up to 3 projects",
  "Unlimited tasks",
  "5 team members",
  "Basic Kanban board",
  "1GB storage",
  "Community support",
];

const proFeatures = [
  "Unlimited projects",
  "Unlimited team members",
  "Advanced Kanban & Calendar",
  "Time tracking",
  "Gantt charts (Dependencies)",
  "10GB storage",
  "Priority email support",
];

const enterpriseFeatures = [
  "Everything in Pro",
  "Single Sign-On (SSO)",
  "Advanced security",
  "Dedicated success manager",
  "Unlimited storage",
  "Custom integrations",
  "SLA guarantee",
  "24/7 phone support",
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. We do not lock you into long-term contracts unless you choose the annual plan.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! We offer a 14-day free trial for the Pro plan. No credit card required to start.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "Your data will be preserved, but you may lose access to paid features. You can always re-upgrade later to regain access.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer:
      "Yes, we offer a 50% discount for registered non-profit organizations. Contact our sales team for more details.",
  },
];
