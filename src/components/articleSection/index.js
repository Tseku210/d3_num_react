import css from "./style.module.css";

const ArticleSection = ({ article }) => {
  return (
    <>
      {article ? (
        <div className={css.article}>
          <p className={css.articleTitle}>{article["research_title"]}</p>
          <hr />
          <p className={css.articleAbstract}>{article["abstract_mn"]}</p>
          <hr />
          <p className={css.articleDomain}>
            Domain: {article["research_type"]}
          </p>
        </div>
      ) : (
        <div>NOPE</div>
      )}
    </>
  );
};

export default ArticleSection;
