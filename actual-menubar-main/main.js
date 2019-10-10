const path = require("path");
const { menubar } = require("menubar");
const { app } = require("electron");
const actual = require("@actual-app/api");
const WebSocket = require("ws");

let mb;
const wss = new WebSocket.Server({ port: 1040 });

const BUDGET_ID = "---Herringfam";

app.on("ready", async () => {
  // @TODO make configurable or selectable in app
  await actual.init();
  await actual.loadBudget(BUDGET_ID);
  // @TODO icon
  mb = menubar({
    index: "http://localhost:3000",
    tooltip: "Actual",
    fullscreenable: false,
    resizable: false,
    icon: path.resolve(__dirname, "icon.png"),
    height: 368
  });

  wss.on("connection", function(w) {
    w.on("message", async function(req) {
      const msg = JSON.parse(req);
      if (actual.hasOwnProperty(msg.func)) {
        const func = actual[msg.func];
        try {
          const data = await func(...msg.params);
          w.send(JSON.stringify({ type: msg.func, data }));
        } catch (error) {
          w.send(JSON.stringify({ type: msg.func, error }));
        }
      } else {
        w.send(
          JSON.stringify({
            type: msg.func,
            error: `Unknown function ${msg.func}.`
          })
        );
      }
    });
    w.on("close", function() {
      console.log("Closed");
    });
  });
});

app.on("window-all-closed", e => {
  app.dock.hide();
  e.preventDefault();
});
