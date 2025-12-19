import { useRef } from "react";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useNotes } from "../../hooks/useNotes";
import Card from "../Card";
import "./NotesContainer.scss";

function NotesContainer() {
  const { notes } = useNotes();
  const isDesktop = useIsDesktop();

  const containerRef = useRef<HTMLDivElement>(null);

  if (!isDesktop) {
    return (
      <div className="notes-container">
        <p className="notes-container__message">
          Sticky Notes app is only available on desktop screens.
        </p>
      </div>
    );
  }

  return (
    <div className="notes-container" ref={containerRef}>
      {notes.map((note) => (
        <Card key={note.id} note={note} containerRef={containerRef} />
      ))}
      <button
        className="notes-container__button notes-container__button--delete"
        disabled={!isDesktop}
      >
        X
        <span className="notes-container__tooltip">
          Drag a note here to delete
        </span>
      </button>
    </div>
  );
}

export default NotesContainer;
