import React, { useEffect, useRef, useState } from "react";
import addStepIcon from "../assets/addStep_icon.svg";
import checkedCircleIcon from "../assets/checked_circle.svg";
import dotsOption from "../assets/dotsOption_icon.svg";
import hoverCheckIcon from "../assets/hover_check_circle.svg";
import cirlceIcon from "../assets/circle_icon.svg";
import deleteRedIcon from "../assets/deleteRed_icon.svg";
import plusIcon from "../assets/plus_icon.svg";
import { useTodoContext } from "../contexts/TodoContext";
import { useLoading } from "../contexts/LoadingContext";
import { HOST } from "../config/config";

//The AddStep Component to add a new Step
export function AddStep(props) {
  const { setSteps} = props;

  const [isAddingStep, setIsAddingStep] = useState(false);
  const stepInputRef = useRef(null);
  const { selectedTodo, selectTodo } = useTodoContext();
  const { fetchWithLoader } = useLoading();

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
      const res = await fetchWithLoader(
        `${HOST}/todo/${selectedTodo._id}/step`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stepTitle: stepInputRef.current.value }),
        }
      );

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

//The Popup Menu for Step
function StepsMenu(props) {
  const { thisStep, steps, setSteps, setIsMenuOpen, menuButtonRef } = props;
  const menuRef = useRef(null);
  const { selectedTodo, selectTodo, addTodo } = useTodoContext();
  const { fetchWithLoader } = useLoading();

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
      const res = await fetchWithLoader(
        `${HOST}/todo/${selectedTodo._id}/step/${thisStep._id}`,
        {
          method: "DELETE",
          credentials: "include",
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

  async function handlePromoteStepToTask() {
    const isTaskAdded = await addTodo(thisStep.stepTitle);

    if (isTaskAdded) {
      handleDeleteStep();
    }
  }

  return (
    <div
      ref={menuRef}
      className="border-2 absolute right-5 bg-white p-1 shadow-2xl"
    >
      <ul className="space-y-1">
        <li>
          <div
            className="flex items-center py-3 px-5 hover:bg-gray-100 cursor-pointer"
            onClick={handlePromoteStepToTask}
          >
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

export default function TodoStep(props) {
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

  //Step title edit
  async function handleStepTitleChange(e) {
    e.preventDefault();

    try {
      const updatedTodoStep = await editTodoStep(
        { stepTitle: `${editInputref.current.value}` },
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
      setIsEditing(false);
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
            <form onSubmit={(e) => handleStepTitleChange(e)}>
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
