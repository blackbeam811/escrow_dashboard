import CreateOfferCard from "./createOfferCard";
import curve from "../../../assets/imgs/arrow curve.png";
import point from "../../../assets/imgs/pre.png";
import recycle from "../../../assets/imgs/Recyle.png";
import dex from "../../../assets/imgs/tether.png";
import nft from "../../../assets/imgs/virtual.png";
import vesting from "../../../assets/imgs/Streamline.png";
import eth from "../../../assets/imgs/eth.png";
import BNB from "../../../assets/imgs/BNB.png";
import Mode from "../../../assets/imgs/Mode.png";
import optimism from "../../../assets/imgs/Solana.png";
import solana from "../../../assets/imgs/Solana.png";
const CreateStep1 = () => {
  return (
    <div className="w-2/3 bg-[#15161B] py-5 px-16 rounded-md min-w-[420px]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className=" font-semibold text-[25px] text-white">
            Get Started
          </div>
          <div className="flex mt-2 items-center">
            <div className="relative border rounded-[999px] w-[31px] h-[31px] bg-[#101116]">
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-4">
                1
              </div>
            </div>
            <div className="text-[16px] text-white ml-2">Select Market</div>
          </div>
        </div>
        <div className="bg-[#101116] px-5 py-2 h-fit text-white rounded-md">
          Step 3/1 Done
        </div>
      </div>
      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-7  mt-5 ">
        <CreateOfferCard
          img={curve}
          title={"Pre Market"}
          content={"Trade pre-TGE Token allocation "}
          active={1}
        />
        <CreateOfferCard
          img={point}
          title={"Points Market"}
          content={"Trade pre-TGE Token allocation "}
          active={0}
        />
        <CreateOfferCard
          img={recycle}
          title={"Runes Market"}
          content={"Trade pre-TGE Token allocation "}
          active={0}
        />
        <CreateOfferCard
          img={dex}
          title={"Runes DEX"}
          content={"Trade pre-TGE Token allocation "}
          active={0}
        />
        <CreateOfferCard
          img={nft}
          title={"NFT Whitelist"}
          content={"Trade pre-TGE Token allocation "}
          active={0}
        />
        <CreateOfferCard
          img={vesting}
          title={"Vesting Market"}
          content={"Trade pre-TGE Token allocation "}
          active={0}
        />
      </div>
      <div className="w-full">
        <div className="flex mt-2 items-center">
          <div className="relative border rounded-[999px] w-[31px] h-[31px] bg-[#101116]">
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-4">
              2
            </div>
          </div>
          <div className="text-[16px] text-white ml-2">Select Market</div>
        </div>
        <div className="w-full bg-[#1A1B1E] border border-[#969696] rounded-md flex justify-start items-center space-x-3 text-white py-2 px-8 mt-2">
          <img src={eth} alt="eth" className="w-[27px] h-[15px]" />
          <div className="text-sm">Ethereum</div>
        </div>
        <div
          className="w-full h-[200px] bg-[#1A1B1E] border border-[#969696] rounded-md mt-2 px-8 overflow-auto"
          id="scrollbar"
        >
          <div className="w-full rounded-md flex justify-start items-center space-x-3 text-white py-2  relative">
            <img src={eth} alt="eth" className="w-[27px] h-[15px]" />
            <div className="text-sm">Ethereum</div>
            <div className="w-full bg-white h-[1px] opacity-50 absolute bottom-0"></div>
          </div>
          <div className="w-full rounded-md flex justify-start items-center space-x-3 text-white py-2  relative">
            <img src={BNB} alt="eth" className="w-[27px] h-[15px]" />
            <div className="text-sm">BNB Chain</div>
            <div className="w-full bg-white h-[1px] opacity-50 absolute bottom-0"></div>
          </div>
          <div className="w-full rounded-md flex justify-start items-center space-x-3 text-white py-2  relative">
            <img src={Mode} alt="eth" className="w-[27px] h-[15px]" />
            <div className="text-sm">Mode Chain</div>
            <div className="w-full bg-white h-[1px] opacity-50 absolute bottom-0"></div>
          </div>
          <div className="w-full rounded-md flex justify-start items-center space-x-3 text-white py-2  relative">
            <img src={optimism} alt="eth" className="w-[27px] h-[15px]" />
            <div className="text-sm">Optimism</div>
            <div className="w-full bg-white h-[1px] opacity-50 absolute bottom-0"></div>
          </div>
          <div className="w-full rounded-md flex justify-start items-center space-x-3 text-white py-2  relative">
            <img src={solana} alt="eth" className="w-[27px] h-[15px]" />
            <div className="text-sm">Solana</div>
            <div className="w-full bg-white h-[1px] opacity-50 absolute bottom-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStep1;
