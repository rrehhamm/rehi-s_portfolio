import { useState } from "react";
import { BookOpen } from "lucide-react";
import { books } from "../../../data/books";
import EmptyState from "../../shared/EmptyState";
import "./books.css";

function BookCover({ book }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !book.cover || failed;

  return (
    <div className="book-card">
      <span className="book-card__cover">
        {showFallback ? (
          <BookOpen size={22} strokeWidth={1.4} />
        ) : (
          <img src={book.cover} alt="" loading="lazy" onError={() => setFailed(true)} />
        )}
      </span>
      <p className="book-card__title">{book.title}</p>
      {book.author && <p className="book-card__author">{book.author}</p>}
    </div>
  );
}

export default function BooksWindow() {
  return (
    <div className="win">
      <div className="win-scroll">
        <p className="win-lead" style={{ marginBottom: 14 }}>Books I've read.</p>

        {books.length === 0 ? (
          <EmptyState icon="book" title="No books yet" text="Add books with cover images to books.js." />
        ) : (
          <div className="books-window__grid">
            {books.map((b) => <BookCover key={b.id || b.title} book={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
