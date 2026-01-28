import React from "react";

const ProductDetails = ({ type, title, brand }) => {
  return (
    <div className=" pt-5 space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wide">
        {type}
      </h3>
      <h3 className="text-sm font-bold text-white uppercase tracking-wide">
        {title}
      </h3>
      <h3 className="text-sm  text-white uppercase tracking-wide">
        {brand}
      </h3>

      {/* <div className="space-y-3 text-sm">
        {details.map((detail, idx) => (
          <div key={idx} className="flex">
            <span className="text-gray-600 w-32 flex-shrink-0">
              {detail.label}:
            </span>
            <span className="text-gray-900 font-medium">{detail.value}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default ProductDetails;
