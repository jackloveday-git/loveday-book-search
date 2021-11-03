// Modified SavedBooks.js by Jack Loveday

// Edited original imports
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId, saveBookIds } from '../utils/localStorage';

// Import dependencies
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

// Adjusted for Apollo and GraphQL
const SavedBooks = () => {

  // Querty and Mutation setup
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || [];
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // Delete book functionality by id
  const handleDeleteBook = async (bookId) => {

    // Check for valid user login
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    // Otherwise try to remove the book
    try {
      const removeBookData = await removeBook({
        variables: { bookId: bookId },
      });

      // Make sure response data is valid, if not throw error
      if (!removeBookData) {
        throw new Error("Book is invalid or cannot be removed");
      }

      // Book must be there so remove it
      removeBookId(bookId);

      // Catch any other errors
    } catch (err) {
      console.error(error);
    }
  };

  // Announce if content is loading
  if (loading) {
    return <h2>Content is Loading. . .</h2>;
  }

  // Verify query and storage are correct
  const savedBookIds = userData
    .savedBooks.map((book) => {
      book.bookId
    });
  saveBookIds(savedBookIds);

  // Then display our book info
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"
            }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

// Export our Saved Books
export default SavedBooks;
