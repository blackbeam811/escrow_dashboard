import chart_mixed from "../../../assets/imgs/Chart_Mixed.png";
import { useState } from "react";
import undo from "../../../assets/imgs/undo.png";

import runes from "../../../assets/imgs/Runes.png";
import pre from "../../../assets/imgs/pre.png";
import { IoMdEye } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [market, setMarket] = useState(1);
  const [rune, setRune] = useState(1);
  const handle1 = () => {
    setMarket(market === 1 ? 0 : 1);
  };
  const handle2 = () => {
    setRune(rune === 1 ? 0 : 1);
  };
  return (
    <div className="fixed top-[103px] left-0 w-[257px]  h-[calc(100vh-103px)] pl-[14px] pr-3.5 pt-5 bg-[#101116] shadow-cs z-10 z-[1]git overflow-hidden ">
      <div className="w-full mb-6">
        <div className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center bg-[#272A2F] rounded-[5px]">
          <div className="flex-1 w-0 flex items-center space-x-3">
            <img
              className="w-[24px] h-[24px]"
              src={chart_mixed}
              alt="arrow.png"
            />
            <p>OTC</p>
          </div>
          <img
            className="w-[19px] h-[19px] hover:cursor-pointer"
            src={undo}
            alt="arrow.png"
            onClick={handle1}
          />
        </div>
        {market === 1 ? (
          <div className="w-full">
            <Link
              className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center rounded-[5px] hover:bg-slate-800 transition duration-300 hover:cursor-pointer"
              to="/"
            >
              <div className="flex-1 w-0 flex items-center space-x-3">
                <IoMdEye className="w-5 h-auto text-gray-600" />
                <p className=" opacity-50" to="/">
                  View Offers
                </p>
              </div>
            </Link>
            <Link
              className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center rounded-[5px] hover:bg-slate-800 transition duration-300 hover:cursor-pointer"
              to="/offer-step"
            >
              <div className="flex-1 w-0 flex items-center space-x-3">
                <SlNote className="w-5 h-auto text-gray-700" />
                <p className=" opacity-50">Create Offer</p>
              </div>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="w-full mb-6">
        <div className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center bg-[#272A2F] rounded-[5px]">
          <div className="flex-1 w-0 flex items-center space-x-3">
            <img className="w-[24px] h-[24px]" src={runes} alt="arrow.png" />
            <p>My Dashboard</p>
          </div>
          <img
            className="w-[19px] h-[19px] hover:cursor-pointer"
            src={undo}
            alt="arrow.png"
            onClick={handle2}
          />
        </div>
        {rune === 1 ? (
          <div className="w-full">
            <Link
              className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center rounded-[5px] hover:bg-slate-800 transition duration-300 hover:cursor-pointer"
              to="/profile"
            >
              <div className="flex-1 w-0 flex items-center space-x-3">
                <img className="w-[24px] h-[24px]" src={pre} alt="arrow.png" />
                <p className=" opacity-50">My Profile</p>
              </div>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Sidebar;
