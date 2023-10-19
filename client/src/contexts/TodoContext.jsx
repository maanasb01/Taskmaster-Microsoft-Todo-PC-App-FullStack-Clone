import { createContext, useContext, useEffect, useState } from "react";
import { useListContext } from "./ListContext";
import { AUTH_TKN } from "../authToken";

const host = "http://localhost:3000";

const TodoContext = createContext();

export const useTodoContext = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const { selectedList, defaultList, setDefaultList, getDefaultTasksList } =
    useListContext();
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState({});
  const completedTodoStyle = "line-through font-light";

  const selectTodo = async (todoId) => {
    try {
      const res = await fetch(`${host}/todo/info/${todoId}`, {
        credentials: 'include',
        headers: {
          authorization: AUTH_TKN,
        },
      });
      let data = await res.json();
      if (!res.ok) {
        //Error message
        console.error(data.message);
        return;
      }
      setSelectedTodo(data);
    } catch (error) {
      console.error("Error occored while getting the todo's data: " + error);
    }
  };

  //Get all Todos of a Given list id

  const getTodosData = async (listId) => {
    try {
      const res = await fetch(`http://localhost:3000/todo/${listId}`, {
        credentials: 'include',
        headers: {
          authorization: AUTH_TKN,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data. Status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error in getTodosData:", error);
      throw error; // Rethrow the error to propagate it up to the calling code.
    }
  };

  //Get all Todos of a user irrespective of Id.

  const getAllTodos = async () => {
    try {
      const res = await fetch(`http://localhost:3000/todo/`, {
        headers: {
          authorization: AUTH_TKN,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data. Status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error in getAllTodos:", error);
      throw error; // Rethrow the error to propagate it up to the calling code.
    }
  };

  //Add a Task for a given list
  const addTodo = async (title) => {
    if (!defaultList && selectedList) {
      try {
        const req = await fetch(`${host}/todo`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            authorization: AUTH_TKN,
            todolist: selectedList._id,
          },
          body: JSON.stringify({ title }),
        });
        const newTodo = await req.json();
        if (req.ok) {
          setTodos([...todos, newTodo]);
          return true;
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (defaultList === "Tasks" && !selectedList) {
      const defaultTasksList = await getDefaultTasksList();

      try {
        const req = await fetch(`${host}/todo`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            authorization: AUTH_TKN,
            todolist: defaultTasksList._id,
          },
          body: JSON.stringify({ title }),
        });
        const newTodo = await req.json();
        if (req.ok) {
          setTodos([...todos, newTodo]);
          return true;
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (defaultList === "MyDay" && !selectedList) {
      const defaultTasksList = await getDefaultTasksList();
      try {
        const req = await fetch(`${host}/todo`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            authorization: AUTH_TKN,
            todolist: defaultTasksList._id,
          },
          body: JSON.stringify({ title, inMyDay: "true" }),
        });
        const newTodo = await req.json();
        if (req.ok) {
          setTodos([...todos, newTodo]);
          return true;
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (defaultList === "Important" && !selectedList) {
      const defaultTasksList = await getDefaultTasksList();
      try {
        const req = await fetch(`${host}/todo`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            authorization: AUTH_TKN,
            todolist: defaultTasksList._id,
          },
          body: JSON.stringify({ title, markedImp: "true" }),
        });
        const newTodo = await req.json();
        if (req.ok) {
          setTodos([...todos, newTodo]);
          return true;
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const deleteTodo = async (todoId) => {
    let listToDeleteFrom;

    if (selectedList && !defaultList) {
      listToDeleteFrom = selectedList;
    } else if (!selectedList && defaultList) {
      listToDeleteFrom = await getDefaultTasksList();
    }

    try {
      const res = await fetch(`http://localhost:3000/todo/${todoId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          authorization: AUTH_TKN,
          todolist: listToDeleteFrom._id,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to Delete the Task (status ${res.status})`);
      }

      if (res.ok) {
        setTodos(todos.filter((todo) => todo._id !== todoId));
      }
      setSelectedTodo(null);
    } catch (error) {
      console.error("Error deleting the list:", error);
    }
  };

  //updatedBody can have one property to all properties of the todo. its an object
  const editTodo = async (updatedBody, todoId) => {
    try {
      const res = await fetch(`${host}/todo/${todoId}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          authorization: AUTH_TKN,
        },
        body: JSON.stringify(updatedBody),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to update the selected Todo's properties (status ${res.status})`
        );
      }

      const data = await res.json();
      const updatedTodo = data.updatedTodo;

      return updatedTodo;
    } catch (error) {
      // Handle fetch or parsing errors here
      console.error("Error editing the Todo:", error);
    }
  };

  //When todo is marked check or uncheck (Method created so that same method can be used to edit from two different components)

  async function handleOnCheck(checkedTodo) {
    try {
      const updatedTodo = await editTodo(
        { isCompleted: `${!checkedTodo.isCompleted}` },
        checkedTodo._id
      );

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === checkedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(checkedTodo._id);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  //Toggle the Starred Todo
  async function handleToggleMarkedImp(checkedTodo) {
    try {
      const updatedTodo = await editTodo(
        { markedImp: `${!checkedTodo.markedImp}` },
        checkedTodo._id
      );

      if (!updatedTodo.markedImp && defaultList === "Important") {
        setTodos(todos.filter((todo) => todo._id !== updatedTodo._id));
        setSelectedTodo(null);
        return;
      }

      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === checkedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(checkedTodo._id);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  const editTodoStep = async (updatedBody, todoId, stepId) => {
    try {
      const res = await fetch(`${host}/todo/${todoId}/step/${stepId}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          authorization: AUTH_TKN,
        },
        body: JSON.stringify(updatedBody),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to update the selected Step properties (status ${res.status})`
        );
      }

      const data = await res.json();
      const updatedTodoStep = data.updatedTodoStep;

      return updatedTodoStep;
    } catch (error) {
      // Handle fetch or parsing errors here
      console.error("Error editing the Todo Step:", error);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        getTodosData,
        getAllTodos,
        addTodo,
        deleteTodo,
        editTodo,
        selectTodo,
        handleOnCheck,
        editTodoStep,
        handleToggleMarkedImp,
        selectedTodo,
        setSelectedTodo,
        completedTodoStyle,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
