/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./card.css";
import eth from "../../../assets/imgs/virtual.png";
import { FiArrowRightCircle } from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import OfferReducer, {
  setData,
  setOffer,
  setTokenMetadata,
} from "../../../redux/reducers/OfferReducer";
import { CircularProgress, Skeleton } from "@mui/material";

const Card = ({ isOwner, data, submit }) => {
  const dispatch = useDispatch();
  const handleSubmit = () => {
    // if (isOwner === 1) return alert("This is your offer!");
  };

  const tpclsName =
    isOwner === 1 ? " border-2 border-green-700 box-shadow" : "";
  return (
    <div
      className={
        "w-full h-auto bg-tranaparent rounded-[5px] transition duration-300 border-[1px] border-gray-400" +
        tpclsName
      }
    >
      <div className="w-full ">
        <div className="flex items-center justify-between w-full py-3 px-7 space-x-2.5">
          <div className="flex justify-start text-[#EFEFEF] drop-shadow-cs flex-1 w-0">
            <div className="w-[45px] h-[45px]">
              <img
                src={`/tokens/${data.nonEthAddress}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/tokens/default.png";
                }}
                alt="Token Icon"
                className="w-auto h-auto"
              />
            </div>
            <div className="pl-3 flex flex-col justify-center w-full">
              <div className="flex justify-start space-x-3 items-start w-full">
                <div className="text-md truncate">
                  {data.token[0] !== "0" && data.token[1] !== "x" ? (
                    data.token
                  ) : (
                    <Skeleton variant="text" sx={{ width: 100 }} />
                  )}
                </div>
                <div className="text-xs mt-1">#{data.offerId}</div>
              </div>
              <div className="text-[10px] text-blue-700">PARTIAL FILL</div>
            </div>
          </div>
          <div className="w-9 h-9">
            <CircularProgressbar
              value={10}
              text={`${10}`}
              styles={buildStyles({
                textSize: "36px",
                textColor: "white",
                trailColor: "black",
              })}
            />
          </div>
        </div>
        <div className="w-full h-0.5 bg-black px-7"></div>
        <div className="relative">
          <div className="flex justify-between px-5 space-x-2.5 py-7">
            <div className="flex-[3] w-0 text-md max-w-full">
              <div className="text-[#808080]">Offering</div>
              <div className="text-white text-2ops flex space-x-1 mt-0.5">
                <div className="truncate">{data.offering}</div>
                <div className="w-[24px] min-w-6 h-[30px]">
                  <img src={eth} alt="token.png" className="w-[22px] "></img>
                </div>
              </div>
              <div className="text-[#808080] mt-0.5">Price / Token</div>
              <div className="text-white text-2ops flex space-x-1 mt-0.5">
                <div>{data.pricePerToken}</div>
              </div>
            </div>
            <div className="flex-1 w-0 text-md">
              <div className="text-[#808080]">For</div>
              <div className="text-white text-2ops flex space-x-1 mt-0.5">
                <div className="truncate">{data.forOffer}</div>
                <div className="w-[24px] min-w-6 h-[30px]">
                  <img
                    src={`/tokens/${data.nonEthAddress}.png`}
                    alt="Token Icon"
                    className="w-auto h-auto"
                  />
                </div>
              </div>
              <div className="text-[#808080] mt-0.5">Created</div>
              <div className="text-white text-2ops flex space-x-1 mt-0.5">
                <div className="truncate">1h ago</div>
              </div>
            </div>
          </div>
          <FiArrowRightCircle className="w-7 h-auto text-blue-700 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
        </div>
      </div>
      <div className="flex w-full text-[#efefef] border-t-2 border-black">
        <Link
          className="w-1/2 bg-[#0271e4] flex justify-center items-center px-6 py-4 font-medium rounded-bl-md hover:cursor-pointer border-r-[1px] border-black hover:bg-gray-300 hover:text-[#0271e4] transition duration-200"
          to="#"
        >
          Take Offer
        </Link>
        <Link
          className="w-1/2 bg-[#6C757D] flex justify-center items-center px-6 py-4 font-medium rounded-br-md  hover:cursor-pointer hover:bg-gray-300 hover:text-[#6c757d] transition duration-200 disabled:cursor-not-allowed"
          onClick={() => data.token[1] !== "x" && submit()}
          to={data.token[1] !== "x" ? "/buy-offer" : "/"}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
