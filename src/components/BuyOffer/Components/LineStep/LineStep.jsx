import React from "react";
export const LineStep = () => {
  const style1 =
    "w-[18.22px] h-[18.22px] rounded-[999px] bg-[#48484d] flex justify-center items-center";
  const style2 =
    "w-[18.22px] h-[18.22px] rounded-[999px] bg-[#00e641] flex justify-center items-center";
  return (
    <>
      <div className="flex justify-between items-center w-full">
        {new Array(5).fill(0).map((_, i) => {
          return (
            <React.Fragment key={i}>
              {i < 3 ? (
                <>
                  {i === 0 ? (
                    ""
                  ) : (
                    <div className="h-[2px] w-[19%] bg-[#00e641]" />
                  )}
                  <div key={i} className={style2}></div>
                </>
              ) : (
                <>
                  <div className="h-[2px] w-[19%] bg-[#48484d]" />
                  <div key={i} className={style1}>
                    <div className="bg-[#272a2f] w-[14px] h-[14px] rounded-full"></div>
                  </div>
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex  justify-between mt-[9px]">
        {["0%", "25%", "50%", "75%", "100%"].map((procent, i) => {
          return (
            <p
              key={i}
              className="text-[#9B9DA0] text-[10px] not-italic font-normal leading-[normal]"
            >
              {procent}
            </p>
          );
        })}
      </div>
    </>
  );
};
