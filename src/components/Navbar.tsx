// ============================================================================
// TYPES
// ============================================================================

interface NavLink {
  label: string;
  href: string;
  isCTA?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const NAV_LINKS: NavLink[] = [
  { label: "Personal", href: "personal" },
  { label: "Business", href: "business" },
  { label: "Wealth", href: "wealth" },
  { label: "About", href: "about" },
  { label: "Articles", href: "articles" },
  { label: "Get Started", href: "#", isCTA: true },
];

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================

const Navbar = () => {
  return (
    <nav>
      <a href="/" className="logo">
        Brightstream
      </a>
      <ul className="nav-links hidden md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={
                link.isCTA
                  ? "nav-cta hover:text-gray-900"
                  : undefined
              }
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
