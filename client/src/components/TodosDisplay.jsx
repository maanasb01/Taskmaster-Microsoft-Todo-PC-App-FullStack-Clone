import React, { useEffect, useRef, useState } from "react";
import { useListContext } from "../contexts/ListContext";
import plusIcon from "../assets/plus_icon.svg";
import checkedCircleIcon from "../assets/checked_circle.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import listIconWhite from "../assets/list_icon_white.svg";
import dropdownArrow from "../assets/dropdownArrow_icon.svg";
import todoStarIcon from "../assets/todoStar_icon.svg";
import todoStarMarkedIcon from "../assets/todoStarMarked_icon.svg";
import { useTodoContext } from "../contexts/TodoContext";
import TodoSidebar from "./TodoSidebar";
import { useLoading } from "../contexts/LoadingContext";

//The Input Task Component
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
  const { completedTodoStyle, handleOnCheck, handleToggleMarkedImp } =
    useTodoContext();

  return (
    <div
      className={`bg-[#f6f6f6] flex items-center  px-2 w-5/6 mx-auto h-14 rounded-md hover:bg-[#e1e0e0] cursor-default`}
      onClick={onSelect}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleOnCheck(thisTodo);
        }}
        className=""
      >
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
        className={`w-[90%] overflow-hidden whitespace-nowrap overflow-ellipsis ${
          thisTodo.isCompleted ? completedTodoStyle : ""
        }`}
      >
        {todoTitle}
      </span>

      <div
        className="cursor-pointer ml-auto mr-1 pt-1 bg-inherit h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleMarkedImp(thisTodo);
        }}
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
  const {
    selectedList,
    selectedListName,
    defaultList,
    setIsNavColOpen,
    isNavColOpen,
  } = useListContext();
  const { todos, setTodos, addTodo, selectTodo, selectedTodo, getTodosData } =
    useTodoContext();
  const [isCompletedTaskOpen, setIsCompletedTaskOpen] = useState(true);
  const { loading } = useLoading();

  useEffect(() => {
    if (selectedList) {
      const getTodos = async () => {
        const fetchedTodos = await getTodosData(selectedList._id);
        setTodos(fetchedTodos);
      };

      getTodos();
    }
  }, [selectedList]);

  return (
    <>
      <div id="display" className="bg-[#5c70be] w-full  overflow-hidden flex">
        <div
          className={`w-full  flex flex-col  mx-auto  relative overflow-hidden ${
            selectedTodo ? "hidden" : ""
          } md:block`}
        >
          {/* Nav Toggle */}
          <div className="px-3 pt-5  lg:hidden">
            <img
              src={listIconWhite}
              alt="toggle"
              className="h-6 cursor-pointer"
              onClick={() => setIsNavColOpen(!isNavColOpen)}
            />
          </div>
          {/* List Name */}
          <div className=" w-5/6 mx-auto h-[10%] lg:h-1/6 bg-[#5c70be] flex items-center">
            <span className="text-white text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis">
              {selectedListName
                ? selectedListName
                : "Select a List to Display its Tasks"}
            </span>
          </div>

          <div className="w-full h-[70%] md:h-[72%] lg:h-[70%] xl:h-4/6 2xl:h-[74%] bg-[#5c70be] overflow-y-auto space-y-1">
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
              ) : !loading ? (
                <p className="w-5/6 mx-auto text-2xl text-slate-100">
                  {defaultList && defaultList === "Planned"
                    ? "Your Tasks with Due Date Appear here..."
                    : "Add Your Tasks Here..."}
                </p>
              ) : (
                <p className="w-5/6 mx-auto text-2xl text-slate-100">
                  Loading...
                </p>
              )}
            </div>

            {todos &&
            todos.length !== 0 &&
            todos.map &&
            todos.some((todo) => todo.isCompleted) ? (
              <div id="completedTasks" className="w-full ">
                <div className="w-5/6 mx-auto mt-4">
                  <div
                    className="  border bg-gray-300 rounded-md w-fit p-2 flex items-center cursor-pointer"
                    onClick={() => setIsCompletedTaskOpen(!isCompletedTaskOpen)}
                  >
                    <img
                      src={dropdownArrow}
                      alt=""
                      className={`h-5 transition-transform ${
                        isCompletedTaskOpen ? "" : "rotate-180"
                      }`}
                    />
                    <span>Completed</span>
                  </div>
                </div>
                <div
                  id="completedTasksContainer"
                  className={`space-y-1 mt-1 ${
                    isCompletedTaskOpen ? "" : "hidden"
                  }`}
                >
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

          {defaultList !== "Planned" ? <AddTask onSubmit={addTodo} /> : null}
        </div>
        {/* //The sidebar for Todo */}

        <div
          id="todo-sidebar-wrapper"
          className={` ${
            selectedTodo ? "w-full md:w-[75%] xl:w-[52%]" : "w-0"
          } duration-300`}
        >
          <TodoSidebar />
        </div>
      </div>
    </>
  );
}

TodoComponent.defaultProps = {
  todoTitle: "Todo Title",
};
