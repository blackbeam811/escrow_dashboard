const CreateOfferCard = (props) => {
  // eslint-disable-next-line react/prop-types
  const { img, title, content, active } = props;

  const style =
    "flex flex-col items-center text-white px-8 py-5 border-[0.5px] border-[#969696] rounded-md bg-[#1A1B1E] ";
  const tmp = active === 0 ? "opacity-50" : "";
  return (
    <div className={style + tmp}>
      <img src={img} alt={img} className="w-10 h-9" />
      <div className="text-md font-semibold text-center mt-1.5">{title}</div>
      <div className="text-xs text-center mt-2">{content}</div>
    </div>
  );
};

export default CreateOfferCard;
