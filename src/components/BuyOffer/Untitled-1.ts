// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import CreateOffer from "./CreateOffer";
// import Header from "./Layouts/header";
// import Sidebar from "./Layouts/sidebar";
// import Main from "./main";
// import OfferDetails from "./offerDetails";
// import { BuyOffer } from "../BuyOffer/BuyOffer";
// import { OfferStep } from "../OfferStep/OfferStep";
// import Profile from "../Profile";
// import { useEffect, useState } from "react";
// import { setTokenMetadatas } from "../../redux/reducers/OfferReducer";

// function Dashboard() {
//   const [detailData, setDetailData] = useState(null);
//   const [tokenMetadata, setTokenMetadata] = useState(null);
//   const [offerdata, setOfferdata] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [data, setData] = useState({});
//   const [newLoadedTokens, setnewLoadedTokens] = useState({});
//   localStorage.setItem("offers", JSON.stringify([]));
//   localStorage.setItem("tokenMetadatas", JSON.stringify([]));
//   localStorage.setItem("newLoadedTokens", JSON.stringify([]));
//   const handleShowDetails = (data, offer, tokenMetadata) => {
//     const jsonString = JSON.stringify(offer, (key, value) => {
//       if (typeof value === "bigint") {
//         return value.toString();
//       }
//       return value;
//     });
//     localStorage.setItem("offer", jsonString);
//     const jsonString_1 = JSON.stringify(data, (key, value) => {
//       if (typeof value === "bigint") {
//         return value.toString();
//       }
//       return value;
//     });
//     localStorage.setItem("data", jsonString_1);
//     const jsonString_2 = JSON.stringify(tokenMetadata, (key, value) => {
//       if (typeof value === "bigint") {
//         return value.toString();
//       }
//       return value;
//     });
//     localStorage.setItem("tokenMetadata", jsonString_2);
//     console.log(offer);
//     console.log(data);
//     console.log(tokenMetadata);
//     setDetailData(offer);
//     setData(data);
//     setTokenMetadata(tokenMetadata);
//   };
//   return (
//     <BrowserRouter>
//       <div className="w-full bg-black">
//         <Header />
//         <div className="flex">
//           <Sidebar />
//           <div
//             className="bg-[#101116] w-full flex flex-col items-center mt-[103px] ml-[257px] py-5 px-5"
//             id="scrollbar"
//           >
//             <Routes>
//               <Route path="/createOffer" element={<CreateOffer />} />
//               <Route path="/offerDetails" element={<OfferDetails />} />
//               <Route
//                 path="/"
//                 element={<Main handleShowDetails={handleShowDetails} />}
//               />
//               <Route
//                 path="/buy-offer"
//                 element={
//                   <BuyOffer
//                     data={data}
//                     offer={detailData}
//                     tokenMetadata={tokenMetadata}
//                   />
//                 }
//               />
//               <Route path="/offer-step" element={<OfferStep />} />
//               <Route path="/profile" element={<Profile />} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default Dashboard;
