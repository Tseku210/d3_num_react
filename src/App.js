import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import { createContext, useEffect, useState } from "react";
import Data from "./data/paper-journals.json";
import wosData from "./data/data.json";
import HomeLayout from "./components/homeLayout";
import { getTypes } from "./lib/filters";

export const DataContext = createContext({});

const registerWos = (data1, data2) => {
  let data = [];
  for (let i = 0; i < data1.length; i++) {
    for (let j = 0; j < data2.length; j++) {
      if (
        data1[i]["research_title"] === data2[j]["Өгүүллийн гарчиг"] &&
        data2[j]["Өгүүллийн гарчиг"] !== ""
      ) {
        data.push({ ...data1[i], wos: true });
      } else {
        data.push({ ...data1[i], wos: false });
      }
    }
  }
  return data;
};

function App() {
  // const [data, setData] = useState(registerWos(Data, wosData));
  const [data, setData] = useState(Data);
  const [type, setType] = useState("Байгалийн ухаан");

  const handleType = (type) => {
    setType(type);
  };

  /* FOR SEARCH AND NAVBAR */
  const types = getTypes(data);
  const [filteredData, setFilteredData] = useState(data);
  const [chosenVal, setChosenVal] = useState(null);

  const filterSearchDataOnTitle = (e, searchVal) => {
    e.preventDefault();
    if (searchVal === "") setFilteredData(data);
    setFilteredData(data.filter((d) => d["research_title"].match(searchVal)));
  };

  const handleSearchVal = (e) => {
    console.log("i'm called");
    e.preventDefault();
    setChosenVal(e.target.value);
  };

  const handleChoseVal = (val) => {
    setChosenVal(val);
  };

  return (
    <div>
      <DataContext.Provider value={data}>
        <Navbar
          handleType={handleType}
          types={types}
          filteredData={filteredData}
          filterSearchDataOnTitle={filterSearchDataOnTitle}
          handleSearchVal={handleSearchVal}
        />
        <HomeLayout
          type={type}
          chosenVal={chosenVal}
          handleChoseVal={handleChoseVal}
        />
      </DataContext.Provider>
    </div>
  );
}

export default App;
