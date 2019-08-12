import React from "react";
import "./App.css";

class Actual {
  constructor(store) {
    this.socket = new WebSocket("ws://localhost:1040");
    this.socket.onmessage = this.handleMessage;
    this.socket.onopen = this.handleOpen;
    this.store = store;
  }

  send = (func, ...params) => {
    this.store.dispatch({ type: "loading", data: true });
    this.socket.send(JSON.stringify({ func, params }));
  };

  handleOpen = () => {
    if (this.store.state.connecting) {
      this.store.dispatch({ type: "connecting", data: false });
      const date = new Date();
      this.send(
        "getBudgetMonth",
        date.toLocaleString("default", { month: "long" })
      );
    }
  };

  handleMessage = message => {
    const action = JSON.parse(message.data);
    this.store.dispatch({ type: "loading", data: false });
    this.store.dispatch(action);
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "loading":
    case "connecting":
      return { ...state, [action.type]: action.data };
    case "getBudgetMonth":
      return { ...state, budget: action.data };
    default:
      throw new Error(`Unhandled message ${action.type}.`);
  }
}

function useActualAPI() {
  const [state, dispatch] = React.useReducer(reducer, {
    categories: [],
    loading: false,
    connecting: true
  });
  const actual = React.useRef(new Actual({ state, dispatch }));
  return [actual.current, state];
}

function Sync() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function App() {
  const [actual, state] = useActualAPI();
  if (state.loading) {
    return "loading";
  }
  return (
    <div className="App">
      <button
        className="sync"
        onClick={() => {
          const date = new Date();
          actual.send(
            "getBudgetMonth",
            date.toLocaleString("default", { month: "long" })
          );
        }}
      >
        <Sync />
      </button>
      {state.budget ? (
        <section>
          <h1 className="month">{state.budget.month}</h1>
          {state.budget.categoryGroups
            .filter(category => !category.is_income)
            .map(group => (
              <div key={group.id}>
                <h3>{group.name}</h3>
                <section className="categories">
                  {group.categories.map(category => (
                    <div className="category" key={category.id}>
                      <label htmlFor={category.name}>{category.name}</label>
                      <progress
                        id={category.name}
                        max="1"
                        value={
                          category.budgeted
                            ? category.spent / category.budgeted
                            : 0
                        }
                      >
                        {category.name}
                      </progress>
                    </div>
                  ))}
                </section>
              </div>
            ))}
        </section>
      ) : null}
    </div>
  );
}

export default App;
