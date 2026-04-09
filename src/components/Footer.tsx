// ============================================================================
// CONSTANTS
// ============================================================================

const FOOTER_LINKS = ["Privacy", "Terms", "Security", "Contact"];
const COPYRIGHT_TEXT =
  "© 2024 Brightstream Bank. All rights reserved. Member FDIC. Equal Housing Lender.";

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

const Footer = () => {
  return (
    <footer className='bg-midnight text-cream py-6 px-4 mt-auto'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-normal'>
        <p className='text-slate'>{COPYRIGHT_TEXT}</p>
        <div className='flex gap-5 flex-wrap justify-center'>
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href='#'
              className='text-slate hover:text-gold transition-colors duration-200'>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
