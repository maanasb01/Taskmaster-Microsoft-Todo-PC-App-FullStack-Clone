import React, { useEffect, useRef, useState } from "react";
import { useListContext } from "../contexts/ListContext";
import addStepIcon from "../assets/addStep_icon.svg";
import checkedCircleIcon from "../assets/checked_circle.svg";
import dotsOption from "../assets/dotsOption_icon.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import deleteRedIcon from "../assets/deleteRed_icon.svg";
import plusIcon from "../assets/plus_icon.svg";
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

function AddStep(props) {
  const { setSteps, steps } = props;

  const [isAddingStep, setIsAddingStep] = useState(false);
  const stepInputRef = useRef(null);
  const { selectedTodo, selectTodo } = useTodoContext();

  const handleEscKeyPress = (event) => {
    if (event.key === "Escape" && stepInputRef.current) {
      stepInputRef.current.blur(); // Blur the input when "Esc" is pressed
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

  function addStepOnClick() {
    setIsAddingStep(true);

    setTimeout(() => {
      if (stepInputRef.current) {
        stepInputRef.current.focus();
      }
    }, 0);
  }

  async function handleAddStep(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${host}/todo/${selectedTodo._id}/step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: AUTH_TKN,
        },
        body: JSON.stringify({ stepTitle: stepInputRef.current.value }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      // setSteps([...steps, data]);
      setSteps((prevSteps) => [...prevSteps, data]);

      setIsAddingStep(false);
      selectTodo(selectedTodo._id);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      {isAddingStep ? (
        <div className="flex items-center px-3 py-2">
          <img src={cirlceIcon} alt="" className="h-5  mr-3" />

          <div className="w-full">
            <span className="text-sm ">
              <form onSubmit={(e) => handleAddStep(e)}>
                <input
                  type="text"
                  onBlur={() => setIsAddingStep(false)}
                  ref={stepInputRef}
                  className="outline-none h-full bg-inherit"
                  placeholder="Add next step"
                />
              </form>
            </span>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center px-3 py-2 cursor-text"
          onClick={addStepOnClick}
        >
          <img src={addStepIcon} alt="" className="h-5  mr-3" />

          <div className="w-full">
            <span className="text-sm text-[#005fb8]">Add Step</span>
          </div>
        </div>
      )}
    </>
  );
}

function StepsMenu(props) {
  const { thisStep, steps, setSteps, setIsMenuOpen, menuButtonRef } = props;
  const menuRef = useRef(null);
  const { selectedTodo, selectTodo } = useTodoContext();

  useEffect(() => {
    const handler = (e) => {
      if (
        !menuRef.current.contains(e.target) &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const escHandler = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  });

  async function handleDeleteStep() {
    try {
      const res = await fetch(
        `${host}/todo/${selectedTodo._id}/step/${thisStep._id}`,
        {
          method: "DELETE",
          headers: {
            authorization: AUTH_TKN,
          },
        }
      );

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setSteps(steps.filter((step) => step._id !== thisStep._id));
      setIsMenuOpen(false);
      selectTodo(selectedTodo._id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      ref={menuRef}
      className="border-2 absolute right-5 bg-white p-1 shadow-2xl"
    >
      <ul className="space-y-1">
        <li>
          <div className="flex items-center py-3 px-5 hover:bg-gray-100 cursor-pointer">
            <img src={plusIcon} alt="" srcset="" className="h-4 mr-5 " />
            <span>Promote to Tasks</span>
          </div>
        </li>
        <div className="w-full h-[1px] bg-gray-300"></div>
        <li>
          <div
            className="flex items-center py-3 px-5 hover:bg-gray-100 cursor-pointer"
            onClick={handleDeleteStep}
          >
            <img src={deleteRedIcon} alt="" srcset="" className="h-5 mr-5 " />
            <span className="text-red-600">Delete</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

function TodoStep(props) {
  const { stepTitle, thisStep, steps, setSteps } = props;
  const [isStepHovered, setIsStepHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(stepTitle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const editInputref = useRef(null);
  const menuButtonRef = useRef(null);
  const { editTodoStep, selectedTodo, selectTodo, completedTodoStyle } =
    useTodoContext();

  useEffect(() => {
    const handleEscKeyPress = (event) => {
      if (event.key === "Escape") {
        editInputref.current.blur(); // Blur the input when "Esc" is pressed
      }
    };
    // Add event listener when the component mounts
    window.addEventListener("keydown", handleEscKeyPress);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleEscKeyPress);
    };
  }, []);

  function handleEditing() {
    setIsEditing(true);

    setTimeout(() => {
      if (editInputref.current) {
        editInputref.current.focus();
        editInputref.current.select();
      }
    }, 0);
  }

  async function handleOnStepCheck() {
    try {
      const updatedTodoStep = await editTodoStep(
        { isCompleted: `${!thisStep.isCompleted}` },
        selectedTodo._id,
        thisStep._id
      );

      // Only update the todos state if the updatedTodo is available
      setSteps((prevTodoSteps) => {
        return prevTodoSteps.map((todoStep) => {
          if (todoStep._id === thisStep._id) {
            return updatedTodoStep;
          }
          return todoStep;
        });
      });
      selectTodo(selectedTodo._id);
    } catch (error) {
      console.error("Error updating todo Step:", error);
    }
  }

  return (
    <>
      <div className="flex items-center  hover:bg-gray-100 px-3 py-2">
        <div onClick={handleOnStepCheck}>
          {thisStep.isCompleted ? (
            <img src={checkedCircleIcon} alt="" className="h-5 mr-3" />
          ) : (
            <img
              src={isStepHovered ? hoverCheckIcon : cirlceIcon}
              alt=""
              className="h-5  mr-3"
              onMouseEnter={() => setIsStepHovered(true)}
              onMouseLeave={() => setIsStepHovered(false)}
            />
          )}
        </div>

        <div className="w-full">
          {isEditing ? (
            <form>
              <input
                type="text"
                ref={editInputref}
                className="bg-inherit outline-none"
                value={title}
                onChange={() => setTitle(editInputref.current.value)}
                onBlur={() => setIsEditing(false)}
              />
            </form>
          ) : (
            <div className="flex items-center ">
              <label
                className={`text-sm cursor-text ${
                  thisStep.isCompleted ? completedTodoStyle : ""
                }`}
                onClick={handleEditing}
              >
                {stepTitle}
              </label>
              <div
                className="h-8 w-8 mb-1 ml-auto hover:bg-gray-200 flex items-center"
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <img
                  src={dotsOption}
                  alt=""
                  srcset=""
                  className="h-5 mx-auto cursor-pointer"
                />
              </div>
            </div>
          )}
          <div className="w-full bg-slate-200 h-[1px] "></div>
        </div>
      </div>

      {isMenuOpen && (
        <StepsMenu
          thisStep={thisStep}
          steps={steps}
          setSteps={setSteps}
          setIsMenuOpen={setIsMenuOpen}
          menuButtonRef={menuButtonRef}
        />
      )}
    </>
  );
}

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
      console.log("inside setting calender styles")
      if (selectedTodo.dueAt && dayjs(selectedTodo.dueAt) >= dayjs()) {
        setDueDateStyle({ spanCSS: "text-[#005fb8]", icon: dueDateSetIcon });
        //cssObj.spanCss = "text-[#005fb8]"
      } else if (selectedTodo.dueAt && dayjs(selectedTodo.dueAt) <= dayjs()) {
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
      if (selectedTodo.note) {
      setInitialNoteValue(selectedTodo.note);
      setNoteValue(selectedTodo.note);
    } else {
      setNoteValue("");
    }
  
  }
  }, [selectedTodo]);

  //Setting Todos Steps
  useEffect(() => {
    if (selectedTodo) {
      console.log("Updating steps from sidebar component");
      if(selectedTodo.steps){

        setSteps(selectedTodo.steps);
      }
      console.log(steps);
    }
    // setTimeout(() => {

    // }, 0);
  }, [selectedTodo]);

  //Adding Due Date to the Todo
  async function handleAddDueDate() {
    try {
      const updatedTodo = await editTodo(
        { dueAt: dateValue.toISOString() },
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
            <div className="flex  ">
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

              {/* {!isTitleEditing ? (
                <span
                  className={`text-xl ${
                    selectedTodo.isCompleted ? completedTodoStyle : ""
                  }`}
                >
                  {selectedTodo.title}
                </span>
              ) : (
                <form>
                  <input type="text" />
                </form>
              )} */}

              <div className="">
                <input
                typeof="text"
                ref={todoTitleRef}
                onKeyDown={(e)=>handleTitleChangeExitEvent(e)}
                onChange={()=>setTodoTitle(todoTitleRef.current.value)}
                onBlur={handleTodoTitleChange}
                  value={todoTitle??''}
                  className={`text-xl w-full h-10 pb-4 bg-inherit outline-none resize-none overflow-hidden whitespace-nowrap overflow-ellipsis  ${selectedTodo.isCompleted ? completedTodoStyle : "font-semibold"}`}
                >
                </input>
  
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
              className="bg-inherit w-full outline-none p-2 resize-none overflow-hidden"
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
