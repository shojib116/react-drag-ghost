import { useState, type HTMLAttributes } from "react";

function App() {
  const [columns, setColumns] = useState([["item1"], ["item2"]]);
  return (
    <main className="h-svh w-svw flex gap-20 items-center justify-center">
      {columns.map((items, cidx) => (
        <Column key={cidx}>
          {items.map((item) => (
            <Item key={item}>{item}</Item>
          ))}
        </Column>
      ))}
    </main>
  );
}

export default App;

function Column({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="w-100 border border-gray-400 rounded-2xl p-4 min-h-60"
      {...props}
    >
      {children}
    </div>
  );
}

function Item({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="w-full h-20 flex items-center hover:cursor-grab justify-center border rounded-lg border-sky-400 bg-sky-200 font-bold select-none"
      {...props}
    >
      {children}
    </div>
  );
}
