import { useState } from 'react';
import './Library.css';
import '../index.css';

function Library({ foundBooks,ErrorMessage }) {
  const [selectedBook,setSelectedBook] = useState(null);

  const handleClick = (book) => {
    setSelectedBook(book);
  };

  const handleClose = () => {
    setSelectedBook(null);
  };

  const handleAddBook = () =>{
    let books = JSON.parse(localStorage.getItem('books')) || [];

    const isDublicate = books.some(book => book.Title === selectedBook.Title);

    if(!isDublicate){
      books.push(selectedBook);
      localStorage.setItem('books',JSON.stringify(books));
      console.log("Книга добавлена в список книг:", books);
      handleClose();
    }
    else{
      console.log("Эта книга уже есть в списке");
    }
  }

  return (
    <>
      <div className='Library_Container'>
        {ErrorMessage ? (
            <div className="flex error_container">
              <img src="https://img.icons8.com/clouds/100/error.png" alt="" />
              <h1 className="Error_label">{ErrorMessage}</h1>
            </div>
        ) : (
        <div className='Books_Container'>
          {foundBooks.map((book, index) => (
            <div onClick={() => handleClick(book)} key={index} className="card">
              <img src={book.Image}/>
              <div className="card-content">
                <h3>{book.Title}</h3>
                <h3>{book.Author}</h3>
              </div>
            </div>
            ))}
        </div>
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
            <button type='button' className='btn btn-success' onClick={handleAddBook}>Add to My Books</button>
          </div>
          <div>
            <button className="Close_btn btn btn-light" type="button" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Library;
