import { DragDropContext } from "react-beautiful-dnd";

const dragEnd = (result) => {
    const {destination, source, draggableId} = result;
    if (!destination){
        // The user released the drop, but not over a valid destination.
        return;
    }
    if(destination.droppableId === source.droppableId && destination.index === source.index){
        //The user released the drop in the original location
        return;
    }
}

const ApplicationDragDropContext = ({ children }) => {
    return (<DragDropContext
        // onDragStart
        // onDragUpdate
        onDragEnd={dragEnd}
    >
        {children}
    </DragDropContext>)
}

export default ApplicationDragDropContext