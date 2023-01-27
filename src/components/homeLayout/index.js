import { useLayoutEffect, useRef, useState } from "react";
import ArticleSection from "../articleSection";
import GraphSection from "../graphSection";
import css from "./style.module.css";

const HomeLayout = ({ type, chosenVal, handleChosenVal }) => {
  const [article, setArticle] = useState(chosenVal ? chosenVal : null);
  const width = 1000;
  const height = Math.max(window.innerHeight, 700);

  const handleArticle = (article) => {
    setArticle(article);
  };

  return (
    <div className={css.homeLayout}>
      <ArticleSection article={article} />
      <GraphSection
        type={type}
        width={width}
        height={height}
        handleArticle={handleArticle}
      />
      <div>easy access</div>
    </div>
  );
};

export default HomeLayout;
