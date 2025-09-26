import React from "react";
import { Link } from "react-router-dom";
import LogoImage from "../Assets/logo.svg";
import { useState } from "react";
import Arrow from "../Assets/Arrow";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
   const toggleDropdown = () => {
    setIsOpen(!isOpen); // click par toggle
  };
  
  return (
    <header className="MainHeader shadow-sm">
      <div className="lg:container mx-auto">
        <div className="grid grid-cols-12 p-3 items-center">
          <div className="LogoWrapper col-span-3">
            <a href="/">
              <img src={LogoImage} alt="Logo" className="w-full h-12" />
            </a>
          </div>
          <div className="header-menus col-span-6 w-full">
            <nav className="flex items-center justify-center gap-9  w-full relative">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <div className="relative">
                <button
                  className="flex items-center gap-1"
                  onClick={toggleDropdown}
                >
                  Online Trainings Services
                  <Arrow />
                </button>

                {isOpen && (
                  <ul className="dropdown-menu absolute top-full left-0 bg-cstm-blue text-white w-full max-w-52 block rounded-md py-5 px-4">
                    <li>
                      <Link to="/web-design" onClick={() => setIsOpen(false)}>
                        Web Design
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </nav>
          </div>
          <div className="header-icons col-span-3">
            <a
              href="/"
              className="button bg-cstm-blue rounded-3xl py-2 px-4 text-white leading-normal"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
