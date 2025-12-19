import { ReactNode, useEffect, useRef, useState } from "react";
import { Note, NotesContext } from "./NotesContext";

function initializeNotes() {
  const saved = localStorage.getItem("notes");
  return saved ? JSON.parse(saved) : [];
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(initializeNotes);

  const timerRef = useRef<number | null>(null);

  const addNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateNote = (id: number, data: Partial<Note>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...data } : note))
      );
    }, 50);
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
}
