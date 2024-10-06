// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "rescript/lib/es6/curry.js";
import * as React from "react";
import * as RescriptReactRouter from "@rescript/react/src/RescriptReactRouter.bs.js";
var track = function track() {
  if (window.location.host === 'gadgetlunatic.com') {
    gtag('event', 'page_view');
  } else {
    console.log('page_view');
  }
};
var context = React.createContext(RescriptReactRouter.dangerouslyGetInitialUrl(undefined, undefined));
var make = context.Provider;
var ContextProvider = {
  make: make
};
function Router$Provider(props) {
  var url = RescriptReactRouter.dangerouslyGetInitialUrl(props.serverUrlString, undefined);
  return <make value={url} children={props.children} />;
}
var Provider = {
  make: Router$Provider
};
function urlNotEqual(a, b) {
  if (a.hash !== b.hash || a.search !== b.search) {
    return true;
  } else {
    var _aList = a.path;
    var _bList = b.path;
    while (true) {
      var bList = _bList;
      var aList = _aList;
      if (!aList) {
        if (bList) {
          return true;
        } else {
          return false;
        }
      }
      if (!bList) {
        return true;
      }
      if (aList.hd !== bList.hd) {
        return true;
      }
      _bList = bList.tl;
      _aList = aList.tl;
      continue;
    }
    ;
  }
}
function useUrl(param) {
  var serverUrl = React.useContext(context);
  var match = React.useState(function () {
    return serverUrl;
  });
  var setUrl = match[1];
  var url = match[0];
  var done = React.useRef(false);
  React.useEffect(function () {
    if (done.current) {} else {
      Curry._1(track, undefined);
      done.current = true;
    }
    var watcherId = RescriptReactRouter.watchUrl(function (url) {
      React.startTransition(function () {
        Curry._1(setUrl, function (param) {
          return url;
        });
        return Curry._1(track, undefined);
      });
    });
    var newUrl = RescriptReactRouter.dangerouslyGetInitialUrl(undefined, undefined);
    if (urlNotEqual(newUrl, url)) {
      React.startTransition(function () {
        return Curry._1(setUrl, function (param) {
          return newUrl;
        });
      });
    }
    return function (param) {
      RescriptReactRouter.unwatchUrl(watcherId);
    };
  }, []);
  return url;
}
var push = RescriptReactRouter.push;
export { track, context, ContextProvider, Provider, urlNotEqual, useUrl, push };
/* context Not a pure module */