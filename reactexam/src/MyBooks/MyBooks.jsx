import { useEffect, useState } from "react";
import './MyBooks.css';
import '../index.css';

function MyBooks({foundBooks,ErrorMessage}) {
    const [books,setBooks] = useState([]);
    const [selectedBook,setSelectedBook] = useState(null);

    useEffect(() =>{
      if(foundBooks && foundBooks.length > 0){
        setBooks(foundBooks)
      }
    },[foundBooks]);

    const handleClick = (book) => {
      setSelectedBook(book);
    };

    const handleClose = () => {
      setSelectedBook(null);
    };

    const handleDeleteBook = () =>{
      const Books = JSON.parse(localStorage.getItem('books')) || [];
      const index = Books.findIndex(book => book.Title === selectedBook.Title);

      if(index !== -1){
        Books.splice(index,1);
        localStorage.setItem('books',JSON.stringify(Books));

        console.log(`Книга "${selectedBook.Title}" удалена из `,Books);
        setBooks(Books);
        handleClose();
      }
      else{
        console.log("Error");
      }
    }

    useEffect(() =>{
      const Localbooks = JSON.parse(localStorage.getItem('books')) || [];
      setBooks(Localbooks);
    },[]);
    return (
      <>
        <div className="Library_Container">
        {books.length === 0 || ErrorMessage ? (
          <div className="flex error_container">
            <img src="https://img.icons8.com/clouds/100/error.png" alt="" />
            <h1 className="Error_label">{ErrorMessage}</h1>
          </div>
        ) 
        : 
        (
          books.map((book, index) => (
            <div onClick={() => handleClick(book)} key={index} className="card">
              <img src={book.Image} alt={book.Title} />
              <div className="card-content">
                <h3>{book.Title}</h3>
                <h3>{book.Author}</h3>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedBook.Title}</h2>
            <h3>{selectedBook.Author}</h3>
            <h4>{selectedBook.PublishedDate}</h4>
            <h4>{selectedBook.Category}</h4>
            <h4>{selectedBook.Price}</h4>
            <p className='desc'>{selectedBook.Description}</p>
            <button className="btn btn-danger" onClick={handleDeleteBook}>Delete from My Books</button>
          </div>
          <div>
            <button className="Close_btn btn btn-light" type="button" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      </>
    );
  }
  export default MyBooks;