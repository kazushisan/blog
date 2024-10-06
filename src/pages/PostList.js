// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Head from "../components/Head.bs.js";
import * as Lazy from "../hooks/Lazy.bs.js";
import * as Link from "../components/Link.bs.js";
import * as React from "react";
import * as PostMeta from "../components/PostMeta.bs.js";

function PostList(props) {
  var postList = Lazy.useLazyPostList(undefined);
  return React.createElement("div", {
              className: "xl:flex xl:justify-center"
            }, React.createElement(Head.make, {
                  title: "gadgetlunatic",
                  path: ""
                }), React.createElement("div", {
                  className: "container md:mx-auto xl:mx-0 max-w-4xl flex-1 min-w-0"
                }, React.createElement("div", {
                      className: "px-4"
                    }, postList.map(function (post) {
                          return React.createElement("div", {
                                      key: post.path,
                                      className: "mt-8 pt-8 first-of-type:border-t-0 border-t border-slate-100"
                                    }, React.createElement(Link.make, {
                                          children: React.createElement("h1", {
                                                className: "font-bold text-xl mb-4"
                                              }, post.title),
                                          to: post.path
                                        }), React.createElement(PostMeta.make, {
                                          date: post.date,
                                          permalink: post.permalink,
                                          modifiedDate: post.modifiedDate,
                                          hash: post.hash
                                        }));
                        }))));
}

var make = PostList;

export {
  make ,
}
/* Head Not a pure module */
