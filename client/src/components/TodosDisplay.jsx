import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useListContext } from "../contexts/ListContext";
import plusIcon from "../assets/plus_icon.svg";
import addStepIcon from "../assets/addStep_icon.svg";
import checkedCircleIcon from "../assets/checked_circle.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
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
      className={`bg-[#f6f6f6] flex items-center  px-2 w-full mx-auto h-12 rounded-md opacity-80 hover:opacity-100 cursor-text absolute bottom-7 left-0 right-0 ${
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
  const {todos,setTodos, editTodo, completedTodoStyle,selectTodo, handleOnCheck} = useTodoContext();
  
  return (
    <div
      className={`bg-[#e1e0e0] flex items-center  px-2 w-full mx-auto h-14 rounded-md hover:bg-[#f6f6f6] cursor-default`}
      onClick={onSelect}
    >
      <div onClick={()=>handleOnCheck(thisTodo)}>
        {!thisTodo.isCompleted
        ? 
        <img
          src={isHovered ? hoverCheckIcon : cirlceIcon}
          alt=""
          className="h-9 py-2 mr-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        :
        <img
          src={checkedCircleIcon}
          alt=""
          className="h-9 py-2 mr-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />}

      </div>

      <span className={`overflow-hidden whitespace-nowrap overflow-ellipsis ${thisTodo.isCompleted ? completedTodoStyle:""}`}>{todoTitle}</span>
    </div>
  );
}


export default function TodosDisplay() {
  const { selectedList,lists } = useListContext();
  const { todos, setTodos, addTodo, selectTodo, selectedTodo } =
    useTodoContext();
  const [listTitle, setListTitle] = useState("")

  const getTodosData = async (url) => {
    const res = await fetch(url, {
      headers: {
        authorization: AUTH_TKN,
      },
    });
    const data = await res.json();

    return data;
  };

  useEffect(()=>{

    setTimeout(() => {
      
      if(selectedList){
        setListTitle(selectedList.title);
        console.log("list Title updated: "+listTitle)
      }else{
        setListTitle("Select a List to Get its Tasks")
      }
    }, 0);


  },[selectedList,lists])

  useEffect(() => {

    // setTimeout(() => {
      
    // }, 0);
    if (selectedList) {
      const getTodos = async () => {
        const fetchedTodos = await getTodosData(
          `http://localhost:3000/todo/${selectedList._id}`
        );
        setTodos(fetchedTodos);
      };

      getTodos();
    }

  }, [selectedList]);

  return (
    <>
      <div id="display" className="bg-[#5c70be] w-10/12   flex">
        <div className="w-7/12 mx-auto relative">
          <div className="  h-1/6 bg-[#5c70be] flex items-center">
            <span className="text-white text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis">
              {/* {(selectedList && selectedList.title)
                ? selectedList.title
                : "Select a List to Display its Tasks"} */}
                {listTitle}
            </span>
          </div>
          <div className="  h-4/6 bg-[#5c70be] overflow-y-auto space-y-1">
            {todos && todos.length !== 0 && todos.map ? (
              todos.map((todo, index) => (
                <TodoComponent
                  key={index}
                  todoTitle={todo.title}
                  onSelect={() => selectTodo(todo._id)}
                  thisTodo = {todo}
                />
              ))
            ) : (
              <p className="text-2xl text-slate-100">Add Your Tasks Here...</p>
            )}
          </div>
          <AddTask onSubmit={addTodo} />
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
