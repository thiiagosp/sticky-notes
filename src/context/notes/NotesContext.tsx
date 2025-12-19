import { createContext } from "react";

export interface Note {
  id: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  content: string;
}

interface NotesContextValue {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: number) => void;
  updateNote: (id: number, data: Partial<Note>) => void;
}

export const NotesContext = createContext<NotesContextValue | undefined>(
  undefined
);
