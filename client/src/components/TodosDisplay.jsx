import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useListContext } from "../contexts/ListContext";
import plusIcon from "../assets/plus_icon.svg";
import addStepIcon from "../assets/addStep_icon.svg";
import checkedCircleIcon from "../assets/checked_circle.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import dropdownArrow from "../assets/dropdownArrow_icon.svg";
import todoStarIcon from "../assets/todoStar_icon.svg";
import todoStarMarkedIcon from "../assets/todoStarMarked_icon.svg";
import { AUTH_TKN } from "../authToken";
import { useTodoContext } from "../contexts/TodoContext";
import TodoSidebar from "./TodoSidebar";

const host = "http://localhost:3000";

function AddTask(props) {
  const { onSubmit } = props;
  const [isInputFocused, setInputFocused] = useState(false);

  const inputRef = useRef(null);

  const handleInputDivClick = () => {
    // Focus on the input element when the div is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(inputRef.current.value);
    if (success) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className={`bg-[#f6f6f6] flex items-center  px-2 w-5/6 mx-auto h-12 rounded-md opacity-80 hover:opacity-100 cursor-text absolute bottom-7 left-0 right-0 ${
        isInputFocused ? "opacity-100" : "opacity-80"
      }`}
      onClick={handleInputDivClick}
    >
      {!isInputFocused ? (
        <img src={plusIcon} alt="" className="h-9 py-2 mr-3" />
      ) : (
        <img src={cirlceIcon} alt="" className="h-9 py-2 mr-3" />
      )}
      <form className="w-full" onSubmit={(e) => handleOnSubmit(e)}>
        <input
          type="text"
          placeholder="Add a Task"
          ref={inputRef}
          className="w-full bg-[#f6f6f6] outline-none"
          onBlur={() => setInputFocused(false)}
          onFocus={() => setInputFocused(true)}
        />
      </form>
    </div>
  );
}

function TodoComponent(props) {
  const { todoTitle, onSelect, thisTodo } = props;
  const [isHovered, setIsHovered] = useState(false);
  const {
    todos,
    setTodos,
    editTodo,
    completedTodoStyle,
    selectTodo,
    handleOnCheck,
    handleToggleMarkedImp,
  } = useTodoContext();

  return (
    <div
      className={`bg-[#f6f6f6] flex items-center  px-2 w-5/6 mx-auto h-14 rounded-md hover:bg-[#e1e0e0] cursor-default`}
      onClick={onSelect}
    >
      <div onClick={() => handleOnCheck(thisTodo)} className="">
        {!thisTodo.isCompleted ? (
          <img
            src={isHovered ? hoverCheckIcon : cirlceIcon}
            alt=""
            className="h-9 py-2 mr-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        ) : (
          <img
            src={checkedCircleIcon}
            alt=""
            className="h-9 py-2 mr-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        )}
      </div>

      <span
        className={`overflow-hidden whitespace-nowrap overflow-ellipsis ${
          thisTodo.isCompleted ? completedTodoStyle : ""
        }`}
      >
        {todoTitle}
      </span>

      <div
        className="cursor-pointer ml-auto mr-1 pt-1 bg-inherit"
        onClick={() => handleToggleMarkedImp(thisTodo)}
      >
        {thisTodo && thisTodo.markedImp ? (
          <img src={todoStarMarkedIcon} alt="" className="h-5 ml-1" />
        ) : (
          <img src={todoStarIcon} alt="star todo" className="h-5 ml-1" />
        )}
      </div>
    </div>
  );
}

export default function TodosDisplay() {
  const { selectedList, lists,selectedListName, setSelectedListName,defaultList } = useListContext();
  const { todos, setTodos, addTodo, selectTodo, selectedTodo, getTodosData } =
    useTodoContext();
  const [listTitle, setListTitle] = useState("");
  const [isCompletedTaskOpen, setIsCompletedTaskOpen] = useState(true)



  // useEffect(() => {
  //   setTimeout(() => {
  //     if (selectedList) {
  //       setSelectedListName(selectedList.title);
  //       console.log("list Title updated: " + listTitle);
  //     } else {
  //       setSelectedListName("Select a List to Get its Tasks");
  //     }
  //   }, 0);
  // }, [selectedList, lists]);

  useEffect(() => {
    // setTimeout(() => {

    // }, 0);
    if (selectedList) {
      console.log("inside UseEffect")
      const getTodos = async () => {
        const fetchedTodos = await getTodosData(selectedList._id);
        setTodos(fetchedTodos);
      };

      getTodos();
    }else{
      console.log("Selected List is Null")
      return
    }
  }, [selectedList]);

  return (
    <>
      <div id="display" className="bg-[#5c70be] w-10/12   flex">
        <div className="w-8/12 mx-auto relative">
          <div className=" mx-5  h-1/6 bg-[#5c70be] flex items-center">
            <span className="text-white text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis">
              {selectedListName??"Select a List to Display its Tasks"}
          
            </span>
          </div>
          <div className="w-full h-4/6 bg-[#5c70be] overflow-y-auto space-y-1">
            <div className="w-full  bg-[#5c70be] space-y-1">
              {todos && todos.length !== 0 && todos.map ? (
                todos.map((todo, index) => {
                  if (!todo.isCompleted) {
                    return (
                      <TodoComponent
                        key={index}
                        todoTitle={todo.title}
                        onSelect={() => selectTodo(todo._id)}
                        thisTodo={todo}
                      />
                    );
                  }
                })
              ) : (
                <p className="mx-5 text-2xl text-slate-100">
                  Add Your Tasks Here...
                </p>
              )}
            </div>

            {todos &&
            todos.length !== 0 &&
            todos.map &&
            todos.some((todo) => todo.isCompleted) ? (
              <div id="completedTasks" className="w-full ">
                  <div className="w-5/6 mx-auto mt-4">
                    <div className="  border bg-gray-300 rounded-md w-fit p-2 flex items-center cursor-pointer" onClick={()=>setIsCompletedTaskOpen(!isCompletedTaskOpen)}>
                      <img src={dropdownArrow} alt="" className={`h-5 transition-transform ${isCompletedTaskOpen?"":"rotate-180"}`}  />
                      <span>Completed</span>
                    </div>
                    </div>
                <div id="completedTasksContainer" className={`space-y-1 mt-1 ${isCompletedTaskOpen?"":"hidden"}`}>
                  {todos.map((todo, index) => {
                    if (todo.isCompleted) {
                      return (
                        <TodoComponent
                          key={index}
                          todoTitle={todo.title}
                          onSelect={() => selectTodo(todo._id)}
                          thisTodo={todo}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {defaultList!=="Planned"?<AddTask onSubmit={addTodo}/>:null}
        </div>
        {/* //The sidebar for Todo */}
        <TodoSidebar />
      </div>
    </>
  );
}

TodoComponent.defaultProps = {
  todoTitle: "Todo Title",
};
