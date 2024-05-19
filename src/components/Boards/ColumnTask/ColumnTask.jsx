import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import sprite from "../../../images/sprite.svg";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { reorderCards } from "redux/dashboards/dashboardsSlice";
import { deleteColumn } from "redux/dashboards/dashboardsOperations";
import Card from "components/Cards/Card";
import BasicModal from "components/Modals/BasicModal/BasicModal";
import EditColumnModal from "components/Modals/ColumnModal/EditColumnModal/EditColumnModal";
import {
  Wrapper,
  Header,
  Button,
  PlusIcon,
  ButtonPlus,
  TaskList,
  IconWrapper,
  Icon,
  Content,
  Title,
  ContentWrapper,
} from "./ColumnTask.Styled";
import AddCardModal from "components/Modals/CardModal/AddCardModal/AddCardModal";
export const ColumnTask = ({ item }) => {
  const dispatch = useDispatch();
  const [openColumnModal, setOpenColumnModal] = useState(false);
  const [openCardModal, setOpenCardModal] = useState(false);
  const selectedPriority = useSelector(
    (state) => state.dashboards.selectedPriority
  );
  const handleOpenColumnModal = () => setOpenColumnModal(true);
  const handleCloseColumnModal = () => setOpenColumnModal(false);
  const handleOpenCardModal = () => setOpenCardModal(true);
  const handleCloseCardModal = () => setOpenCardModal(false);
  const filteredColumn =
    item.cards &&
    item.cards.filter((item) => item.priority === selectedPriority);
  const columnLength = item.cards && item.cards.length;
  const filteredColumnLength = filteredColumn && filteredColumn.length;
  const condition =
    selectedPriority === "show all" ? columnLength : filteredColumnLength;
  const getCardsToRender = () => {
    if (selectedPriority === "show all") {
      return item.cards || [];
    } else {
      return filteredColumn || [];
    }
  };
  const cardsToRender = getCardsToRender();
  return (
    <Wrapper>
      <ContentWrapper>
        <Content>
          <Header>
            <Title>{item.title}</Title>
            <IconWrapper>
              <Icon onClick={handleOpenColumnModal}>
                <use href={sprite + "#icon-pencil"} />
              </Icon>
              <Icon onClick={() => dispatch(deleteColumn(item._id))}>
                <use href={sprite + "#icon-trash"} />
              </Icon>
            </IconWrapper>
          </Header>
          <Droppable droppableId={item._id} type="group">
            {(provided) => (
              <TaskList
                {...provided.droppableProps}
                ref={provided.innerRef}
                length={condition}
              >
                {cardsToRender.map((el, index) => (
                  <Draggable key={el._id} draggableId={el._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card item={el} columnName={item.title} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Content>
        <Button onClick={handleOpenCardModal}>
          <ButtonPlus>
            <PlusIcon>
              <use href={sprite + "#icon-plus"} />
            </PlusIcon>
          </ButtonPlus>
          Add another card
        </Button>
      </ContentWrapper>
      <BasicModal
        open={openColumnModal}
        closeModal={handleCloseColumnModal}
        children={
          <EditColumnModal
            title={item.title}
            columnId={item._id}
            closeModal={handleCloseColumnModal}
          />
        }
      />
      <BasicModal
        open={openCardModal}
        closeModal={handleCloseCardModal}
        children={
          <AddCardModal columnId={item._id} closeModal={handleCloseCardModal} />
        }
      />
    </Wrapper>
  );
};