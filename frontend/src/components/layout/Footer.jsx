import { Link } from "react-router-dom";
import { MapPin, Mail, Clock } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useBranches } from "../../hooks/useBranches";
import logoImg from "../../assets/logo.jpg";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Our Menu" },
  { to: "/order", label: "Order Online" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reservations", label: "Reservations" },
  { to: "/contact", label: "Contact Us" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { branches: BRANCHES } = useBranches();

  return (
    <footer className="bg-brand-red-dark text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4"
              aria-label="Yum-Yum Cafe Home"
            >
              <img
                src={logoImg}
                alt="Yum-Yum Cafe"
                className="h-10 w-10 object-cover rounded"
              />
              <span className="font-display text-white text-xl">
                Yum-Yum Cafe
              </span>
            </Link>
            <p className="text-white/65 text-sm leading-relaxed mb-5">
              Quick service restaurant offering delicious Continental & African
              dishes across 4 Lagos locations. Fresh food, fast service, every
              time.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://web.facebook.com/Yumyumcafeng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Yum-Yum Cafe on Facebook"
              >
                <FaFacebook size={16} />
              </a>

              <a
                href="https://instagram.com/yyc_ng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Yum-Yum Cafe on Instagram"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/65 text-sm hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Our Branches
            </h3>
            <ul className="flex flex-col gap-3">
              {BRANCHES.map((branch) => (
                <li key={branch.id}>
                  <Link
                    to="/find-us"
                    className="flex items-start gap-2 group"
                    aria-label={`Find ${branch.name} branch`}
                  >
                    <MapPin
                      size={14}
                      className="text-brand-gold-mid mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors block">
                        {branch.name}
                      </span>
                      <span className="text-white/50 text-xs">
                        {branch.area}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & hours */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Get In Touch
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <Clock
                  size={14}
                  className="text-brand-gold-mid mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-white/80 text-sm">Opening Hours</p>
                  <p className="text-white/55 text-xs">
                    Daily: 8:00 AM – 10:00 PM
                  </p>
                </div>
              </li>
              <li>
                <a
                  href="mailto:info@yumyum-cafe.com.ng"
                  className="flex items-start gap-2 group"
                >
                  <Mail
                    size={14}
                    className="text-brand-gold-mid mt-0.5 flex-shrink-0"
                  />
                  <span className="text-white/65 text-sm group-hover:text-white transition-colors break-all">
                    info@yumyum-cafe.com.ng
                  </span>
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-block mt-2 bg-brand-gold text-brand-gold-light text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-gold/90 transition-colors"
                >
                  Send a Message
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/45 text-xs text-center sm:text-left">
            © {currentYear} Yum-Yum Cafe. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Serving Lagos with love since 2018
          </p>
        </div>
      </div>
    </footer>
  );
}
