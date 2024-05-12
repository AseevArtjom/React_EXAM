import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyBooks from './MyBooks/MyBooks.jsx';
import Library from './Library/Library.jsx';
import Header from './Header/Header.jsx';

function App(){
  const [FoundBooks,setFoundBooks] = useState([]);
  const [ErrorMessage, setErrorMessage] = useState('');


  const handleSearchSuccess = (books,message) =>{
    setFoundBooks(books);
    setErrorMessage(message);
  }
  return(<>
  <Router>
      <div>
        <Header onSearchSuccess={handleSearchSuccess}/>
        <Routes>
          <Route path="/" element={<MyBooks />} />
          <Route path="/MyBooks" element={<MyBooks foundBooks={FoundBooks} ErrorMessage={ErrorMessage}/>} />
          <Route path="/Library" element={<Library foundBooks={FoundBooks} ErrorMessage={ErrorMessage}/>} />
        </Routes>
      </div>
    </Router>
  </>);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
export default App;

// https://www.googleapis.com/books/v1/volumes?q=Robinson%20Crusoe+intitle:keyes&key=AIzaSyCnlSqx_dhmPsc1g_eXngbSvHgHmNDsHaU
