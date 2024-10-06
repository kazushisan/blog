// Generated by ReScript, PLEASE EDIT WITH CARE

import * as App from "./App.bs.js";
import * as React from "react";
import * as Router from "./hooks/Router.bs.js";
import * as ReactHelmetAsync from "react-helmet-async";

function EntryServer(props) {
  return React.createElement(React.StrictMode, {
              children: React.createElement(ReactHelmetAsync.HelmetProvider, {
                    children: React.createElement(Router.Provider.make, {
                          children: React.createElement(App.make, {}),
                          serverUrlString: props.serverUrlString
                        }),
                    context: props.context
                  })
            });
}

var make = EntryServer;

export {
  make ,
}
/* App Not a pure module */
