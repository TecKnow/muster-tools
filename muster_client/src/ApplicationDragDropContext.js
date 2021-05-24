import { DragDropContext } from "react-beautiful-dnd";
import { assignSeat } from "@grumbleware/event-muster-store";
import { useDispatch } from "react-redux";

const ApplicationDragDropContext = ({ children }) => {
  const dispatch = useDispatch();
  const dragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      // The user released the drop, but not over a valid destination.
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      //The user released the drop in the original location
      return;
    }
    const destinationDroppableIdString = destination.droppableId;
    const destinationDroppableIdParts = String.prototype.split.call(
      destinationDroppableIdString,
      " "
    );
    const destinationDroppableIdInt = parseInt(
      destinationDroppableIdParts[destinationDroppableIdParts.length - 1]
    );
    const destinationDroppableIndex = destination.index;
    const draggableIDParts = String.prototype.split.call(draggableId, ":");
    const playerName = draggableIDParts[draggableIDParts.length - 1];
    dispatch(
      assignSeat({
        player: playerName,
        table: destinationDroppableIdInt,
        position: destinationDroppableIndex,
      })
    );

    console.log(JSON.stringify({ destination, source, draggableId }));
  };
  return (
    <DragDropContext
      // onDragStart
      // onDragUpdate
      onDragEnd={dragEnd}
    >
      {children}
    </DragDropContext>
  );
};

export default ApplicationDragDropContext;
