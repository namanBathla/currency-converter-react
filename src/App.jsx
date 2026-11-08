import React, { useEffect, useState } from "react";
import { IoMdSwap } from "react-icons/io";
import Selector from "./Components/Selector";

function App() {
  // give the 3 letter country codes
  // https://restcurrencies.com/v3.1/all?fields=cca3

  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setfromCurrency] = useState("USD");
  const [toCurrency, settoCurrency] = useState("INR");
  const [amount, setAmount] = useState(100);
  const [convertedAmount, setConvertedAmount] = useState(' ');
  const [isLoading, setIsLoading] = useState(false);


  // fetching currencies from frankfurter api, also same for conversion
  useEffect(() => {
    fetch("https://api.frankfurter.dev/v1/currencies")
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(Object.keys(data));
        // console.log(data);
      })
  }, [])

  // added debouncing effect to reduce API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (amount > 0 && fromCurrency !== toCurrency) {
        convert();
      }
    }, 500); // 500ms debounce
    
    // convert();
    return () => clearTimeout(debounceTimer); // cleanup on change
  }, [amount, fromCurrency, toCurrency]);


  const swapcurrencies = () => {
    setfromCurrency(toCurrency);
    settoCurrency(fromCurrency);
  };

  const isLocal = window.location.hostname === 'localhost';

// Use local proxy for development, direct API for production
  const API_URL = '/api-frankfurter';

  const convert = () => {
    setIsLoading(true);         // start loading
    // https://api.frankfurter.app/latest?from=USD&to=INR
    const url = `${API_URL}/v2/rates?base=${fromCurrency}&quotes=${toCurrency}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rate = data[0].rate;
        const convertedAmount = (amount * rate).toFixed(2);
        console.log(rate);
        setConvertedAmount(convertedAmount);
      })
      .catch((err) => {
        console.log("Conversion Error: " + err);
        setConvertedAmount("Error");
      })
      .finally(() => {
        setIsLoading(false);    // stop loading
      })
  };

  return (
    <>
      <div className="container flex flex-col items-center gap-7 px-10 pt-10 pb-14 rounded-md dark:bg-slate-900">
        <div className="title font-bold text-3xl">Currency Converter</div>

        <div className="amount-container flex flex-col gap-1">
          <div className="amount-title">Enter Amount</div>
          <input
            type="number"
            name=""
            id=""
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              // setConvertedAmount(' ');
            }}
            className="rounded p-4 h-5 w-full bg-slate-800 appearance-none outline-none"
          />
        </div>

        <div className="selector-box w-full flex justify-between gap-4 items-center">
          <Selector
            type="From"
            currencies={currencies}
            selected={fromCurrency}
            setSelected={setfromCurrency}
          ></Selector>

          {/* Add the swap icon here */}
          <IoMdSwap
            className="mt-6 rounded-full w-10 h-10 p-2 bg-slate-800 cursor-pointer"
            onClick={swapcurrencies}
          />

          <Selector
            type="To"
            currencies={currencies}
            selected={toCurrency}
            setSelected={settoCurrency}
          ></Selector>
        </div>

        <button className="p-3 rounded-md bg-green-500 text-white "
          onClick={convert}
          disabled={(amount <= 0 || fromCurrency == toCurrency)}
        >
          Get Exchange Rate
        </button>

        <div className="converted bg-slate-800 w-full text-center p-2 rounded">
          {isLoading ? (<span>Loading...</span>) :
            (convertedAmount === ' '
              ? 'Select currencies to convert'
              : `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`
            )}
        </div>
      </div>
    </>
  );
}

export default App;
