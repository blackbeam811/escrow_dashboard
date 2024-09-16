import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  offers: {},
  offer: {},
  data: {},
  tokenMetadata: {},
  tokenMetadata: {},
  loadedTokens: {},
};

export const OfferReducer = createSlice({
  name: "Offer",
  initialState,
  reducers: {
    setOffers: (state, action) => {
      // state.offers = action.payload.offers;
      return {
        ...state,
        offers: action.payload.offers,
      };
    },
    setTokenMetadatas: (state, action) => {
      state.tokenMetadata = action.payload.tokenMetadatas;
    },
    setLoadedTokens: (state, action) => {
      state.loadedTokens = action.payload.newloadedTokens;
    },
    setTokenMetadata: (state, action) => {
      state.tokenMetadata = action.payload.tokenMetadata;
    },
    setData: (state, action) => {
      state.data = action.payload.data;
    },
    setOffer: (state, action) => {
      state.offer = action.payload.offer;
    },
  },
});

export const {
  setOffers,
  setTokenMetadatas,
  setLoadedTokens,
  setTokenMetadata,
  setData,
  setOffer,
} = OfferReducer.actions;

export default OfferReducer.reducer;
