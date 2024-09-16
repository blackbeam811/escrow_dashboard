import logo from "../../../assets/imgs/logo.png";
import CustomConnectButton from "../../connectButton/connectButton";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import eth1 from "../../../assets/imgs/eth.png";
import eth2 from "../../../assets/imgs/virtual.png";
import vector from "../../../assets/imgs/vector.png";
import arrow from "../../../assets/imgs/white_arrow.png";
const Header = () => {
  const tmp = useLocation();
  const tp = tmp.pathname === "/";
  const { isConnected } = useAccount();
  return (
    <div className=" fixed top-0 right-0 flex justify-between items-center w-full h-[103px] bg-black pt-9 pb-7 pl-7 pr-[70px] border-b-[1px] border-[#969696] z-[100]">
      <div className="flex items-center space-x-7">
        <Link to="/">
          <img src={logo} alt="logo.png" className="w-[206px] h-[40px]" />
        </Link>
        {/* {tp === true ? (
          !isConnected ? (
            <div className="flex items-center space-x-2.5 h-[39px]">
              <div className="w-[506px] h-[39px] flex items-center bg-[#363A41] border border-[#969696] p-3 rounded-[5px]">
                <input
                  className="flex-1 w-0 bg-[#363A41] border-none focus:outline-none text-white text-xs"
                  placeholder="Enter the token name"
                />
                <div className="bg-[#969696] border border-[#969696] px-[7px] py-[5px] flex justify-center items-center text-white rounded-[5px] hover:cursor-pointer hover:bg-slate-600">
                  <img src={search} alt="logo.png" className="w-[11px] h-2.5" />
                </div>
              </div>
              <div className="h-[39px] bg-[#363A41] border border-[#969696] p-3 flex items-center text-white rounded-md text-xs hover:cursor-pointer hover:bg-slate-600">
                <img src={sort} alt="sort.png" />
                <span className="ml-1">Filter</span>
              </div>
              <div className="h-[39px] bg-[#363A41] border border-[#969696] p-3 flex justify-center items-center text-white rounded-md text-xs hover:cursor-pointer hover:bg-slate-600">
                <img src={sortalt} alt="sortalt.png" />
                <span className="ml-1">Price: Ascending</span>
              </div>
              <div className="w-[42px] h-[39px] bg-[#363A41] border border-[#969696] rounded-md p-3 flex justify-center items-center text-xs hover:cursor-pointer hover:bg-slate-600">
                <img src={refresh} alt="refresh.png" />
              </div>
            </div>
          ) : (
            <div className="h-[39px] bg-[#363A41] border border-[#969696] p-3 flex justify-center items-center text-white rounded-md">
              <div className=" text-gray-500 px-4 text-md hover:cursor-pointer">
                All
              </div>
              <div className=" py-0 text-white border border-t-0 border-b-0 border-r-0  px-4 text-md border-l-1 border-gray-500 hover:cursor-pointer">
                Pre-Market
              </div>
              <div className=" text-gray-500 border border-t-0 border-b-0 border-r-0  px-4 text-md border-l-1 border-gray-500 hover:cursor-pointer">
                Points
              </div>
              <div className=" text-gray-500 border border-t-0 border-b-0 border-r-0  px-4 text-md border-l-1 border-gray-500 hover:cursor-pointer">
                OTC
              </div>
              <div className=" text-gray-500 border border-t-0 border-b-0 border-r-0  px-4 text-md border-l-1 border-gray-500 hover:cursor-pointer">
                Vesting
              </div>
            </div>
          )
        ) : (
          ""
        )} */}
      </div>
      {!isConnected ? (
        <CustomConnectButton />
      ) : !tp ? (
        <div className="text-white flex space-x-3  h-[39px]">
          <div className=" bg-[#363A41] border border-[#969696] p-3 flex justify-center items-center text-white rounded-md  text-xs hover:cursor-pointer hover:bg-slate-600">
            <div className="flex justify-center items-center p-1">
              <img src={eth1} alt="" className="w-6 h-6" />
              <img src={arrow} alt="" className="w-4 h-4" />
            </div>
            <div className="flex justify-center items-center border border-t-0 border-b-0 border-r-0  pl-4 border-l-1 border-white ml-2 p-1 space-x-1 py-0">
              <img src={eth2} alt="" className="w-6 h-6" />
              <div>0</div>
            </div>
          </div>
          <div className=" bg-[#363A41] border border-[#969696] p-3 flex justify-center items-center text-white rounded-md  text-xs hover:cursor-pointer hover:bg-slate-600 space-x-1">
            <img src={vector} alt="" className="w-5 h-5" />
            <div>0x9bc38....B46759</div>
            <img src={arrow} alt="" className="w-4 h-4" />
          </div>
          <Link
            className=" bg-[#363A41] border border-[#969696] p-3 flex justify-center items-center text-white rounded-md  text-xs hover:cursor-pointer hover:bg-slate-600"
            to="/offer-step"
          >
            + Create Offer
          </Link>
        </div>
      ) : (
        <CustomConnectButton />
      )}
    </div>
  );
};

export default Header;
