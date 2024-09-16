import { IoIosCheckmark } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import img1 from "../../../../../../assets/imgs/eth.png";
import img2 from "../../../../../../assets/imgs/BNB.png";
import img3 from "../../../../../../assets/imgs/Mode.png";
import img4 from "../../../../../../assets/imgs/Optimism.png";
import img5 from "../../../../../../assets/imgs/Solana.png";
import { useState } from "react";

export const SelectMaerket = () => {
  const [select, setSelect] = useState(MARKET[0]);
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-4">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="py-[11px] text-white pl-[15px] cursor-pointer flex  w-full items-center pr-2.5 justify-between rounded border-[0.2px] border-solid border-[#969696]"
      >
        <div className="flex gap-x-[10px] items-center">
          <div className="w-[18px] h-[18px] rounded-full">
            <img src={select.icon} />
          </div>
          <h2 className="text-white text-[10px] not-italic font-normal leading-[normal]">
            {select.label}
          </h2>
        </div>
        <IoIosArrowDown
          className={`  transition-all duration-300 ${
            open ? " rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`mt-[7px] overflow-y-auto transition-all duration-300 ${
          open ? "max-h-[139px]  border-[0.2px] border-solid" : "max-h-0"
        } shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)] rounded-[5px] border-[rgba(255,255,255,0.50)] px-5`}
      >
        {MARKET.map((mrk, index) => (
          <div
            onClick={() => setSelect(mrk)}
            className={`py-[6px] cursor-pointer ${
              MARKET.length - 1 !== index
                ? "border-b-[#969696] !border-b-[0.1px]"
                : ""
            } cursor-pointer gap-x-3 flex justify-between items-center`}
            key={index}
          >
            <div className="flex items-center gap-x-[10px]">
              <img src={mrk.icon} className="w-[15px] object-cover h-[15px]" />
              <p className="text-white text-[10px] not-italic font-normal leading-[normal]">
                {mrk.label}
              </p>
            </div>
            {mrk.value === select.value && (
              <IoIosCheckmark className="text-white" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
