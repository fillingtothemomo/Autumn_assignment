import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Project = () => {
  const { id, name } = useParams<{ id: string; name: string }>();

  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState<{ [listId: string]: any[] }>({});

  function handleOnDragEnd(result: any) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return; 
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; 
    }

    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const updatedCards = { ...cards };

    const [draggedCard] = updatedCards[sourceListId].splice(sourceIndex, 1);

    if (!updatedCards[destinationListId]) {
      updatedCards[destinationListId] = [];
    }
    updatedCards[destinationListId].splice(destinationIndex, 0, draggedCard);

    setCards(updatedCards);
  }

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/project_app/lists/?project_id=${id}`)
      .then((response) => {
        setLists(response.data);

        const cardRequests = response.data.map((list) =>
          axios.get(`http://127.0.0.1:8000/project_app/cards/?list_id=${list.id}`)
        );

        Promise.all(cardRequests)
          .then((cardResponses) => {
            const allCards = cardResponses.map((response) => response.data).flat();

            const cardsByList = {};
            allCards.forEach((card) => {
              if (!cardsByList[card.lists]) {
                cardsByList[card.lists] = [];
              }
              cardsByList[card.lists].push(card);
            });

            setCards(cardsByList);
          })
          .catch((cardError) => {
            console.error(cardError);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="w-full h-screen bg-slate-600">
      <p className="ml-60 pt-12 text-white text-3xl">{name}</p>
      <p className="ml-60 pt-12 text-white text-2xl">Members: A, B, C</p>

      <div className="ml-60 mt-4 flex">
        {lists.map((list, listIndex) => (
          <div key={listIndex} className="mr-4">
            <>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId={list.id} key={list.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="p-2 bg-slate-400 rounded-md flex-wrap mt-4 border"
                    >
                      <h2>
                        {list.name}
                        {list.id}
                      </h2>
                      {cards[list.id] &&
                        cards[list.id].map((card, index) => (
                          <Draggable
                            index={index}
                            draggableId={card.id.toString()}
                            key={card.id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 bg-slate-400 rounded-md flex-wrap mt-2 border"
                              >
                                <p>
                                  {card.title}
                                  {card.desc}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
