import open from "../../assets/imgs/open.png";
import logo from "../../assets/imgs/logo1.png";
import mask from "../../assets/imgs/Mask.png";
import eth from "../../assets/imgs/virtual.png";
import chatmixed from "../../assets/imgs/Chart_Mixed.png";
import list_checked from "../../assets/imgs/list_check.png";
import bg from "../../assets/imgs/bg_profile.png";

const Profile = () => {
  return (
    <div className="w-[90%]">
      <div className="w-1/2 rounded-md flex justify-start items-center bg-[#15161B] pl-5">
        <div>
          <img src={mask} alt="mask.png" className="w-21 h-21" />
        </div>
        <div className="flex flex-col py-3 ml-3 justify-center">
          <div className="flex justify-between w-1/2">
            <div className="text-lg text-white">0X9bc838....B4677759</div>
            <img src={open} alt="open.png" className="w-4 h-4 ml-6" />
          </div>
          <div className="flex justify-center items-center border border-[#969696] rounded-md bg-[#101116] p-1 m-3">
            <div className="w-4 h-4 rounded-[999px] bg-white flex justify-center items-center">
              <img src={eth} alt="eth.png" />
            </div>
            <div className="text-[10px] text-white">0X9bc838....B4677759</div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between space-x-5 mt-6 ">
        <div className="bg-[#15161B] flex justify-between items-center p-3 rounded-md">
          <div className="flex flex-col items-center space-y-1 pl-6 ">
            <div className="text-white text-lg">Total Trades</div>
            <div className="text-white text-lg">0</div>
            <div className="text-white text-lg opacity-50">
              0 Orders - Offers
            </div>
          </div>
          <div className="py-4 pl-24 pr-12">
            <div className=" bg-[#101116] rounded-[999px] flex px-8 py-6 justify-center items-center opacity-50">
              <img src={logo} alt="logo.png" />
            </div>
          </div>
        </div>
        <div className="bg-[#15161B] flex justify-between items-center p-3 rounded-md">
          <div className="flex flex-col items-center space-y-1 pl-6 ">
            <div className="text-white text-lg">Total Trades</div>
            <div className="text-white text-lg">0</div>
            <div className="text-white text-lg opacity-50">
              0 Orders - Offers
            </div>
          </div>
          <div className="py-4 pl-24 pr-12">
            <div className=" bg-[#101116] rounded-[999px] flex px-8 py-6 justify-center items-center opacity-50">
              <img src={logo} alt="logo.png" />
            </div>
          </div>
        </div>
        <div className="bg-[#15161B] flex justify-between items-center p-3 rounded-md">
          <div className="flex flex-col items-center space-y-1 pl-6 ">
            <div className="text-white text-lg">Total Trades</div>
            <div className="text-white text-lg">0</div>
            <div className="text-white text-lg opacity-50">
              0 Orders - Offers
            </div>
          </div>
          <div className="py-4 pl-24 pr-12">
            <div className=" bg-[#101116] rounded-[999px] flex px-8 py-6 justify-center items-center opacity-50">
              <img src={logo} alt="logo.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#15161B] rounded-md h-[660px] mt-4 py-5 px-8 relative">
        <div className="absolute flex flex-col justify-center items-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <img className="w-[68px] h-[68px]" src={bg} alt="profile" />
          <div className="text-[20px] font-semibold text-white mt-3 opacity-50">
            No Items Found
          </div>
          <div className="text-xs text-white mt-1 opacity-50">
            Nothing is Here{" "}
          </div>
        </div>
        <div className="flex rounded-md border border-[#969696] p-1 w-1/3">
          <div className="flex p-1">
            <img src={chatmixed} alt="chatmixed" className="w-6 h-6" />
            <div className="text-white text-md ml-2">MY OPEN ORDERS </div>
          </div>
          <div className="flex border-l border-l-1 border-[#969696] p-1 pl-4 ml-8">
            <img src={list_checked} alt="chatmixed" className="w-6 h-6" />
            <div className="text-white text-md ml-2">MY ORDER HISTORY</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
