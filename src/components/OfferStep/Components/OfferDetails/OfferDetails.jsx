/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { RiBitCoinFill } from "react-icons/ri";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { BackModal } from "../BackModal/BackModal";
import Modal from "@mui/material/Modal";
import useOutsideDetector from "../../../dropdown";

import React, { useState, useRef, useEffect } from "react";
import { Fade, Zoom } from "@mui/material";
import { FaEthereum } from "react-icons/fa";

const Radio = ({ name, label, subLabel, fillType, setFillType, type }) => {
  return (
    <label
      className="inline-flex gap-x-[5px] items-center mt-[13px]"
      onClick={() => setFillType(type)}
    >
      <div
        className="relative flex items-center -mt-5   rounded-full cursor-pointer"
        htmlFor="html_version"
      >
        <input
          name={name}
          type="radio"
          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-white transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-white checked:before:bg-white hover:before:opacity-10"
          id="html_version"
        />
        <span className="absolute text-white atransition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[13px] w-[13px]"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
          </svg>
        </span>
      </div>
      <div
        className="mt-px font-light text-white cursor-pointer select-none"
        htmlFor="html_version"
      >
        <div>
          <p className="text-white text-xs not-italic font-normal leading-[normal]">
            {label}
          </p>
          <p className=" text-[rgba(255,255,255,0.50)] text-[10px] not-italic mt-[6px] font-normal leading-[normal]">
            {subLabel}
          </p>
        </div>
      </div>
    </label>
  );
};

