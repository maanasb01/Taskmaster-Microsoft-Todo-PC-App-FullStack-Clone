import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useListContext } from "../contexts/ListContext";
import TodoStep, {AddStep} from "./TodoStep";

import addStepIcon from "../assets/addStep_icon.svg";
import checkedCircleIcon from "../assets/checked_circle.svg";
import dotsOption from "../assets/dotsOption_icon.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import deleteRedIcon from "../assets/deleteRed_icon.svg";
import plusIcon from "../assets/plus_icon.svg";
import sunIcon from "../assets/sun_icon.svg";
import sunSelectedIcon from "../assets/sunSelected_icon.svg";
import dueDateIcon from "../assets/dueDate_icon.svg";
import dueDateSetIcon from "../assets/dueDateSet_icon.svg";
import crossIcon from "../assets/cross_icon.svg";
import dueDateSetRedIcon from "../assets/dueDateSetRed_icon.svg";
import todoStarIcon from "../assets/todoStar_icon.svg";
import todoStarMarkedIcon from "../assets/todoStarMarked_icon.svg";
import { AUTH_TKN } from "../authToken";
import { useTodoContext } from "../contexts/TodoContext";
import Calender from "./Calender";
import dayjs from "dayjs";

const host = "http://localhost:3000";



function SidebarFooter() {
  const { selectedTodo, deleteTodo } = useTodoContext();

  function getDate(mongodbDateString) {
    // Step 1: Parse the MongoDB date string into a Date object
    const dateObj = new Date(mongodbDateString);

    // Step 2: Get the day of the week (e.g., "Tue")
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];

    // Step 3: Get the day of the month (e.g., "26")
    const dayOfMonth = dateObj.getUTCDate();

    // Step 4: Get the month name (e.g., "Sept")
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = months[dateObj.getUTCMonth()];

    // Step 5: Format the result as "Day, DayOfMonth MonthName"
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthName}`;

    return formattedDate; // Output: "Tue, 27 Sept"
  }

  return (
    <div id="date div" className="h-12">
      <div className="w-full h-12 absolute bottom-0 border-t bg-[#fafafa] border-gray-400 flex items-center justify-center">
        {selectedTodo && (
          <>
            <span className="text-sm text-gray-500 mx-auto">
              Created on {getDate(selectedTodo.createdAt)}
            </span>
            <img
              src={deleteIcon}
              alt=""
              className="h-7 pb-1 mr-3 cursor-pointer"
              onClick={() => deleteTodo(selectedTodo._id)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function TodoSidebar() {
  const { selectedList } = useListContext();
  const {
    todos,
    setTodos,
    editTodo,
    addTodo,
    selectTodo,
    selectedTodo,
    completedTodoStyle,
    handleOnCheck,
    handleToggleMarkedImp
  } = useTodoContext();
  const [isHovered, setIsHovered] = useState(false);
  const [steps, setSteps] = useState([]);
  const [isCalenderActive, setIsCalenderActive] = useState(false);
  const [dateValue, setDatevalue] = useState(dayjs());
  const [dueDateStyle, setDueDateStyle] = useState({});
  const [noteValue, setNoteValue] = useState("");
  const [initialNoteValue, setInitialNoteValue] = useState("");
  const [initialTitleValue, setInitialTitleValue] = useState("");
  const [todoTitle, setTodoTitle] = useState("");

  const textAreaRef = useRef(null);
  const todoTitleRef = useRef(null);

  useEffect(()=>{

    if(selectedTodo){
      setTodoTitle(selectedTodo.title);
    }
  },[selectedTodo])

  //Setting up the Styles of the Due Date div based on the due Date the todo has
  useEffect(() => {
    if (selectedTodo ) {
      if (selectedTodo.dueAt && dayjs(selectedTodo.dueAt) >= dayjs().startOf('day')) {
        setDueDateStyle({ spanCSS: "text-[#005fb8]", icon: dueDateSetIcon });
        //cssObj.spanCss = "text-[#005fb8]"
      } else if (selectedTodo.dueAt && dayjs(selectedTodo.dueAt) < dayjs().startOf('day')) {
        //cssObj.spanCss = "text-red-700"
        setDueDateStyle({ spanCSS: "text-red-700", icon: dueDateSetRedIcon });
      } else {
        //cssObj.spanCss = "font-light"
        setDueDateStyle({ spanCSS: "font-light", icon: dueDateIcon });
      }
    }
  }, [selectedTodo]);

  //Setting Todo note's value
  useEffect(() => {
    if(selectedTodo){
      setInitialTitleValue(selectedTodo.title);
      setTimeout(() => {
        todoTitleRef.current.style.height = "auto"
          const scrollHeight = todoTitleRef.current.scrollHeight;
          todoTitleRef.current.style.height = `${scrollHeight}px`;
      }, 0);
      if (selectedTodo.note) {
        setTimeout(() => {
          
          const scrollHeight = textAreaRef.current.scrollHeight;
          textAreaRef.current.style.height = `${scrollHeight}px`;
    
  }, 0);
  setNoteValue(selectedTodo.note);
      setInitialNoteValue(selectedTodo.note);
      
    } else {
      setNoteValue("");
      textAreaRef.current.style.height = "auto";
    }
  
  }
  }, [selectedTodo]);

  //Setting Todos Steps
  useEffect(() => {
    if (selectedTodo) {
   
      if(selectedTodo.steps){

        setSteps(selectedTodo.steps);
      }
  
    }
    // setTimeout(() => {

    // }, 0);
  }, [selectedTodo]);

  //Adding Due Date to the Todo
  async function handleAddDueDate() {
    try {
      let updatedTodo;
      if(dayjs(dateValue).isSame(dayjs(), 'day')){

        updatedTodo = await editTodo(
          { dueAt: dateValue.toISOString(),inMyDay:"true" },
          selectedTodo._id
        );

      }else{
        
        updatedTodo = await editTodo(
          { dueAt: dateValue.toISOString() },
          selectedTodo._id
        );
      }

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(selectedTodo._id);
      setIsCalenderActive(false);
    } catch (error) {
      console.error("Error updating todo's Due Date:", error);
    }
  }

  //Handeling Removing Due Date of Todo

  async function handleRemoveDate(e) {
    e.stopPropagation();
    console.log("Hi from remove date!");

    try {
      const updatedTodo = await editTodo(
        { dueAt: "REMOVEDATE" },
        selectedTodo._id
      );

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(selectedTodo._id);
      setIsCalenderActive(false);
    } catch (error) {
      console.error("Error updating todo's Due Date:", error);
    }
  }

  //Handles TextArea's Size when the input changes

  function textAreaAdjust() {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    setNoteValue(textAreaRef.current.value);
  }

  //Handeling Saving of the Todo Note
  async function handleSaveNoteChanges() {
    try {
      if (textAreaRef.current.value === initialNoteValue) {
        return;
      }

      let updatedTodo;

      if (textAreaRef.current.value.trim() === "") {
        updatedTodo = await editTodo({ note: "REMOVENOTE" }, selectedTodo._id);
      } else {
        updatedTodo = await editTodo(
          { note: textAreaRef.current.value },
          selectedTodo._id
        );
      }

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(selectedTodo._id);

    } catch (error) {
      console.error("Error updating todo's note:", error);
    }
  }

  //Handle exit from Title Changing, the moment enter or esc pressed.

  function handleTitleChangeExitEvent(e){

    if (e.key === "Escape" || e.key === "Enter") {
      todoTitleRef.current.blur(); // Blur the input when "Esc" is pressed
      
    }

  }

  //Title Change of Todo when the input gets blur

  async function handleTodoTitleChange(){

    try {
      if (todoTitleRef.current.value === initialTitleValue || todoTitleRef.current.value.trim() === "") {
        setTodoTitle(initialTitleValue);
        return;
      }

      const updatedTodo = await editTodo(
          { title: todoTitleRef.current.value },
          selectedTodo._id
        );
  

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(selectedTodo._id);
    
    } catch (error) {
      console.error("Error updating todo's title:", error);
    }

  }

  function todoTitleChange() {
    todoTitleRef.current.style.height = "auto";
    todoTitleRef.current.style.height = todoTitleRef.current.scrollHeight + "px";
    setTodoTitle(todoTitleRef.current.value);
  }

  //Remove from My Day
  async function handleRemoveMyDay(e) {
    e.stopPropagation();

    try {
      const updatedTodo = await editTodo(
        { inMyDay: 'false' },
        selectedTodo._id
      );

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(selectedTodo._id);
      setIsCalenderActive(false);
    } catch (error) {
      console.error("Error updating todo's My Day Property:", error);
    }
  }
  //Add to My Day
  async function handleAddToMyDay() {
    
    if(selectedTodo.inMyDay){
      return
    }

    try {
      const updatedTodo = await editTodo(
        { inMyDay: 'true' },
        selectedTodo._id
      );

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === selectedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(selectedTodo._id);
      setIsCalenderActive(false);
    } catch (error) {
      console.error("Error updating todo's My Day Property:", error);
    }
  }

  return (
    selectedTodo && (
      <div
        id="sidebar"
        className="bg-[#fafafa] h-full w-4/12 relative flex flex-col"
      >
        <div
          id="sidebar-properties-container"
          className="flex flex-col px-5 py-5 w-full h-full overflow-y-auto space-y-2"
        >
          <div id="title-steps" className="border p-3">
            <div className="flex  w-full">
              <div onClick={() => handleOnCheck(selectedTodo)}>
                {!selectedTodo.isCompleted ? (
                  <img
                    src={isHovered ? hoverCheckIcon : cirlceIcon}
                    alt=""
                    className="h-8 pb-1 mr-3"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                ) : (
                  <img
                    src={checkedCircleIcon}
                    alt=""
                    className="h-8 pb-1 mr-3"
                  />
                )}
              </div>
{/* Todo Title  */}
              <div className="pb-1 w-full">
                <textarea
                typeof="text"
                ref={todoTitleRef}
                onKeyDown={(e)=>handleTitleChangeExitEvent(e)}
                onChange={todoTitleChange}
                onBlur={handleTodoTitleChange}
                value={todoTitle??''}
                className={`text-xl  w-full pb-1 bg-inherit outline-none resize-none  ${selectedTodo.isCompleted ? completedTodoStyle : "font-semibold"}`}
                >
                </textarea>
  
              </div>
              {/* Star Icon */}

              <div className="cursor-pointer ml-auto pl-3 pt-1" onClick={()=>handleToggleMarkedImp(selectedTodo)}>
                {(selectedTodo && selectedTodo.markedImp)?<img src={todoStarMarkedIcon} alt="" className="h-5 ml-1" />:<img src={todoStarIcon} alt="star todo"  className="h-5 ml-1" />}
              </div>

            </div>
            {selectedTodo &&
              steps &&
              steps.map((step, index) => {
                return (
                  <TodoStep
                    stepTitle={step.stepTitle}
                    key={index}
                    thisStep={step}
                    steps={steps}
                    setSteps={setSteps}
                  />
                );
              })}

            <AddStep steps={steps} setSteps={setSteps} />
          </div>

          {/* Add to My Day */}
          <div
            id="add-to-myDay"
            className={`p-3 flex items-center cursor-pointer border`}
            onClick={() => handleAddToMyDay()}
          >
            <img src={selectedTodo.inMyDay?sunSelectedIcon :sunIcon} alt="" className="h-5 mr-5" />
            <span className={`text-sm ${selectedTodo.inMyDay?"text-[#005fb8]" :"font-light"}`}>
              {selectedTodo.inMyDay
                ? "Added to My Day"
                : "Add to My Day"}
            </span>
            {selectedTodo.inMyDay && (
              <div
                className="h-6 w-6 ml-auto hover:bg-gray-100 flex items-center"
                onClick={(e) => handleRemoveMyDay(e)}
              >
                <img
                  src={crossIcon}
                  alt="remove due-date"
                  className="h-4 mx-auto"
                />
              </div>
            )}
          </div>
          {/* Due Date */}
          <div
            id="due-date"
            className={`p-3 flex items-center cursor-pointer border`}
            onClick={() => setIsCalenderActive(true)}
          >
            <img src={dueDateStyle.icon} alt="" className="h-5 mr-5" />
            <span className={`text-sm ${dueDateStyle.spanCSS}`}>
              {selectedTodo.dueAt
                ? `Due ${dayjs(selectedTodo.dueAt).format("ddd, DD MMM, YYYY")}`
                : "Add a Due Date"}
            </span>
            {selectedTodo.dueAt && (
              <div
                className="h-6 w-6 ml-auto hover:bg-gray-100 flex items-center"
                onClick={(e) => handleRemoveDate(e)}
              >
                <img
                  src={crossIcon}
                  alt="remove due-date"
                  className="h-4 mx-auto"
                />
              </div>
            )}
          </div>

          {/* Note */}
          <div className=" border p-3 h-fit w-full  ">
            <textarea
              ref={textAreaRef}
              value={noteValue}
              onBlur={handleSaveNoteChanges}
              onChange={(e) => textAreaAdjust(e)}
              type="text"
              className="bg-inherit w-full h-fit outline-none p-2 resize-none overflow-hidden"
              placeholder="Add a Note"
            />
          </div>

          {isCalenderActive && (
            <Calender
              value={dateValue}
              onCancel={() => setIsCalenderActive(false)}
              onChange={(newDate) => setDatevalue(newDate)}
              onSave={handleAddDueDate}
            />
          )}
        </div>

        <SidebarFooter />
      </div>
    )
  );
}
