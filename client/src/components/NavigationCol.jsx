import React, { useEffect, useRef, useState } from "react";
import sunIcon from "../assets/sun_icon.svg";
import starIcon from "../assets/star_icon.svg";
import calendarIcon from "../assets/calendar_icon.svg";
import tasksIcon from "../assets/tasks_icon.svg";
import listIcon from "../assets/list_icon.svg";
import plusIcon from "../assets/plus_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import { useListContext } from "../contexts/ListContext";
import { useTodoContext } from "../contexts/TodoContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";
import { HOST } from "../config/config";

//Component for new list
function NewList() {
  const { addNewList } = useListContext();
  async function handleAddList() {
    await addNewList();
    return;
  }
  return (
    <>
      <div className="w-full h-10 bg-[#fafafa]  pl-1 absolute bottom-0 border-t-[1px] border-slate-400">
        {/* <div id = 'separatingDiv' className="mx-1 border-b-[1px] border-slate-400 "></div> */}
        <div className="flex justify-between h-full">
          <div
            className="w-full h-full px-3  rounded-md flex items-center hover:bg-slate-300 cursor-pointer"
            onClick={handleAddList}
          >
            <img src={plusIcon} alt="" className="h-6 pt-1 mr-3" />
            <span>New List</span>
          </div>
          {/* <div className="w-14 h-full  flex items-center rounded-md hover:bg-slate-300 cursor-pointer">
            <img src={folderIcon} alt="" className="h-6 pt-1 mx-auto" />
          </div> */}
        </div>
      </div>
    </>
  );
}

