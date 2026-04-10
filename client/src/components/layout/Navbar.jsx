import { Link, NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `text-sm font-medium ${isActive ? "text-primary" : "text-textPrimary hover:text-primary"}`;

function Navbar() {
  return (
    <header className="border-b border-cardBorder bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-black">
          <span className="text-black">flip</span>
          <span className="text-primary text-[1.8rem]">earn.</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/marketplace" className={navClass}>Marketplace</NavLink>
          <NavLink to="/messages" className={navClass}>Messages</NavLink>
          <NavLink to="/my-listings" className={navClass}>My Listings</NavLink>
        </div>
        <Link to="/auth" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">Login</Link>
      </nav>
    </header>
  );
}

export default Navbar;
