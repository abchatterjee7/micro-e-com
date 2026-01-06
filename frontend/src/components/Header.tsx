import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = JSON.parse(localStorage.getItem('cart') || '[]').length;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search when navigating away from home
  useEffect(() => {
    if (location.pathname !== '/') {
      setSearchQuery('');
    } else {
      // Extract search query from URL when on home page
      const params = new URLSearchParams(location.search);
      const search = params.get('search');
      if (search) {
        setSearchQuery(search);
      }
    }
  }, [location]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-pink-500">MicroEcom</span>
          </Link>
          {isAdmin && <Link to="/admin" className="hover:text-pink-500 text-xl px-2">Admin</Link>}
        </div>

        {/* Center Search */}
        <form onSubmit={handleSearch} className="w-1/3 hidden md:flex items-center border rounded px-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full px-2 py-1 outline-none"
          />
        </form>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden flex items-center border rounded px-2 py-1">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-20 px-1 py-0 outline-none text-sm"
          />
        </form>

        {/* Right */}
        <div className="flex items-center gap-4 relative">
          <Link to="/cart" className="flex items-center gap-1 text-pink-500">
            <ShoppingCart />
            <span>({cartCount})</span>
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpen(!open)}>
                <User className="w-8 h-8 rounded-full border p-1 cursor-pointer text-pink-500" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/settings" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link to="/history" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700">Login</Link>
              <Link to="/signup" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
