import { useEffect, useRef, useState } from "react";
import { Note } from "../../context/notes/NotesContext";
import { useNotes } from "../../hooks/useNotes";
import "./Card.scss";

interface CardProps {
  note: Note;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function Card({ note, containerRef }: CardProps) {
  const [dimensions, setDimensions] = useState(note.dimensions);
  const [position, setPosition] = useState(note.position);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [overDelete, setOverDelete] = useState(false);

  const { updateNote, deleteNote } = useNotes();

  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  const checkOverDelete = () => {
    const deleteButton = document.querySelector(
      ".notes-container__button--delete"
    ) as HTMLElement;
    if (!deleteButton || !cardRef.current) return false;

    const rect = deleteButton.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    return !(
      cardRect.right < rect.left ||
      cardRect.left > rect.right ||
      cardRect.bottom < rect.top ||
      cardRect.top > rect.bottom
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;

        setDimensions({
          width: Math.max(150, startPos.current.width + deltaX),
          height: Math.max(150, startPos.current.height + deltaY),
        });
      } else if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const cardRect = cardRef.current!.getBoundingClientRect();
        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;
        const newPos = {
          x: Math.max(0, Math.min(newX, containerRect.width - cardRect.width)),
          y: Math.max(
            0,
            Math.min(newY, containerRect.height - cardRect.height)
          ),
        };
        setPosition(newPos);

        setOverDelete(checkOverDelete());
      }
    };

    const handleMouseUp = () => {
      if (isDragging && overDelete) {
        deleteNote(note.id);
      } else {
        updateNote(note.id, {
          position,
          dimensions,
          content: cardRef.current?.querySelector("textarea")?.value || "",
        });
      }

      setIsResizing(false);
      setIsDragging(false);
      setOverDelete(false);
    };

    if (isResizing || isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    isDragging,
    position,
    dimensions,
    overDelete,
    note.id,
    updateNote,
    deleteNote,
    containerRef,
  ]);

  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height,
    };
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (isResizing) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  return (
    <div
      ref={cardRef}
      className="card"
      onMouseDown={handleDrag}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
        cursor: isDragging ? "grabbing" : "grab",
        backgroundColor: overDelete ? "#ccc" : undefined, // gray when over delete
      }}
    >
      <textarea
        className="card__content"
        placeholder="Type your note..."
        defaultValue={note.content || ""}
        onChange={(e) => updateNote(note.id, { content: e.target.value })}
      />
      <div
        className="card__resize-handle card__resize-handle--corner"
        onMouseDown={handleResize}
      />
    </div>
  );
}

export default Card;
