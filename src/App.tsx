import React, { useState, type HTMLAttributes } from "react";

function App() {
  const [columns, setColumns] = useState([["item1"], ["item2"]]);

  const handleDrop = (e: React.DragEvent, toColumn: number) => {
    const item = e.dataTransfer.getData("item"); // use JSON.parse() here if complex data
    const fromColumn = Number(e.dataTransfer.getData("fromColumn")); // converting to number since this will be used as array index

    if (fromColumn === toColumn) return; // if we are dragging and dropping from the same column, we just skip it.

    setColumns((prev) => {
      const fromColumnData = prev[fromColumn].filter((i) => i !== item); // filter the item from the source column
      const toColumnData = [...prev[toColumn], item]; // add the item to target column

      const newColumns = [...prev]; // copy over the previous data
      newColumns[fromColumn] = fromColumnData; // modify the source column with updated source column data
      newColumns[toColumn] = toColumnData; // modify the target column with updated source column data

      return newColumns; // return the new column data
    });
  };

  const handleDragStart = (
    e: React.DragEvent,
    item: string,
    fromColumn: number
  ) => {
    e.dataTransfer.setData("item", item); // use JSON.stringify(item) if array or object
    e.dataTransfer.setData("fromColumn", fromColumn.toString()); // because the function only accepts strings
  };

  return (
    <main className="h-svh w-svw flex gap-20 items-center justify-center">
      {columns.map((items, cidx) => (
        <Column
          key={cidx}
          onDrop={(e) => handleDrop(e, cidx)}
          onDragOver={(e) => e.preventDefault()}
        >
          {items.map((item) => (
            <Item
              key={item}
              onDragStart={(e) => handleDragStart(e, item, cidx)}
              draggable
            >
              {item}
            </Item>
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
      className="w-100 border border-gray-400 rounded-2xl p-4 min-h-60 space-y-4"
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
