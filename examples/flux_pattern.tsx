type StoreState = {
  count: number;
};

type Action = { type: "add"; payload: number };

function reducer(state: StoreState, action: Action) {
  const { type: ActionType, payload } = action;

  if (ActionType === "add") {
    return {
      count: state.count + payload,
    };
  }

  throw new Error(`Unexpected action type: ${ActionType}`);
}

export default function App() {
  const [state, dispatcher] = useReducer(reducer, { count: 0 });

  function handleClick() {
    dispatcher({ type: "add", payload: 1 });
  }

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={handleClick}>Add</button>
    </div>
  );
}
