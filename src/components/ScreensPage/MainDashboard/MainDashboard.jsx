import React, { useState, useRef } from "react";
import AddButton from "components/Boards/AddButton/AddButton";
import { ColumnTask } from "components/Boards/ColumnTask/ColumnTask";
import { ContentWrapper, Wrapper } from "./MainDashboard.styled";
import BasicModal from "components/Modals/BasicModal/BasicModal";
import AddColumnModal from "components/Modals/ColumnModal/AddColumnModal";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import {
  selectColumns,
  selectColumnsLength,
  selectCurrentDashboard,
} from "redux/dashboards/dashboardsSelectors";
import { reorderCards } from "redux/dashboards/dashboardsSlice";
import { updateCardOrder } from "redux/dashboards/dashboardsOperations";
const MainDashboard = () => {
  const dispatch = useDispatch();
  const columnLength = useSelector(selectColumnsLength);
  const currentDashboard = useSelector(selectCurrentDashboard);
  const columns = useSelector(selectColumns);
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const handleOpen = () => {
    setOpen(true);
    setIsDragging(false);
  };
  const handleCloseModal = () => {
    setOpen(false);
    setIsDragging(true);
  };
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      const target = e.target.tagName.toLowerCase();
      if (target !== "input" && target !== "textarea") {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
      }
    }
  };
  const handleMouseMove = (e) => {
    if (!isDragging || open) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 0.05;
    scrollRef.current.scrollLeft = scrollRef.current.scrollLeft - walk;
  };
  const handleMouseUp = (e) => {
    if (e.button === 0) {
      setIsDragging(false);
    }
  };
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    dispatch(
      reorderCards({
        sourceIndex,
        destinationIndex,
        sourceDroppableId,
        destinationDroppableId,
      })
    );
    dispatch(
      updateCardOrder({
        sourceIndex,
        destinationIndex,
        sourceDroppableId,
        destinationDroppableId,
        cardId: result.draggableId,
      })
    );
  };
  return (
    <Wrapper length={columnLength} ref={scrollRef}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <ContentWrapper
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {columns &&
            columns.map((item) => <ColumnTask key={item._id} item={item} />)}
          <AddButton openModal={handleOpen} />
        </ContentWrapper>
      </DragDropContext>
      <BasicModal
        open={open}
        closeModal={handleCloseModal}
        children={
          <AddColumnModal
            dashboardId={currentDashboard?._id}
            closeModal={handleCloseModal}
          />
        }
      />
    </Wrapper>
  );
};
export default MainDashboard;