//List Component for Default Lists "My Day, Important, Planned, Tasks"
function DefaultListOption(props) {
  const { icon, title, onClick } = props;

  return (
    <div
      className="flex items-center h-10 p-3 rounded-sm hover:bg-slate-300 cursor-pointer"
      onClick={onClick}
    >
      <img src={icon} alt="" className="h-6 pt-1" />
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
  const { editList, deleteList, latestListId, setLatestListId } =
    useListContext();

  const oldTitle = title;
  const inputref = useRef(null);

  // Function to handle "Esc" key press
  const handleEscKeyPress = (event) => {
    if (event.key === "Escape") {
      if (inputref.current) inputref.current.blur(); // Blur the input when "Esc" is pressed
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

  async function handleDeleteList(e) {
    e.stopPropagation();

    await deleteList(listId);
    return;
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
          <img src={icon} alt="" className="h-6 pt-1" />{" "}
          <span
            className="ml-4 w-[90%] overflow-hidden whitespace-nowrap overflow-ellipsis cursor-text"
            onDoubleClick={handleOnEditing}
          >
            {listTitle}
          </span>
          <div
            className="ml-auto rounded-full w-7 h-7 hover:bg-slate-200 active:bg-[#fafafa]"
            onClick={(e) => handleDeleteList(e)}
          >
            <img
              src={deleteIcon}
              alt="Delete List"
              className="h-6 pt-1 mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function NavigationCol() {
  const {
    lists,
    selectList,
    setSelectedList,
    setSelectedListName,
    getDefaultTasksList,
    setDefaultList,
    isNavColOpen,
    setIsNavColOpen,
  } = useListContext();
  const { setTodos, getTodosData, getAllTodos, setSelectedTodo } =
    useTodoContext();

  const { user, setUser } = useAuth();

  const [listsToDisplay, setListsToDisplay] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const { fetchWithLoader } = useLoading();

  const navigate = useNavigate();

  const navColRef = useRef(null);
  const navToggleBtnRef = useRef(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (lists) {
      setListsToDisplay(lists);
    }
  }, [lists]);

  //Close navbar when medium screens

  const navColCloseHandler = (e) => {
    if (window.innerWidth > 767 && window.innerWidth < 1024) {
      if (
        !navColRef.current.contains(e.target) &&
        !navToggleBtnRef.current.contains(e.target)
      ) {
        setIsNavColOpen(false);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", navColCloseHandler);
    document.addEventListener("resize", navColCloseHandler);
    return () => {
      document.removeEventListener("mousedown", navColCloseHandler);
      document.addEventListener("resize", navColCloseHandler);
    };
  }, []);

  //Set the navbar state to true automatically when window gets resize

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsNavColOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleMyDayDefaultList() {
    try {
      const allTodos = await getAllTodos();
      const myDayTodos = allTodos.filter((todo) => todo.inMyDay === true);
      setTodos(myDayTodos);
      setSelectedList(null);
      setSelectedListName("My Day");
      setDefaultList("MyDay");
      setSelectedTodo(null);
      if (window.innerWidth < 1024) {
        setIsNavColOpen(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  async function handleImportantDefaultList() {
    try {
      const allTodos = await getAllTodos();
      const importantTodos = allTodos.filter((todo) => todo.markedImp === true);
      setTodos(importantTodos);
      setSelectedList(null);
      setSelectedListName("Important");
      setDefaultList("Important");
      setSelectedTodo(null);
      if (window.innerWidth < 1024) {
        setIsNavColOpen(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  async function handlePlannedDefaultList() {
    try {
      const allTodos = await getAllTodos();
      const dueTodos = allTodos.filter((todo) => todo.dueAt);
      setTodos(dueTodos);
      setSelectedList(null);
      setSelectedListName("Planned");
      setDefaultList("Planned");
      setSelectedTodo(null);
      if (window.innerWidth < 1024) {
        setIsNavColOpen(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  async function handleTasksDefaultList() {
    try {
      const defaultTasksList = await getDefaultTasksList();
      const tasksTodos = await getTodosData(defaultTasksList._id);
      setTodos(tasksTodos);
      setSelectedList(null);
      setSelectedListName("Tasks");
      setDefaultList("Tasks");
      setSelectedTodo(null);
      if (window.innerWidth < 1024) {
        setIsNavColOpen(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleSelectList(listId) {
    setSelectedTodo(null);
    setDefaultList(null);
    setTodos(null);
    selectList(listId);

    if (window.innerWidth < 1024) {
      setIsNavColOpen(false);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetchWithLoader(`${HOST}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setUser(null);
          navigate("/login", { replace: true });
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error.message);
    }
  }

  function handleProfile() {
    navigate("/app/profile");
  }

  return (
    <>
      <div
        id="nav"
        ref={navColRef}
        // className={`bg-[#fafafa] w-[100%] md:w-[50%] lg:w-[30%] h-full fixed z-10 top-0 left-0 lg:static   ${
        //   isNavColOpen ? "" : "hidden"}`}
        className={`bg-[#fafafa] w-[100%] md:w-[50%] lg:w-[30%] h-full fixed z-10 top-0 lg:static transition-transform duration-300 overflow-hidden ${
          isNavColOpen
            ? "transform translate-x-0"
            : "transform -translate-x-full"
        }`}
      >
        <div id="nav-col-wrapper" className="h-full flex flex-col relative">
          {/* {Toggle Button} */}
          <div className="px-3 pt-2 text-xl lg:hidden">
            <img
              src={listIcon}
              ref={navToggleBtnRef}
              alt="toggle"
              className="h-6 cursor-pointer"
              onClick={() => setIsNavColOpen(!isNavColOpen)}
            />
          </div>

          <div className="font-popins px-3 pt-2 text-xl text-slate-700  font-bold">
            Taskmaster
          </div>
          <div id="profile" className="w-full p-3 flex">
            <div
              className="rounded-3xl h-16 w-16 min-w-[4rem] bg-slate-500 cursor-pointer text-white flex items-center justify-center text-4xl"
              onClick={handleMenuOpen}
            >
              {user.name.trim().split()[0][0].toUpperCase()}
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              autoFocus={false}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleProfile}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            <div className="mr-auto my-auto w-full px-3 flex flex-col overflow-hidden whitespace-nowrap overflow-ellipsis">
              <span className="text-xl font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {user.name.trim()}
              </span>
              <div className="text-gray-600 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
                {user.email}
              </div>
            </div>
          </div>

          <div
            id="separatingDiv"
            className="mx-1 mb-2  border-b-[1px] border-slate-400 "
          ></div>

          <div className="overflow-y-auto h-full">
            <div
              id="keyOptions"
              className="w-full py-3 flex flex-col px-1 space-y-1"
            >
              <DefaultListOption
                icon={sunIcon}
                title="My Day"
                onClick={handleMyDayDefaultList}
              />
              <DefaultListOption
                icon={starIcon}
                title="Important"
                onClick={handleImportantDefaultList}
              />
              <DefaultListOption
                icon={calendarIcon}
                title="Planned"
                onClick={handlePlannedDefaultList}
              />
              <DefaultListOption
                icon={tasksIcon}
                title="Tasks"
                onClick={handleTasksDefaultList}
              />
            </div>

            <div
              id="separatingDiv"
              className="mx-1 mb-2  border-b-[1px] border-slate-400 "
            ></div>

            <div id="customLists" className=" px-1 pb-1  ">
              {listsToDisplay &&
                listsToDisplay.map((list) => {
                  if (list) {
                    return (
                      <ListOption
                        icon={listIcon}
                        title={list.title}
                        key={list._id}
                        selectList={() => handleSelectList(list._id)}
                        listId={list._id}
                      />
                    );
                  }
                })}
            </div>
          </div>
          {/* <div id = 'separatingDiv' className="mx-1 mb-2  border-b-2 border-slate-400 "></div> */}
          <div className="w-full h-16 bg-[#fafafa] ">
            <NewList />
          </div>
        </div>
      </div>
    </>
  );
}
