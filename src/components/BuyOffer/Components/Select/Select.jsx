/* eslint-disable react/prop-types */
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiBitcoin } from "react-icons/ci";



export const Select = ({ label }) => {
  return <div>
    <p className='text-white mb-2 text-xs not-italic font-medium leading-[normal]' >
      {label}
    </p>
    <div className='w-full flex items-center px-[10px] rounded-[4px]  bg-[#1A1B1E]' >
      <input className='w-full outline-none text-white py-3 h-full bg-transparent text-[10px] not-italic font-normal leading-[normal]' />
      <div className='flex items-center gap-x-[3px]  text-white cursor-pointer' >
        <CiBitcoin />
        <p className='flex items-center  gap-x-1 text-white text-[10px] not-italic font-normal leading-[normal]' >
          USD
          <MdOutlineKeyboardArrowDown />
        </p>
      </div>
    </div>
  </div>
}
