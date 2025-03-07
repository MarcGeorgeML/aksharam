import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Divider from "./Divider";

const Navbar = ({ activeIndex }) => {
  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Letters", path: "/letters" },
    { name: "Words", path: "/words" },
    { name: "Smart Scan", path: "/scan" },
  ];

  const navigate = useNavigate();

  return (
    <nav className="bg-transparent p-4">
      <ul className="flex justify-center space-x-[60px] pt-3">
        {navItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => navigate(item.path)}
              className={`px-5 py-2 rounded-xl text-black text-[18px] font-inria transition ${
                index === activeIndex ? "border-2 border-gray-800" : ""
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
        
      </ul>
      <Divider/>
    </nav>
  );
}

Navbar.propTypes = {
    activeIndex: PropTypes.number.isRequired,
};

export default Navbar