import { useSelector } from "react-redux";
export const OfferDetails = ({
  OfferingTokenName,
  ForTokenName,
  setActive,
  submitAddress,
  // tokenName,
  // offerValue,
  setTokenAmountInput,
  setEthAmountInput,
  isAddressValid,
  offertoken,
  fortoken,
  setOffertoken,
  setFortoken,
  forTokenBalance,
  // setFillType,
}) => {
  const tokenMetadata = useSelector(
    (store) => store.OfferReducer.tokenMetadata
  );
  console.log(tokenMetadata);

  const odRef = useRef(null);
  const odRef_1 = useRef(null);
  const odRef_2 = useRef(null);
  const odRef_3 = useRef(null);

  const options = ["Option 1", "Option 2"];
  const [open, setOpen] = useState(false);
  const [selectTokenView, setSelectTokenView] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [ethAmount, setEthAmount] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [fillType, setFillType] = useState(0);
  const handleOpen = () => setSelectTokenView(true);
  const handleClose = () => setSelectTokenView(false);
  // const [value, setValue] = useState(options[0]);
  // const [inputValues, setInputValues] = useState("");
  const [orderDropState, setOrderDropState] = useState(false);
  const [orderDropState_1, setOrderDropState_1] = useState(false);
  // const [offerToken, setOfferToken] = useState("");
  // const [offerToken_1, setOfferToken_1] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [forValue, setForValue] = useState("");
  const [fortokenValue, setFortokenValue] = useState("");
  // const [offertoken, setOffertoken] = useState("");
  // const [fortoken, setFortoken] = useState("");
  const orderStyle =
    "absolute w-[20] top-0 left-0 mt-2 w-full text-center text-white bg-[#363A41] rounded-[5px] hidden transition-all ease-in-out delay-1000 select-none h-10 z-[10]";
  const orderActive =
    "absolute w-[20] top-[100%] mt-2 left-0 w-full text-center text-white rounded-[5px] block select-none z-[1000]";
  const handle1 = () => {
    setOrderDropState(false);
  };
  const handle2 = () => {
    setOrderDropState_1(false);
  };
  useOutsideDetector([odRef, odRef_1], handle1);
  useOutsideDetector([odRef_2, odRef_3], handle2);
  return (
    <div className="">
      <Modal
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
            Please select token.
          </div>
        </Zoom>
      </Modal>
      <div className=" mt-10 py-[11px] flex items-center  justify-between px-[19px] bg-[#1A1B1E] rounded-[4px]">
        <div>
          <p className="flex items-center gap-x-[5px]  text-white">
            OFFER <HiOutlineExclamationCircle className="text-[14px]" />
          </p>
          <input
            type="Number"
            placeholder="Enter Amount to offer"
            className="text-[rgba(255,255,255,0.50)] bg-transparent border-none  mt-[7px] text-base not-italic font-normal leading-[normal] focus:outline-none"
            onChange={(e) => {
              setTokenAmount(e.target.value);
              setTokenAmountInput(e.target.value);
            }}
            value={tokenAmount === 0 ? "" : tokenAmount}
          />
        </div>
        <div className="relative" ref={odRef}>
          <button
            className="flex cursor-pointer py-[7px] bg-[#101116] rounded-[6px] text-white px-[15px] justify-center items-center gap-x-[6px] w-40"
            onClick={() => setOrderDropState(!orderDropState)}
            // onClick={() => {
            //   handleOpen(true);
            // }}
          >
            {offertoken === "-" ? "Select a Token" : offertoken}
            {offertoken === "-" ? <MdKeyboardArrowDown /> : ""}
          </button>

          <div
            className={
              orderDropState
                ? orderActive + " bg-[#363A41]"
                : orderStyle + " bg-[#363A41]"
            }
            ref={odRef_1}
          >
            <input
              type="text"
              placeholder="Input Token Address"
              className="flex items-center  pt-5 md:px-4 h-[45px] md:h-[50px] border-b-2 rounded-[5px] text-white relative w-full transition duration-800 text-[14px] leading-[17px]  bg-inputback focus:outline-none hover:"
              onChange={(e) => {
                setInputValue(e.target.value);
                submitAddress(0, e.target.value);
              }}
              value={inputValue}
            />
            <div className="">
              {inputValue == "" ? (
                <div className="flex flex-wrap gap-2 items-center p-2">
                  <div
                    className="p-2 w-full border border-white rounded-md hover:cursor-pointer hover:bg-white hover:text-[#363A41] transition-all duration-200 flex justify-between px-5"
                    onClick={() => {
                      submitAddress(
                        0,
                        "0x0000000000000000000000000000000000000000"
                      );
                    }}
                  >
                    <FaEthereum className="w-[24px] h-[24px]" />
                    <span>ETH</span>
                  </div>
                  {Object.keys(tokenMetadata).map((item, id) => {
                    return (
                      <div
                        key={id}
                        className="p-2 w-full border border-white rounded-md hover:cursor-pointer hover:bg-white hover:text-[#363A41] transition-all duration-200 flex justify-between px-5"
                        onClick={() => {
                          setOffertoken(tokenMetadata[item].symbol);
                          submitAddress(0, item);
                        }}
                      >
                        <div className="w-[30px] h-[30px]">
                          <img
                            src={`/tokens/${item}.png`}
                            className="w-auto h-auto"
                          />
                        </div>
                        <span>{tokenMetadata[item].symbol}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-[21px] py-[11px] flex items-center justify-between px-[19px] bg-[#1A1B1E] rounded-[4px]">
        <div>
          <p className="flex items-center gap-x-[5px]  text-white">
            FOR <HiOutlineExclamationCircle className="text-[14px]" />
          </p>
          <input
            type="text"
            placeholder="0.0"
            className="text-[rgba(255,255,255,0.50)] bg-transparent border-none  mt-[7px] text-base not-italic font-normal leading-[normal] focus:outline-none"
            onChange={(e) => {
              setForValue(e.target.value);
              setEthAmountInput(e.target.value);
            }}
            value={forValue === 0 ? "" : forValue}
          />
        </div>
        <div className="flex flex-col  items-end">
          <p className="text-[rgba(255,255,255,0.50)] text-[10px] not-italic font-normal leading-[normal] pb-1">
            Ballance {forTokenBalance} &nbsp; {fortoken}
          </p>
          {fortokenValue == "" ? (
            <div className="relative" ref={odRef_2}>
              <button
                className="flex cursor-pointer py-[7px] bg-[#101116] rounded-[6px] text-white px-[15px] justify-center items-center gap-x-[6px] w-40"
                onClick={() => setOrderDropState_1(!orderDropState_1)}
              >
                {fortoken === "-" ? "Select a Token" : fortoken}
                {fortoken === "-" ? <MdKeyboardArrowDown /> : ""}
              </button>

              <div
                className={
                  orderDropState_1
                    ? orderActive + " bg-[#363A41]"
                    : orderStyle + " bg-[#363A41]"
                }
                ref={odRef_3}
              >
                <input
                  type="text"
                  placeholder="Input Token Address"
                  className="flex items-center  pt-5 md:px-4 h-[45px] md:h-[50px] border-b-2 rounded-[5px] text-white relative w-full transition duration-800 text-[14px] leading-[17px]  bg-inputback focus:outline-none hover:"
                  onChange={(e) => {
                    submitAddress(1, e.target.value);
                    setFortokenValue(e.target.value);
                  }}
                  value={fortokenValue ? fortokenValue : ""}
                />
                <div className="flex flex-wrap gap-2 items-center p-2">
                  <div
                    className="p-2 w-full border border-white rounded-md hover:cursor-pointer hover:bg-white hover:text-[#363A41] transition-all duration-200 flex justify-between px-5"
                    onClick={() => {
                      setFortoken("ETH");
                      submitAddress(
                        1,
                        "0x0000000000000000000000000000000000000000"
                      );
                    }}
                  >
                    <FaEthereum className="w-[24px] h-[24px]" />
                    <span>ETH</span>
                  </div>
                  {Object.keys(tokenMetadata).map((item, id) => {
                    return (
                      <div
                        key={id}
                        className="p-2 w-full border border-white rounded-md hover:cursor-pointer hover:bg-white hover:text-[#363A41] transition-all duration-200 flex justify-between px-5"
                        onClick={() => {
                          setFortoken(tokenMetadata[item].symbol);
                          submitAddress(1, item);
                        }}
                      >
                        <div className="w-[30px] h-[30px]">
                          <img
                            src={`/tokens/${item}.png`}
                            className="w-auto h-auto"
                          />
                        </div>
                        <span>{tokenMetadata[item].symbol}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="mt-[38px] mb-[13px]">
        <h3 className="text-white text-xs not-italic font-normal leading-[normal]">
          Fill Type
        </h3>
        <div className="flex flex-col">
          <Radio
            fillType={fillType}
            setFillType={setFillType}
            type={0}
            name={"fiill_type"}
            label="Partial Fill"
            subLabel="Multiple user can Contribute to Full fill the Offer "
          />
          <Radio
            fillType={fillType}
            setFillType={setFillType}
            type={1}
            name={"fiill_type"}
            label="Single Fill"
            subLabel="Entire offer must be filled by 1 user "
          />
          <Radio
            fillType={fillType}
            setFillType={setFillType}
            type={2}
            name={"fiill_type"}
            label="Privet Fill"
            subLabel="Entire offer must be filled by 1 user "
          />
        </div>
        <div className="grid gap-x-[22px] grid-cols-2 mt-[26px]">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#34373C] text-white text-sm not-italic font-bold leading-[normal] cursor-pointer py-[15px] hover:bg-white hover:text-black transition duration-200"
          >
            Back
          </button>
          <button
            onClick={() => {
              setActive((prev) => prev + 1);
              setTokenAmountInput(tokenAmount);
              setEthAmountInput(forValue);
              setForValue("");
              setTokenAmount("");
            }}
            className="bg-[#101116] text-white text-sm not-italic font-bold leading-[normal] cursor-pointer py-[15px] hover:bg-white hover:text-black transition duration-200"
          >
            Next
          </button>
        </div>
      </div>
      {open && <BackModal close={() => setOpen(false)} setActive={setActive} />}
    </div>
  );
};
