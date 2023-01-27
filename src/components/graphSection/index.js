import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DataContext } from "../../App";
import css from "./style.module.css";
import { filterType } from "../../lib/filters";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { useD3 } from "../../hooks/useD3";
import { truncate } from "../../lib/utils";

const calculateGraph = (data) => {
  const links = [];
  const obj = {};

  const nodes = data.map((item) => ({
    ...item,
    size: 0,
    color: "pink",
  }));

  // linking logic
  nodes.forEach((d, i) => {
    const el = d["journal_id"];
    if (d.wos) {
      console.log("wos founddddd", d);
    }
    if (!obj.hasOwnProperty(el)) {
      obj[el] = [d];
    } else {
      obj[el].push(d);
    }
  });
  // color management
  const clrs = d3.schemeTableau10;
  const color = d3.scaleOrdinal(Array.from(obj), clrs);

  nodes.forEach((d) => {
    d.size = obj[d["journal_id"]].length;
    d.color = color(d.size);
  });

  for (let key in obj) {
    for (let i = 1; i < obj[key].length; i++) {
      links.push({
        source: obj[key][0],
        target: obj[key][i],
        id: `${obj[key][0]["research_id"]}-${obj[key][i]["research_id"]}`,
      });
    }
  }
  return { nodes, links };
};

const setMouseover = (node, func) => {
  node.on("mouseover", (e) => {
    const article = d3.select(e.target.parentNode).datum();
    const journalId = article["journal_id"];

    func(article);

    d3.selectAll("g").attr("opacity", 0.1);

    d3.selectAll("g")
      .filter((d) => d["journal_id"] === journalId)
      .attr("opacity", 0.5);

    d3.select(e.target.parentNode)
      .attr("opacity", 1)
      .select("text")
      .classed(css.hideText, false)
      .classed(css.showText, true);
  });
};

const setMouseout = (node) => {
  node.on("mouseout", (e) => {
    d3.selectAll("g").attr("opacity", 1);
    d3.select(e.target.parentNode)
      .select("text")
      .classed(css.hideText, true)
      .classed(css.showText, false);
  });
};

const SVG = ({ data, filterBy, width, height, handleArticle }) => {
  const filteredData = filterType(data, filterBy);
  // to fix bug
  let lastNode = null;

  let click = false;
  const ref = useD3(
    (svg) => {
      const graph = calculateGraph(filteredData);
      const link = svg
        .selectAll(".link")
        .data(graph.links, (d) => d.id)
        .join("line")
        .classed("link", true)
        .attr("stroke", "#ccc")
        .attr("opacity", 0.2);

      const node = svg
        .selectAll("g")
        .data(graph.nodes, (d) => d)
        .join("g")
        .attr("cursor", "pointer");

      node
        .append("circle")
        .attr("r", 5)
        .attr(
          "transform",
          (d) => `scale(${Math.log(d.size) === 0 ? 1 : Math.log(d.size)})`
        )
        .attr("fill", (d) => d.color)
        .attr("stroke", (d) => (d.wos ? "yellow" : "black"))
        .attr("stroke-width", 0.5);

      if (!click) {
        setMouseover(node, handleArticle);
        setMouseout(node);
      }

      // mouse event handling
      node.on("click", (e) => {
        const el = d3.select(e.target.parentNode);
        const article = el.datum();
        const journalId = article["journal_id"];

        handleArticle(article);

        d3.selectAll("g").attr("opacity", 0.1);

        d3.selectAll("g")
          .filter((d) => d["journal_id"] === journalId)
          .attr("opacity", 0.5);

        d3.select(e.target.parentNode)
          .attr("opacity", 1)
          .select("text")
          .classed(css.hideText, false)
          .classed(css.showText, true);
        if (!click) {
          // remove event listeners
          click = true;
          node.on("mouseover", null);
          node.on("mouseout", null);
        } else {
          click = false;
          setMouseover(node, handleArticle);
          setMouseout(node);
          // bug fix (temporary)
          lastNode &&
            lastNode
              .select("text")
              .classed(css.hideText, true)
              .classed(css.showText, false);
        }
        // set last node (to fix bug)
        lastNode = el;
      });

      node
        .append("text")
        .attr("text-anchor", "end")
        .attr("dy", ".35em")
        .attr("dx", "-1em")
        .attr("fill", (d) => d.color)
        .style("font-size", "1em")
        .style("user-select", "none")
        .style("font-weight", "bold")
        .classed(css.hideText, true)
        .classed(css.showText, false)
        .text((d) => truncate(d["research_title"], 30));

      //simulation
      const simulation = d3
        .forceSimulation(graph.nodes)
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d["research_id"])
            .links(graph.links)
            .distance(100)
        )
        .force("charge", d3.forceManyBody().strength(-300).distanceMax(30))
        .force(
          "collide",
          d3.forceCollide((d) =>
            Math.log(d.size) === 0 ? 5 : 5 * Math.log(d.size)
          )
        )
        .force("center", d3.forceCenter(width / 2, height / 2)) // should be dynamic
        .alpha(0.5)
        .alphaTarget(0)
        .on("tick", () => {
          const calcX = (d) => {
            return (d.x = Math.max(
              Math.log(d.size) === 0 ? 5 : 5 * Math.log(d.size),
              Math.min(
                width - (Math.log(d.size) === 0 ? 5 : 5 * Math.log(d.size)),
                d.x
              )
            ));
          };
          const calcY = (d) => {
            return (d.y = Math.max(
              Math.log(d.size) === 0 ? 5 : 5 * Math.log(d.size),
              Math.min(
                height - (Math.log(d.size) === 0 ? 5 : 5 * Math.log(d.size)),
                d.y
              )
            ));
          };
          link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

          node.attr("transform", (d) => `translate(${calcX(d)}, ${calcY(d)})`);
        });
    },
    [filterBy]
  );

  return <svg width={width} height={height} ref={ref}></svg>;
};

const GraphSection = ({ width, height, type, handleArticle }) => {
  const data = useContext(DataContext);
  const [clicked, setClicked] = useState(false);

  return (
    <div className={css.graphSection}>
      <div>
        <p>{type}</p>
      </div>
      <div className={css.graph}>
        <SVG
          clicked={clicked}
          setClicked={setClicked}
          data={data}
          filterBy={type}
          width={width}
          height={height}
          handleArticle={handleArticle}
        />
      </div>
    </div>
  );
};

/*
Компьютер, мэдээллийн шинжлэх ухаан
Байгалийн ухаан
Биологийн шинжлэх ухаан (Эрүүл мэнд 3 бүтэгт, ХАА- 4 бүлэгт)
Математик
"Физикийн шинжлэх ухаан"
"Химийн шинжлэх ухаан"
"Газарзүй, геологи, хүрээлэн буй орчны шинжлэх ухаан"
"Бусад байгалийн ухаан"
"Инженерийн ухаан, технологи"
"Цахилгааны инженерчлэл, электроникийн инженерчлэл, мэдээллийн инженерчлэл"
*/

export default GraphSection;
