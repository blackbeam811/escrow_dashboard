import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateOffer from "./CreateOffer";
import Header from "./Layouts/header";
import Sidebar from "./Layouts/sidebar";
import Main from "./main";
import OfferDetails from "./offerDetails";
import { BuyOffer } from "../BuyOffer/BuyOffer";
import { OfferStep } from "../OfferStep/OfferStep";
import Profile from "../Profile";
import { useEffect, useState } from "react";
import { setOffer, setTokenMetadatas } from "../../redux/reducers/OfferReducer";
import EscrowServices from "../services/EscrowServices.js";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState("createOffer");
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [tokenMetadata, setTokenMetadata] = useState(null);

  const updateOffer = async (offerId) => {
    // Fetch the data for the offer with offerId here
    // This should be replaced with your actual data fetching logic
    const [updateOfferId, updateOffer] = await EscrowServices.readOffer(
      offerId
    );
    const updatedOffer = { ...updateOffer, id: updateOfferId };

    setSelectedOffer(updatedOffer);
  };
  const handleShowDetails = (offer, tokenMetadata) => {
    setSelectedOffer(offer);
    setTokenMetadata(tokenMetadata);
    setShowOfferDetails(true);
  };

  return (
    <BrowserRouter>
      <div className="w-full bg-black relative">
        <div className=" absolute top-20 right-10 w-28 h-28 rounded-[999px] border-[16px] border-gray blur-md z-10 opacity-30"></div>
        <Header />
        <div className="flex">
          <Sidebar />
          <div
            className="bg-cg h-[calc(100vh-103px)] w-full flex flex-col items-center mt-[103px] ml-[257px] py-5 px-5 overflow-auto"
            id="scrollbar"
          >
            <Routes>
              <Route path="/createOffer" element={<CreateOffer />} />
              <Route path="/offerDetails" element={<OfferDetails />} />
              <Route
                path="/"
                element={<Main handleShowDetails={handleShowDetails} />}
              />
              {showOfferDetails && (
                <Route
                  path="/buy-offer"
                  element={
                    <BuyOffer
                      offer={selectedOffer}
                      tokenMetadata={tokenMetadata}
                      updateOffer={updateOffer}
                    />
                  }
                />
              )}
              <Route path="/offer-step" element={<OfferStep />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Dashboard;
