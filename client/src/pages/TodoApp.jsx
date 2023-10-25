import React from "react";
import { ListProvider } from "../contexts/ListContext";
import { TodoProvider } from "../contexts/TodoContext";
import NavigationCol from "../components/NavigationCol";
import TodosDisplay from "../components/TodosDisplay";
import TodoSidebar from "../components/TodoSidebar";
import TopLoader from "react-top-loader";
import { LoadingProvider, useLoading } from "../contexts/LoadingContext";




// function TopLoaderComponent() {
//   const { loading } = useLoading();

//   return <TopLoader show={loading} color="#61d800" />;
// }



function TodoApp() {

  return (
    <>
      <ListProvider>
        <TodoProvider>
          <div className="flex h-screen w-screen bg-slate-200 ">
            <NavigationCol />
            <TodosDisplay />
          </div>
        </TodoProvider>
      </ListProvider>
    </>
  );
}

export default TodoApp;
