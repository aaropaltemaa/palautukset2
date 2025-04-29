import { useState } from 'react';

const Books = ({ books }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const genres = [...new Set(books.flatMap(book => book.genres))];

  const filteredBooks = selectedGenre
    ? books.filter(book => book.genres.includes(selectedGenre))
    : books;

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <p>Filtering by genre: <strong>{selectedGenre}</strong></p>
      )}
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <strong>Genres:</strong>{" "}
        {genres.map(genre => (
          <button
            key={genre}
            style={{ marginRight: '5px' }}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>All genres</button>
      </div>
    </div>
  );
};

export default Books;
