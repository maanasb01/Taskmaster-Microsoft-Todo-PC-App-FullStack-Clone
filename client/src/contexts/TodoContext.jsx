import { createContext, useContext, useEffect, useState } from "react";
import { useListContext } from "./ListContext";
import { AUTH_TKN } from "../authToken";

const host = "http://localhost:3000";

const TodoContext = createContext();

export const useTodoContext = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const { selectedList } = useListContext();
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState({});
  const completedTodoStyle = "line-through font-light";

  

  const selectTodo = async (todoId) => {
    try {
      const res = await fetch(`${host}/todo/info/${todoId}`, {
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

  const addTodo = async (title) => {
    try {
      const req = await fetch(`${host}/todo`, {
        method: "POST",
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
  };

  const deleteTodo = async (todoId) =>{

    try {
      const res = await fetch(`http://localhost:3000/todo/${todoId}`,{
        method:"DELETE",
        headers: {
          'Content-Type': 'application/json',
          'authorization': AUTH_TKN,
          todolist: selectedList._id,
        }
      })
      if (!res.ok) {
        throw new Error(`Failed to Delete the Task (status ${res.status})`);
      }

      if(res.ok){
        setTodos(todos.filter(todo=> (todo._id!==todoId)))
      }
      setSelectedTodo(null);
  
      
    } catch (error) {
      console.error("Error deleting the list:", error);
      
    }

  }

//updatedBody can have one property to all properties of the todo. its an object
  const editTodo = async (updatedBody,todoId) => {
    try {
      const res = await fetch(`${host}/todo/${todoId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'authorization': AUTH_TKN,
        },
        body: JSON.stringify(updatedBody)
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update the selected Todo's properties (status ${res.status})`);
      }
  
      const data = await res.json();
      const updatedTodo = data.updatedTodo;
  
      return updatedTodo; 
    } catch (error) {
      // Handle fetch or parsing errors here
      console.error("Error editing the Todo:", error);
    }
  }

  //When todo is marked check or uncheck (Method created so that same method can be used to edit from two different components)

  async function handleOnCheck(checkedTodo) {
  
    try {
      
      const updatedTodo = await editTodo({ isCompleted: `${!checkedTodo.isCompleted}` }, checkedTodo._id);
      
  
      // Only update the todos state if the updatedTodo is available
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo._id === checkedTodo._id) {
            return updatedTodo;
          }
          return todo;
        });
      });
      selectTodo(checkedTodo._id)
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }


  const editTodoStep = async (updatedBody,todoId,stepId) => {
    try {
      const res = await fetch(`${host}/todo/${todoId}/step/${stepId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'authorization': AUTH_TKN,
        },
        body: JSON.stringify(updatedBody)
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update the selected Step properties (status ${res.status})`);
      }
  
      const data = await res.json();
      const updatedTodoStep = data.updatedTodoStep;
  
      return updatedTodoStep; 
    } catch (error) {
      // Handle fetch or parsing errors here
      console.error("Error editing the Todo Step:", error);
    }
  }

  return (
    <TodoContext.Provider value={{ todos, setTodos, addTodo, deleteTodo, editTodo ,selectTodo,handleOnCheck,editTodoStep, selectedTodo, completedTodoStyle }}>
      {children}
    </TodoContext.Provider>
  );
};
