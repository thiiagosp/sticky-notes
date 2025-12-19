import { Note } from "../../context/notes/NotesContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useNotes } from "../../hooks/useNotes";

import "./Header.scss";

function Header() {
  const { addNote } = useNotes();
  const isDesktop = useIsDesktop();

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now(),
      content: "",
      position: { x: 0, y: 0 },
      dimensions: { width: 150, height: 150 },
    };
    addNote(newNote);
  };

  return (
    <header className="header">
      <button
        className="header__button"
        onClick={handleAddNote}
        disabled={!isDesktop}
      >
        Add
      </button>
      <h1 className="header__logo">Sticky Notes</h1>
      <button
        className="header__button header__button--delete"
        disabled={!isDesktop}
      >
        Delete
        <span className="header__tooltip">Drag a note here to delete</span>
      </button>
    </header>
  );
}

export default Header;
