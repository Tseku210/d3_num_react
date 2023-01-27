import css from "./style.module.css";

const Dropdown = ({ val, name, handleType }) => {
  return (
    <select
      name={name}
      className={css.dropdown}
      onChange={(e) => handleType(e.target.value)}>
      {val.map((item, i) => (
        <option val={item} key={i}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
