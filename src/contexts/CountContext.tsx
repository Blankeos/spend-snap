import {
  createContext,
  createSignal,
  FlowComponent,
  useContext,
  type Accessor,
  type Setter,
} from "solid-js";

export const CountContext = createContext({
  count: 0 as unknown as Accessor<number>,
  setCount: ((newCount: number) => {}) as Setter<number>,
});

export const useCountContext = () => useContext(CountContext);

export const CountContextProvider: FlowComponent = (props) => {
  const [count, setCount] = createSignal(0);

  return (
    <CountContext.Provider
      value={{
        count: count,
        setCount: setCount,
      }}
    >
      {props.children}
    </CountContext.Provider>
  );
};
