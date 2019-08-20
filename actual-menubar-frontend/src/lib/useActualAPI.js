import React from 'react';
import { format } from 'date-fns'

class Actual {
  constructor(store) {
    this.socket = new WebSocket("ws://localhost:1040");
    this.socket.onmessage = this.handleMessage;
    this.socket.onopen = this.handleOpen;
    this.store = store;
  }

  send = (func, ...params) => {
    this.socket.send(JSON.stringify({ func, params }));
  };

  handleOpen = () => {
    if (this.store.state.connecting) {
      this.store.dispatch({ type: "connecting", data: false });
      this.send(
        "getBudgetMonth",
        format(new Date(), 'yyyy-LL')
      );
    }
  };

  handleMessage = message => {
    const action = JSON.parse(message.data);
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

export default function useActualAPI() {
  const [state, dispatch] = React.useReducer(reducer, {
    categories: [],
    loading: false,
    connecting: true
  });
  const actual = React.useRef(new Actual({ state, dispatch }));
  return [actual.current, state];
}
