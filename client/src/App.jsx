import { useState } from "react";
import NavigationCol from "./components/NavigationCol";
import TodosDisplay from "./components/TodosDisplay";
import { ListProvider } from "./contexts/ListContext";
import { TodoProvider } from "./contexts/TodoContext";
import LandingPage from "./pages/LandingPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LandingPage />

      {/* <ListProvider>
    <TodoProvider>
    <div className='flex h-screen w-screen bg-slate-200'>

    <NavigationCol />
    <TodosDisplay/>

    
    </div>
    </TodoProvider>
    </ListProvider >
     */}
    </>
  );
}

export default App;
