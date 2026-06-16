
const Footer = () => {
  return (
    <footer id="kontak" className="pt-24 pb-8 bg-[#e8ffee]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#1a7a4a] flex items-center justify-center text-white text-sm">🌿</div>
              <span className="font-serif text-2xl font-bold text-[#1a7a4a]">KidsCare</span>
            </div>
            <p className="text-[#4a6b5a] text-sm leading-relaxed mb-6">
              Pusat kesehatan anak terpadu yang berfokus pada pencegahan dan pengobatan dini di Bandung.
            </p>
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-full bg-[#c0e2cb] flex items-center justify-center text-[#1a7a4a] cursor-pointer hover:bg-[#1a7a4a] hover:text-white transition-all text-xs font-bold">IG</span>
              <span className="w-10 h-10 rounded-full bg-[#c0e2cb] flex items-center justify-center text-[#1a7a4a] cursor-pointer hover:bg-[#1a7a4a] hover:text-white transition-all text-xs font-bold">FB</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#0f2d1e]">Tautan</h4>
            <ul className="space-y-4 text-sm text-[#4a6b5a] list-none p-0">
              <li className="hover:text-[#1a7a4a] cursor-pointer">Beranda</li>
              <li className="hover:text-[#1a7a4a] cursor-pointer">Layanan</li>
              <li className="hover:text-[#1a7a4a] cursor-pointer">Tim Dokter</li>
              <li className="hover:text-[#1a7a4a] cursor-pointer">Testimoni</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#0f2d1e]">Layanan Pelanggan</h4>
            <ul className="space-y-4 text-sm text-[#4a6b5a] list-none p-0">
              <li className="hover:text-[#1a7a4a] cursor-pointer">Pusat Bantuan</li>
              <li className="hover:text-[#1a7a4a] cursor-pointer">Kebijakan Privasi</li>
              <li className="hover:text-[#1a7a4a] cursor-pointer">Syarat Penggunaan</li>
              <li className="hover:text-[#1a7a4a] cursor-pointer">Karir</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#0f2d1e]">Lokasi & Kontak</h4>
            <p className="text-sm text-[#4a6b5a] leading-relaxed mb-4">
              Jl. Pasteur No. 123, Bandung,<br />Jawa Barat 40161, Indonesia
            </p>
            <p className="text-[#1a7a4a] font-bold text-sm flex items-center gap-2">
              <span>📞</span> (022) 1234-5678
            </p>
          </div>
        </div>
        <div className="pt-8 border-t border-[#c0e2cb] text-center text-[10px] text-[#4a6b5a]/60 uppercase tracking-widest">
          © 2024 KidsCare Pediatrics Bandung. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;