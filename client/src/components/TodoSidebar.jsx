import React, { useEffect, useRef, useState } from "react";
import { useListContext } from "../contexts/ListContext";
import TodoStep, { AddStep } from "./TodoStep";
import checkedCircleIcon from "../assets/checked_circle.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import deleteIcon from "../assets/delete_icon.svg";
import sunIcon from "../assets/sun_icon.svg";
import sunSelectedIcon from "../assets/sunSelected_icon.svg";
import dueDateIcon from "../assets/dueDate_icon.svg";
import dueDateSetIcon from "../assets/dueDateSet_icon.svg";
import crossIcon from "../assets/cross_icon.svg";
import dueDateSetRedIcon from "../assets/dueDateSetRed_icon.svg";
import todoStarIcon from "../assets/todoStar_icon.svg";
import todoStarMarkedIcon from "../assets/todoStarMarked_icon.svg";
import { useTodoContext } from "../contexts/TodoContext";
import Calender from "./Calender";
import dayjs from "dayjs";

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
  const { defaultList } = useListContext();
  const {
    todos,
    setTodos,
    editTodo,
    selectTodo,
    selectedTodo,
    setSelectedTodo,
    completedTodoStyle,
    handleOnCheck,
    handleToggleMarkedImp,
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

  const todoNoteRef = useRef(null);
  const todoTitleRef = useRef(null);

  useEffect(() => {
    if (selectedTodo) {
      setTodoTitle(selectedTodo.title);
    }
  }, [selectedTodo]);

  //Setting up the Styles of the Due Date div based on the due Date the todo has
  useEffect(() => {
    if (selectedTodo) {
      if (
        selectedTodo.dueAt &&
        dayjs(selectedTodo.dueAt) >= dayjs().startOf("day")
      ) {
        setDueDateStyle({ spanCSS: "text-[#005fb8]", icon: dueDateSetIcon });
        //cssObj.spanCss = "text-[#005fb8]"
      } else if (
        selectedTodo.dueAt &&
        dayjs(selectedTodo.dueAt) < dayjs().startOf("day")
      ) {
        //cssObj.spanCss = "text-red-700"
        setDueDateStyle({ spanCSS: "text-red-700", icon: dueDateSetRedIcon });
      } else {
        //cssObj.spanCss = "font-light"
        setDueDateStyle({ spanCSS: "font-light", icon: dueDateIcon });
      }
    }
  }, [selectedTodo]);

  //Setting Todo note's value and title height
  useEffect(() => {
    if (selectedTodo) {
      setInitialTitleValue(selectedTodo.title);
      setTimeout(() => {
        const dummyTextArea = document.createElement("textarea");
        dummyTextArea.style.height = "auto";

        dummyTextArea.value = selectedTodo.title;
        dummyTextArea.className = " text-xl   bg-inherit  ";
        document.body.appendChild(dummyTextArea);
        const scrollHeight = dummyTextArea.scrollHeight;
        document.body.removeChild(dummyTextArea);
        if (todoTitleRef.current) {
          todoTitleRef.current.style.height = "auto";
          todoTitleRef.current.style.height = `${scrollHeight}px`;
        }
      }, 0);

      if (selectedTodo.note) {
        setNoteValue(selectedTodo.note);
        setInitialNoteValue(selectedTodo.note);
        setTimeout(() => {
          const dummyTextArea = document.createElement("textarea");
          dummyTextArea.style.height = "auto";

          dummyTextArea.className = "text-xs p-2 bg-inherit  ";
          dummyTextArea.value = selectedTodo.note;
          document.body.appendChild(dummyTextArea);
          const scrollHeight = dummyTextArea.scrollHeight;
          document.body.removeChild(dummyTextArea);

          if (todoNoteRef.current) {
            todoNoteRef.current.style.height = "auto";
            todoNoteRef.current.style.height = `${scrollHeight}px`;
          }
        }, 0);
      } else {
        setNoteValue("");
        todoNoteRef.current.style.height = "auto";
      }
    }
  }, [selectedTodo]);

  //Setting Todos Steps
  useEffect(() => {
    if (selectedTodo) {
      if (selectedTodo.steps) {
        setSteps(selectedTodo.steps);
      }
    }
  }, [selectedTodo]);

  //Adding Due Date to the Todo
  async function handleAddDueDate() {
    try {
      let updatedTodo;
      if (dayjs(dateValue).isSame(dayjs(), "day")) {
        updatedTodo = await editTodo(
          { dueAt: dateValue.toISOString(), inMyDay: "true" },
          selectedTodo._id
        );
      } else {
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
    todoNoteRef.current.style.height = "auto";
    todoNoteRef.current.style.height = todoNoteRef.current.scrollHeight + "px";
    setNoteValue(todoNoteRef.current.value);
  }

  //Handeling Saving of the Todo Note
  async function handleSaveNoteChanges() {
    try {
      if (todoNoteRef.current.value === initialNoteValue) {
        return;
      }

      let updatedTodo;

      if (todoNoteRef.current.value.trim() === "") {
        updatedTodo = await editTodo({ note: "REMOVENOTE" }, selectedTodo._id);
      } else {
        updatedTodo = await editTodo(
          { note: todoNoteRef.current.value },
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

  function handleTitleChangeExitEvent(e) {
    if (e.key === "Escape" || e.key === "Enter") {
      todoTitleRef.current.blur(); // Blur the input when "Esc" is pressed
    }
  }

  //Title Change of Todo when the input gets blur

  async function handleTodoTitleChange() {
    try {
      if (
        todoTitleRef.current.value === initialTitleValue ||
        todoTitleRef.current.value.trim() === ""
      ) {
        setTodoTitle(initialTitleValue);
        setTimeout(() => {
          setSelectedTodo(selectedTodo);
        }, 10);

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
    todoTitleRef.current.style.height =
      todoTitleRef.current.scrollHeight + "px";
    setTodoTitle(todoTitleRef.current.value);
  }

  //Remove from My Day
  async function handleRemoveMyDay(e) {
    e.stopPropagation();

    try {
      const updatedTodo = await editTodo(
        { inMyDay: "false" },
        selectedTodo._id
      );

      if (!updatedTodo.inMyDay && defaultList === "MyDay") {
        setTodos(todos.filter((todo) => todo._id !== updatedTodo._id));
        setSelectedTodo(null);
        return;
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
      console.error("Error updating todo's My Day Property:", error);
    }
  }
  //Add to My Day
  async function handleAddToMyDay() {
    if (selectedTodo.inMyDay) {
      return;
    }

    try {
      const updatedTodo = await editTodo({ inMyDay: "true" }, selectedTodo._id);

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

  //Handle exit from Title Changing, the moment enter or esc pressed.

  function handleTitleChangeExitEventNote(e) {
    if (e.key === "Escape") {
      todoNoteRef.current.blur(); // Blur the input when "Esc" is pressed
    }
  }

  return (
    selectedTodo && (
      <div
        id="sidebar"
        className={`bg-[#fafafa] h-full w-full relative flex flex-col pb-4 pt-9`}
      >
        {/* Close the Sidebar */}
        <div
          className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center absolute right-6 top-1 cursor-pointer"
          onClick={() => setSelectedTodo(null)}
        >
          <img src={crossIcon} alt="" className="h-5" />
        </div>

        <div
          id="sidebar-properties-container"
          className="flex flex-col px-5 pb-5 w-full h-full overflow-y-auto space-y-2 "
        >
          <div id="title-steps" className="border p-3 w-full">
            <div className="flex  h-fit  w-full">
              <div
                onClick={() => handleOnCheck(selectedTodo)}
                className="h-fit"
              >
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
                  onKeyDown={(e) => handleTitleChangeExitEvent(e)}
                  onChange={todoTitleChange}
                  onBlur={handleTodoTitleChange}
                  value={todoTitle ?? ""}
                  className={`text-xl  w-full  bg-inherit outline-none resize-none  ${
                    selectedTodo.isCompleted
                      ? completedTodoStyle
                      : "font-semibold"
                  }`}
                ></textarea>
              </div>
              {/* Star Icon */}

              <div
                className="cursor-pointer h-fit ml-auto pl-3 pt-1"
                onClick={() => handleToggleMarkedImp(selectedTodo)}
              >
                {selectedTodo && selectedTodo.markedImp ? (
                  <img src={todoStarMarkedIcon} alt="" className="h-5 ml-1" />
                ) : (
                  <img
                    src={todoStarIcon}
                    alt="star todo"
                    className="h-5 ml-1"
                  />
                )}
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
            <img
              src={selectedTodo.inMyDay ? sunSelectedIcon : sunIcon}
              alt=""
              className="h-5 mr-5"
            />
            <span
              className={`text-sm ${
                selectedTodo.inMyDay ? "text-[#005fb8]" : "font-light"
              }`}
            >
              {selectedTodo.inMyDay ? "Added to My Day" : "Add to My Day"}
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
          <div className=" border p-3 w-full ">
            <textarea
              ref={todoNoteRef}
              value={noteValue}
              onKeyDown={(e) => handleTitleChangeExitEventNote(e)}
              onBlur={handleSaveNoteChanges}
              onChange={(e) => textAreaAdjust(e)}
              type="text"
              className="bg-inherit w-full  outline-none p-2 resize-none"
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
