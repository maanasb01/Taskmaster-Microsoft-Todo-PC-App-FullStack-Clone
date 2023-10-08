import { createContext, useContext, useEffect, useState } from "react";
import { AUTH_TKN } from "../authToken";

const ListContext =  createContext();

export const useListContext = () => {
    return useContext(ListContext);
};

async function getLists(url){
  const response = await fetch(url,{ headers:{
      'authorization': AUTH_TKN
    }});
  let data = await response.json();
  return data
  }

export const ListProvider = ({children}) => {
    const [lists,setLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [latestListId,setLatestListId] = useState(null)

    useEffect( ()=> {
        //fetch Lists
        async function fetchData() {
        const fetchedLists = await getLists("http://localhost:3000/todolist/lists");
        setLists(fetchedLists);
        }
        fetchData();
    },[]);


//Setting up the selected List Value
    const selectList = (listId)=>{
      console.log("selectList Running..")
      const listToSelect = lists.find(list=>list._id===listId);
      setSelectedList(listToSelect)
      console.log("List selected")
    }

//Add New List
   const addNewList = async (title)=>{
    try {
      const res = await fetch("http://localhost:3000/todolist/new",{
    method: "POST",
    headers:{
        'Content-Type': 'application/json',
        'authorization': AUTH_TKN,   
    },
    body:JSON.stringify({title})
    
    });

    const newList = await res.json();

    //setLists(lists.concat(newList));
    setLists([...lists,newList])
    setLatestListId(newList._id);
    setSelectedList(newList._id)
    } catch (error) {
      console.error(error.message)
      
    }
   }

// Edit List Title
const editList = async (editedTitle, listId) => {
    try {
      const res = await fetch(`http://localhost:3000/todolist/updatetitle/${listId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'authorization': AUTH_TKN,
        },
        body: JSON.stringify({ title: editedTitle })
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update list title (status ${res.status})`);
      }
  
      const data = await res.json();
      const newTitle = data.newTitle;
  
      setLists(prevLists => {
        return prevLists.map(list => {
          if (list._id === listId) {
            return { ...list, title: newTitle };
          }
          return list;
        });
      });
      // setTimeout(() => {
        
      // }, 1000);
      selectList(listId)
  
      return newTitle; // Indicate success
    } catch (error) {
      // Handle fetch or parsing errors here
      console.error("Error editing list:", error);
      return false; // Indicate failure
    }
  }

  //delete a List

  const deleteList = async (listId) =>{

    try {
      const res = await fetch(`http://localhost:3000/todolist/delete/${listId}`,{
        method:"DELETE",
        headers: {
          'Content-Type': 'application/json',
          'authorization': AUTH_TKN,
        }
      })
      if (!res.ok) {
        throw new Error(`Failed to Delete the List (status ${res.status})`);
      }

      if(res.ok){
        setLists(lists.filter(list=> (list._id!==listId)))
      }
  
      
    } catch (error) {
      console.error("Error deleting the list:", error);
      
    }

  }


    return (
        <ListContext.Provider value={{lists,selectedList, selectList,addNewList, editList , deleteList ,latestListId,setLatestListId}}>
            {children}
        </ListContext.Provider>
    )
}