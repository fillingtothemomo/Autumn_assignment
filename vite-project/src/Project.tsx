import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaComment } from "react-icons/fa";
import Modal from 'react-modal';
import { IoIosAdd } from "react-icons/io";
import { CiTrash } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
const Project = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const [isCreateCardVisible, setCreateCardVisible] = useState(false);
  const [isCreateCardVisibleMap, setCreateCardVisibleMap] = useState<{ [listId: string]: boolean }>({});
  const [userData, setUserData] = useState([]);
  const [key, setKey] = useState(0);
    const [rerender, setRerender] = useState(false);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState<{ [listId: string]: any[] }>({});
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newDesc, setNewComment] = useState('');
  const [selectedCardComments, setSelectedCardComments] = useState([]);
  const [newCardDesc, setNewCardDesc] = useState('');
  const [comments, setComments] = useState<{ [listId: string]: any[] }>({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const socketRef = useRef<WebSocket | undefined>(undefined);
  const handleIconClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  useEffect(() => {
    axios.get('http://127.0.0.1:8000/project_app/login/')
      .then((response) => {
        setUserData(response.data);
        console.log('yo');

        console.log(userData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/project_app/login/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching additional user data:', error);
    }
  
  };
  const getUserNameById = (userId:number) => {
    console.log(userData);
    const user = userData.find((user) => user.id === parseInt(userId));
    console.log(user);
    return user ? user.name : 'Unknown User';
  };
  useEffect(() => {
    console.log('userData in useEffect:', userData);
  }, [userData]);
  const handleToggleCreateCardForList = (listId: string) => {
    setCreateCardVisibleMap((prevMap) => ({
      ...prevMap,
      [listId]: !prevMap[listId],
    }));
  };
  
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
    updateListId(sourceListId, destinationListId, draggableId);
    
  
  }
  const handleCreateList=()=>{
    const data={
      
      name:newListName,
      projects:id,

    };
    axios.post('http://127.0.0.1:8000/project_app/create_list/', data).
    then((response)=>{

      const newList = response.data; // Assuming the response contains the newly created list data
      setLists((prevLists) => [...prevLists, newList]);
      setNewListName('');
    })  .catch((error) => {
      console.error(error.response.data);
      console.error(error.response.headers);
    });
    }
    const handleCreateCard = async (sourceListId: number) => {
      try {
        const data = {
          title: newCardName,
          desc: newCardDesc,
          assignees: ['14'],
          color: 'blue',
          lists: sourceListId,
        };
  
        console.log('Before axios.post request data:', data);
  
        const response = await axios.post('http://127.0.0.1:8000/project_app/create_card/', data);
        console.log('metoo');
        console.log('After axios.post');
  
        const newCards = response.data;
        setCards((prevCards) => ({
          ...prevCards,
          [sourceListId]: [...(prevCards[sourceListId] || []), newCards],
        }));
  
        console.log('After state update');
        setNewCardName('');
        setNewCardDesc('');
        setCreateCardVisible(true);
      } catch (error) {
        console.error('Error creating card:', error);
        console.error(error.response?.data);
        console.error(error.response?.headers);
      }
    };
  
      const handleCreateComment=(sourceCardId:number)=>{
        const current = new Date();

        const hours = String(current.getHours()).padStart(2, '0');
        const minutes = String(current.getMinutes()).padStart(2, '0');
        const seconds = String(current.getSeconds()).padStart(2, '0');
        
        const time = `${hours}:${minutes}:${seconds}`;
          
        
        console.log(time);  
        const data={
          
          desc:newDesc,
          sender:['14'],
          card:sourceCardId,
          time:time,

        };
        axios.post('http://127.0.0.1:8000/project_app/create_comment/', data).
        then((response)=>{
    
          const newComments = response.data; // Assuming the response contains the newly created list data
          setComments((prevComments) => ({
            ...prevComments,
            [sourceCardId]: [...(prevComments[sourceCardId] || []), newComments],
          }));
        })  .catch((error) => {
          console.error(error.response.data);
          console.error(error.response.headers);
        });
       
      
        }
      //   socketRef.current=new WebSocket(
        
        
      //   'ws://127.0.0.1:8000/')
      //   socketRef.current.onopen= e => {
      //    console.log('open',e)
      //   }
      //   socketRef.current.onmessage = (event) => {
      //     const eventData = JSON.parse(event.data);
      //     handleCreateComment(eventData.source_card_id);
      // };
      
     
      //   socketRef.current.onerror = (event) => {
      //     console.error('WebSocket Error:', event);
      // };
    const handleIconClick2 = (sourceCardId:number) => {
          axios
            .get(`http://127.0.0.1:8000/project_app/comments/?card_id=${sourceCardId}`)
            .then((response) => {
              setSelectedCardComments(response.data);
              setDialogOpen(true);

            })
            .catch((error) => {
              console.error('Error fetching comments:', error);
              console.error(error.response.data);
              console.error(error.response.headers);
            });
        };
    const updateListId = (sourceListId, destinationListId, cardId) => {
      // Fetch the existing card data first
      axios
        .get(`http://127.0.0.1:8000/project_app/cards/${cardId}`)
        .then((getResponse) => {
          const existingCardData = getResponse.data;
         console.log(destinationListId);
         console.log(sourceListId);

          // Create updated data with the new list ID
          const updatedCardData = {
            ...existingCardData,
            assignees:[14],
            lists: destinationListId,
          };
    
          // Make a PUT request to update the card
          axios
            .put(`http://127.0.0.1:8000/project_app/cards/${cardId}/`, updatedCardData)
            .then((response) => {
              console.log('Card updated successfully:', response.data);

              console.log('Card updated successfully:', existingCardData);

            })
            .catch((error) => {
              console.error('Error updating card:', error);
              console.error(error.response.data);
              console.error(error.response.headers);
            });
        })
        .catch((error) => {
          console.error('Error fetching card data:', error);
          
        });
    };
    
const handleDeleteCard=(cardId:number)=>{
axios.delete(`http://127.0.0.1:8000/project_app/cards/${cardId}`)
.then((response)=>{
  setCards((prevCards)=>{
    const updatedCards={...prevCards};
    delete updatedCards[cardId];
    console.log('card deleted successfully:', response.data);
    return updatedCards;

  })
}).catch((error) => {
  console.error('Error deleting card:', error);
  console.error(error.response.data);
  console.error(error.response.headers);})
}
const handleDeleteList=(listId:number)=>{
  axios.delete(`http://127.0.0.1:8000/project_app/lists/${listId}`)
  .then((response)=>{
    setLists((prevLists)=>{
      const updatedLists={...prevLists};
      delete updatedLists[listId];
      console.log('list deleted successfully:', response.data);
      return updatedLists;
  
    })      
    

  }).catch((error) => {
    console.error('Error deleting card:', error);
    console.error(error.response.data);
    console.error(error.response.headers);})
  }
// const handleDeleteList = async (listId: number) => {
//   try {
//     const cardsResponse = await axios.get(`http://127.0.0.1:8000/project_app/cards/?list_id=${listId}`);
//     const cardsToDelete = cardsResponse.data;

//     for (const card of cardsToDelete) {
//       await axios.delete(`http://127.0.0.1:8000/project_app/cards/${card.id}`);
//     }

//     const response = await axios.delete(`http://127.0.0.1:8000/project_app/lists/${listId}`);
//     console.log('List and associated cards deleted successfully:', response.data);

//     setLists((prevLists) => {
//       const updatedLists = { ...prevLists };
//       delete updatedLists[listId];
//       console.log(updatedLists);
//       return updatedLists;
      
//     });
//     setRerender((prev) => !prev);

//   } catch (error) {
//     console.error('Error deleting list or associated cards:', error);
//     console.error(error.response?.data);
//     console.error(error.response?.headers);
//   }
// };




  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/project_app/lists/?project_id=${id}`)
      .then((response) => {
        setLists(response.data);

        const cardRequests = response.data.map((list) =>
          axios.get(`http://127.0.0.1:8000/project_app/cards/?list_id=${list.id}`)
        );
        console.log(lists)
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
    <>
    <div className="w-full h-screen bg-slate-600">
      <p className="ml-60 pt-12 text-white text-3xl">{name}</p>
      <p className="ml-60 pt-12 text-white text-2xl">Members: A, B, C</p>
      <div className='ml-60'>
          <input
            type="text"
            placeholder="List Name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <button onClick={handleCreateList} className="create-list-button">
            Create List
          </button>
          <br/>

        </div>
      <div className="ml-60 mt-4 flex">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {lists.map((list, listIndex) => (
            <div key={listIndex} className="mr-4">
              <Droppable droppableId={list.id} key={list.id}>
                {(provided) => (
                  <div >
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-row p-2 bg-slate-400 rounded-md flex-wrap mt-4 border"
                  >
                    <h2>
                      {list.name}
                    </h2>
                    <div className="" onClick={() => handleToggleCreateCardForList(list.id)}>
          <span className=" ml-1  ">< IoIosAdd /></span>

</div>
<button onClick={() => handleDeleteList(list.id)}><CiTrash /></button>

</div>
        <div>
        {isCreateCardVisibleMap[list.id] && (
  <div className=" flex-column w-44">
    <input
      type="text"
      placeholder="Card Name"
      value={newCardName}
      onChange={(e) => setNewCardName(e.target.value)}
    />
    <input
      type="text"
      placeholder="Card Desc"
      value={newCardDesc}
      onChange={(e) => setNewCardDesc(e.target.value)}
    />
    <br></br>
    <button onClick={() => handleCreateCard(list.id)}>Create Card</button>
  </div>
)}

              </div>


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
                                <br></br>
                                {card.desc}
                                <button onClick={() => handleDeleteCard(card.id)}><CiTrash /></button>
                                <div>
                                <button onClick={() => { handleIconClick(); handleIconClick2(card.id); }}>  
  <FaComment />
</button>

      <Modal
        isOpen={isDialogOpen}
        onRequestClose={handleCloseDialog}
        contentLabel="Comments Dialog"
      >
        <div className="flex flex-row justify-between ">
          <p className='text-lg bg-gray-400 p-3'>Comments</p>
           
          <input className="border-4 ml-24"
            type="text"
            placeholder="Comment"
            value={newDesc}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="create-list-button border-4 mr-28" onClick={() => handleCreateComment(card.id)} >
            Create Comment
          </button>
          <button onClick={handleCloseDialog}><IoCloseCircleOutline /></button>

        </div>
        <div className="mt-8">
          {selectedCardComments.map((comment) => (
            <div key={comment.id}>
              <p>Comment:  {comment.desc}
              <br></br>
              sender: {getUserNameById(comment.sender)} 
            <br></br>
              time :{comment.time}</p>
              <hr></hr>
            </div>
          ))}
</div>
      </Modal>
  
    </div>
                              </p>
            

                              
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
      
    </div>
    </>
  );
};

export default Project;