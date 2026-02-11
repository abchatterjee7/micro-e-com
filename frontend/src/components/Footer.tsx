import { Github, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">

        {/* Customer Care */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3 text-white">Customer Care</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Cancel & Returns</li>
            <li className="hover:text-white cursor-pointer">Shipping</li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3 text-white">Company</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Policy */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3 text-white">Policy</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Use</li>
          </ul>
        </div>

        {/* Social & Credits */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3 text-white">Connect with us</h4>
          <div className="flex items-center gap-4 mb-4 text-gray-400">
            <a href="https://github.com/AadityaUoHyd" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Github size={22} stroke="currentColor" />
            </a>
            <a href="https://www.linkedin.com/in/bachchu-chatterjee-0485933b/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Linkedin size={22} stroke="currentColor" />
            </a>
            <a href="https://x.com/AadityaRaj8" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Twitter size={22} stroke="currentColor" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Facebook size={22} stroke="currentColor" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            Developed by <span className="font-semibold text-white">Aaditya B Chatterjee</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">© {currentYear} MicroEcom. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
