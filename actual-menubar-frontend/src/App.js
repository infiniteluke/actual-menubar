import React from "react";
import { format } from 'date-fns'

import Budget from './Budget';
import useActualAPI from './lib/useActualAPI';

import "./App.css";

function Sync() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20">
      <path
        d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function App() {
  const [actual, state] = useActualAPI();
  const sync = () => actual.send(
    "getBudgetMonth",
    format(new Date(), 'yyyy-LL')
  );
  return (
    <div className="App">
      <button
        className="sync"
        onClick={sync}
      >
        <Sync /><span>Sync</span>
      </button>
      <Budget budget={state.budget} />
    </div>
  );
}

export default App;
