import { useState } from "react";
import css from "./style.module.css";

const Searchbar = ({ filteredData, filterData, handleSearchVal }) => {
  const [show, setShow] = useState(false);

  const showList = () => {
    setShow(true);
  };
  const hideList = () => {
    setShow(false);
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Өгүүлэл хайх"
        onChange={(e) => filterData(e, e.target.value)}
        onFocus={showList}
        onBlur={hideList}
      />
      <div onClick={(e) => console.log("hello")} style={{ color: "blue" }}>
        {" "}
        hello{" "}
      </div>
      {show ? (
        <ul className={css.searchList} onClick={(e) => console.log("hello")}>
          {Array.from(filteredData).map((d, i) => (
            <li key={i} onClick={(e) => console.log("hello")}>
              {d["research_title"]}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default Searchbar;
