/* eslint-disable react/prop-types */

import { useState } from "react";
import { chains } from "./Components/SelectMaerket/chainlist";
import { Modal } from "@mui/material";
import { Zoom } from "@mui/material";

export const GetStart = ({ setActive }) => {
  const [selectCard, setSelectCard] = useState(-1);
  const [modalState, setModalState] = useState(false);
  return (
    <div className="px-16 py-32 flex justify-center items-center flex-wrap">
      {/* <Modal
        aria-labelledby="close-modal-title"
        open={modalState}
        onClose={() => setModalState(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Zoom in={modalState}>
          <div className="p-4 bg-black outline-none rounded-[5px] shadow-lg  tiny:w-[388px] login-modal overflow-x-hidden overflow-y-auto max-h-[90%] text-white">
            Select the chain!
          </div>
        </Zoom>
      </Modal> */}
      <div className=" w-full flex flex-wrap gap-2">
        {chains.map((chain, i) => {
          return (
            <div
              key={i}
              className={` ${
                selectCard === i
                  ? " border border-[white] "
                  : " border border-[#363A41] "
              } py-3 px-5 text-white rounded-[5px] hover:cursor-pointer hover:bg-white hover:text-black transition duration-200`}
              // onClick={() => {
              //   setSelectCard(i);
              // }}
            >
              {chain.title}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          setActive((prev) => prev + 1);
        }}
        className="py-[17px] w-full bg-[#101116] mt-[26px] text-white text-xs not-italic font-normal leading-[normal] hover:bg-white hover:text-black transition duration-200"
      >
        Next
      </button>
    </div>
  );
};

// <div className='flex items-center mt-[16px] gap-x-[7px] ' >
//       <div className='w-[31px] border rounded-full h-[31px] flex justify-center items-center' >
//         <p className='text-white text-base not-italic font-normal leading-[normal]' >1</p>
//       </div>
//       <h1 className='text-white text-base not-italic font-normal leading-[normal]' >Select Market </h1>
//     </div>
//     <div className='grid mt-[21px] grid-cols-3 gap-y-[27px] gap-x-[30px]' >
//       {MARKET.map((card, index) => <Card selectCard={selectCard} setSelectCard={setSelectCard} key={index} card={card} />)}
//     </div>
//     <div className='flex items-center mt-[16px] gap-x-[7px] ' >
//       <div className='w-[31px] border rounded-full h-[31px] flex justify-center items-center' >
//         <p className='text-white text-base not-italic font-normal leading-[normal]' >2</p>
//       </div>
//       <h1 className='text-white text-base not-italic font-normal leading-[normal]' >Select Market </h1>
//     </div>
//     <div>
//       <SelectMaerket />
//     </div>
// <button onClick={() => setActive(prev => prev + 1)} className='py-[17px] w-full bg-[#101116] mt-[26px] text-white text-xs not-italic font-normal leading-[normal]' >
//   Next
// </button>
