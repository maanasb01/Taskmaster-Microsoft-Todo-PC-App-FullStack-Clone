import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import sunIcon from "../assets/sun_icon.svg";
import starIcon from "../assets/star_icon.svg";
import calendarIcon from "../assets/calendar_icon.svg";
import tasksIcon from "../assets/tasks_icon.svg";
import listIcon from "../assets/list_icon.svg";
import plusIcon from "../assets/plus_icon.svg";
import folderIcon from "../assets/folder_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import { useListContext } from "../contexts/ListContext";


//Component for new list
function NewList() {
  const { addNewList } = useListContext();
  return (
    <>
      <div className="w-full h-10 bg-[#fafafa]  pl-1 absolute bottom-0 border-t-[1px] border-slate-400">
        {/* <div id = 'separatingDiv' className="mx-1 border-b-[1px] border-slate-400 "></div> */}
        <div className="flex justify-between h-full">
          <div
            className="w-full h-full px-3  rounded-md flex items-center hover:bg-slate-300 cursor-pointer"
            onClick={() => addNewList()}
          >
            <img src={plusIcon} alt="" className="h-6 pt-1 mr-3" />
            <span>New List</span>
          </div>
          <div className="w-14 h-full  flex items-center rounded-md hover:bg-slate-300 cursor-pointer">
            <img src={folderIcon} alt="" className="h-6 pt-1 mx-auto" />
          </div>
        </div>
      </div>
    </>
  );
}

function SpecialListOption(props) {
  const { icon, title, onCLick } = props;

  return (
    <div
      className="flex items-center h-10 p-3 rounded-sm hover:bg-slate-300 cursor-pointer"
      onClick={onCLick}
    >

      <img src={icon} alt="" srcset="" className="h-6 pt-1" />
      <span className="ml-4 overflow-hidden whitespace-nowrap overflow-ellipsis">
        {title}
      </span>
    </div>
  );
}

function ListOption(props) {
  const { icon, title, selectList, listId } = props;
  const [isEditing, setIsEditing] = useState(false);

  const [listTitle, setTitle] = useState(title);

  const { editList,deleteList, latestListId,setLatestListId } = useListContext();

  const oldTitle = title;

  const inputref = useRef(null);

  // Function to handle "Esc" key press
  const handleEscKeyPress = (event) => {
    if (event.key === "Escape") {
      inputref.current.blur(); // Blur the input when "Esc" is pressed
      
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("keydown", handleEscKeyPress);
    

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKeyPress);
    };
  }, []);

  useEffect(() => {
    // const prevList = listRef.current;
    
    //latestListId === listId && lists.length === prevList.length --- previous condition
    if (latestListId === listId) {
      
      //setIsEditing(true);
      setLatestListId(null);
      handleOnEditing();
    }
  }, []);

  async function handleNameChange(e) {
    e.preventDefault();
    const editedTitle = inputref.current.value;
  
    try {
      const editedListTitle = await editList(editedTitle, listId);
  
      // Check if the edit was successful
      if (editedListTitle) {
        setIsEditing(false);
        // setTitle(editedListTitle);
        // selectList(listId)
      } else {
        setTitle(oldTitle);
        setIsEditing(false);
        alert("Something went wrong while updating the Title.")
      }
    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error("Error editing list:", error);
    }
  }

  function handleInputChange() {
    setTitle(inputref.current.value);
  }

  function handleOnBlur() {
    setIsEditing(false);
    setTitle(oldTitle);
  }

  function handleOnEditing() {
    setIsEditing(true);
    setTimeout(() => {
      if (inputref.current) {
        inputref.current.focus();
        inputref.current.select();
      }
    }, 0);
  }
  return (
    <>
      {isEditing ? (
        <form
          onSubmit={(e) => handleNameChange(e)}
          onBlur={handleOnBlur}
          className="px-3 w-full"
        >
          <input
            type="text"
            ref={inputref}
            value={listTitle}
            onChange={handleInputChange}
            onBlur={handleOnBlur}
            className="px-2"
          />
        </form>
      ) : (
        <div
          typeof="button"
          className="flex items-center h-10 p-3 rounded-sm hover:bg-slate-300 cursor-pointer"
          //This selectList is a prop
          onClick={selectList}
        >
          {" "}
          <img src={icon} alt="" srcset="" className="h-6 pt-1" />{" "}
          <span
            className="ml-4 overflow-hidden whitespace-nowrap overflow-ellipsis"
            onDoubleClick={handleOnEditing}
          >
            {listTitle}
          </span>
          <div className="ml-auto rounded-full w-7 h-7 hover:bg-slate-400 active:bg-[#fafafa]" onClick={()=>deleteList(listId)}>
          <img src={deleteIcon} alt="" srcset="" className="h-6 pt-1 mx-auto" />
          </div>
        </div>
      )}
    </>
  );
}

export default function NavigationCol() {
  const { lists, selectList } = useListContext();

  return (
    <>
      <div
        id="nav"
        className="bg-[#fafafa] w-3/12  h-full flex flex-col  relative "
      >
        <div id="profile" className="w-full p-3 flex">
          <div className="rounded-3xl h-16 w-16 bg-slate-500">MB</div>
          <div className="mr-auto my-auto pl-5">
            <span className="text-2xl font-semibold">Maanas Bhardwaj</span>
            <div className="text-gray-600">maanas@gmail</div>
          </div>
        </div>

        <div id="search" className="w-full p-3">
          <input
            type="text"
            className="bg-white  outline-none w-full rounded-sm p-1 px-2 border border-b-2 border-b-gray-400 focus:border-b-blue-900"
            placeholder="Search"
          />
        </div>

        <div className="overflow-y-auto h-full">
          <div
            id="keyOptions"
            className="w-full py-3 flex flex-col px-1 space-y-1"
          >
            <SpecialListOption icon={sunIcon} title="My Day" />
            <SpecialListOption icon={starIcon} title="Important" />
            <SpecialListOption icon={calendarIcon} title="Planned" />
            <SpecialListOption icon={tasksIcon} title="Tasks" />
          </div>

          <div
            id="separatingDiv"
            className="mx-1 mb-2  border-b-[1px] border-slate-400 "
          ></div>

          <div id="customLists" className=" px-1 pb-1  ">
            {lists &&
              lists.map((list, index) => {
                return (
                  <ListOption
                    icon={list.icon ? list.icon : listIcon}
                    title={list.title}
                    key={index}
                    selectList={() => selectList(list._id)}
                    listId={list._id}
                  />
                );
              })}
          </div>
        </div>
        {/* <div id = 'separatingDiv' className="mx-1 mb-2  border-b-2 border-slate-400 "></div> */}
        <div className="w-full h-16 bg-[#fafafa] ">
          <NewList />
        </div>
      </div>
    </>
  );
}
