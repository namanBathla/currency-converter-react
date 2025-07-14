import React from "react";

const Selector = ({ type, selected, currencies, setSelected }) => {
  return (
    <div className="from-container flex flex-col gap-1">
      <div className="from-title">{type}</div>
      <div className="options flex gap-1 rounded-md bg-slate-800 text-white px-2 py-1">
        <img className="flag-img"
      src={`https://flagsapi.com/${selected.substr(0,2)}/flat/32.png`} 
alt="" />
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="p-1 rounded bg-transparent outline-none"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}
          className="text-black outline-none">
            {currency}
          </option>
        ))}
      </select>
      </div>
      
    </div>
  );
};

export default Selector;
