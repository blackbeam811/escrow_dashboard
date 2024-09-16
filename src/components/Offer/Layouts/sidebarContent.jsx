import { useState } from "react";
import arrow from "../../../assets/imgs/arrow curve.png";
import bug from "../../../assets/imgs/Bug.png";
import recycle from "../../../assets/imgs/Recyle.png";
import undo from "../../../assets/imgs/undo.png";
const SidebarContent = (props) => {
  // eslint-disable-next-line react/prop-types
  const { img } = props;
  const [tmp, setTmp] = useState(1);

  const handle = () => {
    setTmp(tmp === 1 ? 0 : 1);
  };
  return (
    <div className="w-full mb-6">
      <div className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center bg-[#272A2F] rounded-[5px]">
        <div className="flex-1 w-0 flex items-center space-x-1">
          <img className="w-[24px] h-[24px]" src={img} alt="arrow.png" />
          <p>Markets</p>
        </div>
        <img
          className="w-[19px] h-[19px] hover:cursor-pointer"
          src={undo}
          alt="arrow.png"
          onClick={handle}
        />
      </div>
      {tmp === 1 ? (
        <div className="w-full">
          <div className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center rounded-[5px] hover:bg-slate-800 hover:cursor-pointer">
            <div className="flex-1 w-0 flex items-center space-x-1">
              <img className="w-[24px] h-[24px]" src={arrow} alt="arrow.png" />
              <p className=" opacity-50">Pre-market</p>
            </div>
          </div>
          <div className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center rounded-[5px] hover:bg-slate-800 hover:cursor-pointer">
            <div className="flex-1 w-0 flex items-center space-x-1">
              <img
                className="w-[24px] h-[24px]"
                src={recycle}
                alt="arrow.png"
              />
              <p className=" opacity-50">Points</p>
            </div>
          </div>
          <div className="w-full pl-[9px] pr-[17px] py-[10px] text-[14px] text-white flex items-center rounded-[5px] hover:bg-slate-800 hover:cursor-pointer">
            <div className="flex-1 w-0 flex items-center space-x-1">
              <img className="w-[24px] h-[24px]" src={bug} alt="arrow.png" />
              <p className=" opacity-50">Vesting</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SidebarContent;
