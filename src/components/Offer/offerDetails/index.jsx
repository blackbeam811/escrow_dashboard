import React, { useState, useEffect, useRef } from "react";

import info from "../../../assets/imgs/info.png";
import symbol from "../../../assets/imgs/symbol.png";
import arrow from "../../../assets/imgs/white_arrow.png";
import { Link } from "react-router-dom";

const OfferDetails = ({ data }) => {
  const [radioChecked, setRadioChecked] = useState(0);

  const radioStyle =
    "absolute w-2.5 h-2.5 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[999px] ";
  const style1 = radioChecked === 0 ? "bg-white" : "bg-[#101116]";
  const style2 = radioChecked === 1 ? "bg-white" : "bg-[#101116 ]";
  // console.log("sdfsfsdfsdfsfsdf = " + data);
  return (
    <div className="w-3/5 bg-[#15161B] py-5 px-20 rounded-md min-w-[420px]">
      <div className=" text-[25px] text-white text-center">
        Token Offer Settings
      </div>
      <div className="w-full bg-[#101116] flex p-2 mt-4 rounded-[4px]">
        <div className="w-1/2 text-center text-[12px] text-white border-r-2 border-white p-1.5 hover:cursor-pointer">
          Want To Buy
        </div>
        <div className="w-1/2 text-center text-[12px] text-white p-1.5 opacity-50 hover:cursor-pointer">
          Want To Sell
        </div>
      </div>
      <div className="w-full mt-7">
        <div className="w-full flex items-center">
          <div className="text-white text-[12px]">Price per Token</div>
          <img src={info} alt="info.png" className="w-[14px] h-[14px] ml-4" />
        </div>
        <div className="w-full flex items-center bg-[#1A1B1E] mt-2 rounded-md">
          <input
            type="text"
            className="flex-1 w-0 bg-[#1A1B1E] flex justify-between p-3 border-none focus:outline-none text-white mt-2"
            placeholder="$3.28"
          />
          <div className="flex items-center mx-2 text-white">
            <img src={symbol} alt="icon" className="w-[18px] h-[18px] mr-1" />
            USD
            <img src={arrow} alt="arrow" className="w-[18px] h-[18px] ml-1" />
          </div>
        </div>
      </div>
      <div className="w-full mt-7">
        <div className="w-full flex items-center">
          <div className="text-white text-[12px]">AMOUNT</div>
          <img src={info} alt="info.png" className="w-[14px] h-[14px] ml-4" />
        </div>
        <div className="w-full flex items-center bg-[#1A1B1E] mt-2 rounded-md">
          <input
            type="text"
            className="flex-1 w-0 bg-[#1A1B1E] flex justify-between p-3 border-none focus:outline-none text-white mt-2 rounded-md"
            placeholder="180-5,200,00"
          />
          <div className="flex items-center mx-2 text-white">
            <img src={symbol} alt="icon" className="w-[18px] h-[18px] mr-1" />
            PROTAL
            <img src={arrow} alt="arrow" className="w-[18px] h-[18px] ml-1" />
          </div>
        </div>
      </div>
      <div className="w-full mt-7">
        <div className="w-full flex items-center">
          <div className="text-white text-[12px]">COLLATERAL</div>
          <img src={info} alt="info.png" className="w-[14px] h-[14px] ml-4" />
        </div>
        <div className="w-full flex items-center bg-[#1A1B1E] mt-2 rounded-md">
          <input
            type="text"
            className="flex-1 w-0 bg-[#1A1B1E] flex justify-between p-3 border-none focus:outline-none text-white mt-2 rounded-md"
            placeholder="180-5,200,00"
          />
          <div className="flex items-center mx-2 text-white">
            <img src={symbol} alt="icon" className="w-[18px] h-[18px] mr-1" />
            USD
            <img src={arrow} alt="arrow" className="w-[18px] h-[18px] ml-1" />
          </div>
        </div>
      </div>
      <div className="w-full mt-7">
        <div className="w-full flex items-center">
          <div className="text-white text-[12px]">Description</div>
        </div>
        <textarea className="w-full bg-[#1A1B1E] mt-2 min-h-[76px] rounded-md"></textarea>
      </div>
      <div className="w-full mt-7">
        <div className="text-white">Fiill Type</div>
        <div className="flex flex-col">
          <div className="flex items-start">
            <div
              className=" relative w-5 h-5 border-2 rounded-[999px] hover:cursor-pointer"
              onClick={() => setRadioChecked(0)}
            >
              <div className={radioStyle + style1}></div>
            </div>
            <div className="flex flex-col text-white ml-2">
              <div>Partial Fill</div>
              <div className="opacity-50">
                Multiple user can Contribute to Full fill the Offer
              </div>
            </div>
          </div>
          <div className="flex items-start mt-2">
            <div
              className=" relative w-5 h-5 border-2 rounded-[999px] hover:cursor-pointer"
              onClick={() => setRadioChecked(1)}
            >
              <div className={radioStyle + style2}></div>
            </div>
            <div className="flex flex-col text-white ml-2">
              <div>Single Fill </div>
              <div className="opacity-50">
                Entire offer must be filled by 1 user
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between text-white mt-6 xs:space-y-3">
        <div className=" px-[20%] py-4 bg-[#34373C] text-bold text-md rounded-md hover:cursor-pointer">
          Back
        </div>
        <Link
          className=" px-[20%] py-4 bg-[#101116] text-bold text-md rounded-md hover:cursor-pointer"
          to="/createOffer"
        >
          Next
        </Link>
      </div>
    </div>
  );
};
export default OfferDetails;
