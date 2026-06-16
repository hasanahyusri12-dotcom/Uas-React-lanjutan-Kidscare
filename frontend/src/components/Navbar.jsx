import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a7a4a] to-[#4eca80] flex items-center justify-center text-xl shadow-md shadow-[#1a7a4a]/20">
            🌿
          </div>
          <span className="font-serif text-2xl font-bold text-[#1a7a4a]">
            Kids<span className="text-[#4eca80]">Care</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['Beranda', 'Layanan', 'Dokter', 'Testimoni', 'Kontak'].map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              className="font-medium text-[#4a6b5a] hover:text-[#1a7a4a] transition-colors text-sm no-underline"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[#1a7a4a] font-bold px-4 py-2 hover:bg-[#d9fce4] transition-colors rounded-full text-sm no-underline">Login</Link>
          <Link to="/register" className="bg-[#1a7a4a] text-white font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-md shadow-[#1a7a4a]/20 text-sm no-underline">Daftar</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;