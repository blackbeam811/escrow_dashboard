/* eslint-disable react/prop-types */
import { IoIosCloseCircleOutline } from "react-icons/io";


export const BackModal = ({ close, setActive }) => {
  return <>
    <div onClick={close} className="a top-0 left-0 w-full  absolute  min-h-screen bg-[#101116d8]" >
    </div>
    <div className='w-[616px] pb-[46px] fixed  bg-[#1A1B1E] text-white top-36' >
      <div className='flex px-[41px] pt-[39px] pb-[27px] justify-between' >
        <p className='text-white text-lg not-italic font-semibold leading-[normal]' >
          Cancel Create Offer
        </p>
        <button onClick={close} >
          <IoIosCloseCircleOutline className='text-[16px]' />
        </button>
      </div>
      <div className='w-full h-[0.2px] bg-[#969696] mb-[19px]' />
      <div className='px-[46px]' >
        <p className='text-white w-[87%] text-[15px] not-italic font-normal leading-[22px]' >
          Are you sure you want to cancel creating the offer? This Action
          Cannot be undone, and the information will not be saved.
        </p>
        <div className='grid gap-x-[22px] grid-cols-2 mt-[26px]' >
          <button onClick={close} className='bg-[#34373C] text-white text-sm not-italic font-bold leading-[normal] cursor-pointer py-[15px] ' >
            Not Now
          </button>
          <button onClick={() => setActive(0)} className='bg-[#101116] text-white text-sm not-italic font-bold leading-[normal] cursor-pointer py-[15px]' >
            Cancel Create
          </button>
        </div>
      </div>
    </div>
  </>

}