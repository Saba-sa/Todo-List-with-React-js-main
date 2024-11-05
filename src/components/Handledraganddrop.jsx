import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  ITEM: 'item',
};

const DraggableItem = ({ item, moveItem, index }) => {
  const [, ref] = useDrag({
    type: ItemTypes.ITEM,
    item: { index },
  });

  return (
    <div ref={ref} style={{ padding: '8px', margin: '4px', backgroundColor: 'lightblue', cursor: 'move' }}>
      {item}
    </div>
  );
};

const DropZone = ({ items, setItems, zoneName }) => {
  const [, ref] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (draggedItem) => {
      const newItems = [...items];
      const [movedItem] = newItems.splice(draggedItem.index, 1);
      setItems((prevItems) => [...prevItems, movedItem]);
    },
  });

  return (
    <div ref={ref} style={{ minHeight: '150px', padding: '16px', border: '1px dashed gray' }}>
      <h3>{zoneName}</h3>
      {items.map((item, index) => (
        <DraggableItem key={index} index={index} item={item} moveItem={setItems} />
      ))}
    </div>
  );
};

const App = () => {
  const [containerA, setContainerA] = useState(['Task A1', 'Task A2']);
  const [containerB, setContainerB] = useState(['Task B1', 'Task B2']);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <DropZone items={containerA} setItems={setContainerA} zoneName="Container A" />
        <DropZone items={containerB} setItems={setContainerB} zoneName="Container B" />
      </div>
    </DndProvider>
  );
};

export default App;
