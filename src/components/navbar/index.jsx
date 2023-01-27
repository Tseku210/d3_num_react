import css from "./style.module.css";
import Dropdown from "../dropdown";
import Searchbar from "../searchbar";

const Navbar = ({
  handleType,
  types,
  filteredData,
  filterSearchDataOnTitle,
  handleSearchVal,
}) => {
  return (
    <div className={css.navbar}>
      <div>Logo</div>
      <Dropdown val={types} name="Төрлөө сонгох" handleType={handleType} />
      <Searchbar
        filterData={filterSearchDataOnTitle}
        filteredData={filteredData}
        handleSearchVal={handleSearchVal}
      />
    </div>
  );
};

export default Navbar;
