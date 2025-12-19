import "./App.scss";
import Header from "./components/Header";
import NotesContainer from "./components/NotesContainer";
import { NotesProvider } from "./context/notes/NotesProvider";

function App() {
  return (
    <NotesProvider>
      <div className="App">
        <Header />
        <NotesContainer />
      </div>
    </NotesProvider>
  );
}

export default App;
