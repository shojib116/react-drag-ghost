import React, {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

type Coordinate = {
  x: number;
  y: number;
};

function App() {
  const [columns, setColumns] = useState([["item1"], ["item2"]]);
  const [draggedItem, setDraggedItem] = useState<{
    item: string;
    styles: CSSProperties;
    dragOffset: Coordinate;
  } | null>(null);
  const [cursorPos, setCursorPos] = useState<Coordinate>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleDragOver = (e: DragEvent) => {
      setCursorPos({ x: e.pageX, y: e.pageY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("dragover", handleDragOver);
    };
  });

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

    setDraggedItem(null);
  };

  const handleDragStart = (
    e: React.DragEvent,
    item: string,
    fromColumn: number
  ) => {
    e.dataTransfer.setData("item", item); // use JSON.stringify(item) if array or object
    e.dataTransfer.setData("fromColumn", fromColumn.toString()); // because the function only accepts strings

    const el = e.target as HTMLElement;
    el.style.opacity = "0.01";

    const handleDragEnd = () => {
      el.style.opacity = "1";
      setDraggedItem(null);
      el.removeEventListener("dragend", handleDragEnd);
    };

    el.addEventListener("dragend", handleDragEnd);

    const {
      backgroundColor,
      border,
      width,
      height,
      borderRadius,
      display,
      alignItems,
      justifyContent,
      fontWeight,
    } = getComputedStyle(el);

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedItem({
      item,
      styles: {
        backgroundColor,
        border,
        width,
        height,
        borderRadius,
        display,
        alignItems,
        justifyContent,
        fontWeight,
      },
      dragOffset: { x: offsetX, y: offsetY },
    });
  };

  return (
    <main className="relative h-svh w-svw flex gap-20 items-center justify-center">
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
      {/* drag image */}
      {draggedItem && (
        <div
          className="absolute pointer-events-none"
          style={{
            ...draggedItem.styles,
            top: cursorPos.y - draggedItem.dragOffset.y,
            left: cursorPos.x - draggedItem.dragOffset.x,
          }}
        >
          {draggedItem.item}
        </div>
      )}
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
