/* eslint-disable react/prop-types */
const AboutElement = ({ title, description }) => {
  return (
    <div className="flex justify-between">
      <p className="text-white text-md not-italic font-normal leading-[normal]">
        {title}
      </p>
      <p className="text-[#808080] text-md not-italic font-normal leading-[normal]">
        {description}
      </p>
    </div>
  );
};
export const About = () => {
  return (
    <div className="flex  flex-col gap-y-[21px]">
      <AboutElement
        title={"Remaining Tokens:"}
        description={"60,000,000.00 M7"}
      />
      <AboutElement title={"Offer ID:"} description={"1"} />
      <AboutElement title={"Creator:"} description={"Oxe369fe...f339f03a"} />
      <AboutElement
        title={"Offer Price/Token:"}
        description={"0.0006633 ETH"}
      />
      <AboutElement
        title={"Market Price/Token:"}
        description={"0.0006633 ETH"}
      />
      <AboutElement
        title={"Price Difference:"}
        description={"10% ABOVEMARKET"}
      />
      <AboutElement title={"Minimum Fill:"} description={"1M7"} />
    </div>
  );
};
