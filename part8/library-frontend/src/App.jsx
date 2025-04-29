import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommended from './components/Recommended';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`);

      // Update the cache with the new book
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
    onError: (error) => {
      console.error("Subscription error:", error.message);
    },
  });

  const padding = {
    padding: 5,
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);

  if (books.loading || authors.loading) {
    return <div>loading...</div>;
  }

  if (books.error || authors.error) {
    console.error('GraphQL Error:', books.error || authors.error);
    return <div>Error loading data</div>;
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">authors</Link>
        <Link style={padding} to="/books">books</Link>
        {token ? (
          <>
            <Link style={padding} to="/add">add book</Link>
            <Link style={padding} to="/recommend">recommend</Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Authors authors={authors.data.allAuthors} />} />
        <Route path="/books" element={<Books books={books.data.allBooks} />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/recommend" element={<Recommended />} />
      </Routes>
    </Router>
  );
};

export default App;
