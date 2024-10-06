// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "rescript/lib/es6/curry.js";
import * as React from "react";
import * as $$Element from "../interop/Element.bs.js";
import * as $$Document from "../interop/Document.bs.js";
import * as Caml_array from "rescript/lib/es6/caml_array.js";
import * as Belt_Option from "rescript/lib/es6/belt_Option.js";
import * as Caml_option from "rescript/lib/es6/caml_option.js";
function getPosition(element) {
  var sibling = Belt_Option.mapWithDefault($$Element.parentElement(element), undefined, $$Element.previousElementSibling);
  return Belt_Option.getWithDefault(sibling, element).getBoundingClientRect().bottom;
}
function getHeadingElements(headings) {
  var selector = headings.map(function (heading) {
    return "#" + heading.id + "";
  }).join(",");
  return Array.from(document.querySelectorAll(selector));
}
function useTableOfContentsActiveItem(headings) {
  var match = React.useState(function () {});
  var setActiveId = match[1];
  var activeId = match[0];
  React.useEffect(function () {
    var match = headings.length;
    if (match === 0) {
      return function (param) {};
    }
    var observer = new IntersectionObserver(function (param) {
      var headingElements = getHeadingElements(headings);
      if (headingElements.length <= 0) {
        return;
      }
      var target = headingElements.reduce(function (acc, cur) {
        var position = getPosition(cur);
        if (position > 0 || acc.position > position) {
          return acc;
        } else {
          return {
            position: position,
            id: cur.id
          };
        }
      }, {
        position: getPosition(Caml_array.get(headingElements, 0)),
        id: Caml_array.get(headingElements, 0).id
      });
      if (activeId !== target.id) {
        return Curry._1(setActiveId, function (param) {
          return target.id;
        });
      }
    });
    headings.forEach(function (param) {
      var element = $$Document.getElementById(document, "" + param.id + "");
      var sibling = Belt_Option.mapWithDefault(Belt_Option.mapWithDefault(element, undefined, $$Element.parentElement), undefined, $$Element.previousElementSibling);
      if (sibling !== undefined) {
        observer.observe(Caml_option.valFromOption(sibling));
        return;
      } else if (element !== undefined) {
        observer.observe(Caml_option.valFromOption(element));
        return;
      } else {
        return;
      }
    });
    return function (param) {
      observer.disconnect();
    };
  }, [headings]);
  return activeId;
}
function TableOfContents(props) {
  var headings = props.headings;
  var activeId = useTableOfContentsActiveItem(headings);
  return <ul>{headings.filter(function (heading) {
      if (heading.depth === 2) {
        return true;
      } else {
        return heading.depth === 3;
      }
    }).map(function (heading) {
      var match = heading.depth;
      var match$1 = heading.id === activeId;
      return <li key={heading.id} className={"list-none px-2 py-1 my-1 block text-sm " + (match !== 2 ? match$1 ? "bg-blue-100 text-blue-500 rounded ml-2 font-bold" : "text-slate-700 ml-2" : match$1 ? "bg-blue-100 text-blue-500 rounded font-bold" : "text-slate-700") + ""}><a href={"#" + heading.id + ""}>{heading.value}</a></li>;
    })}</ul>;
}
var make = TableOfContents;
export { getPosition, getHeadingElements, useTableOfContentsActiveItem, make };
/* react Not a pure module */