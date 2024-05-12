import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import Library from '../Library/Library';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

function Header({ onSearchSuccess }) {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [ErrorMessage, setErrorMessage] = useState('');

  const SearchHandler = (event) => {
    if (location.pathname === '/MyBooks') {
      searchInMyBooks(searchTerm);
    } else if (location.pathname === '/Library') {
      searchInLibrary(searchTerm);
    }
  };



  
  const searchInMyBooks = (searchTerm) => {
    const Books = JSON.parse(localStorage.getItem('books')) || [];
    const FoundBooks = Books.filter(book => {
      return book.Title.toLowerCase().includes(searchTerm.toLowerCase()) 
    });
    if(FoundBooks.length > 0)
    {
        onSearchSuccess(FoundBooks);
    }
    else{
      onSearchSuccess([],'Книги не найдены');
      return;
    }
  };

  const searchInLibrary = async (searchTerm) => {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchTerm
      )}+intitle:keyes&key=AIzaSyCnlSqx_dhmPsc1g_eXngbSvHgHmNDsHaU`;

      const response = await fetch(url);
      const data = await response.json();

      console.log(data);
                  
      if (!data.items || data.items.length === 0) {
        onSearchSuccess([], 'Книги не найдены');
        return;
      }

      const foundBooks = await Promise.all(
        data.items.map(async (item) => {
          const image = item.volumeInfo.readingModes.image
            ? item.volumeInfo.imageLinks.thumbnail
            : 'https://i.pinimg.com/originals/cc/4e/19/cc4e192720949b19736ba4a486a853e4.jpg';
          const price = item.saleInfo && item.saleInfo.listPrice && item.saleInfo.listPrice.amount 
            ? `${item.saleInfo.listPrice.amount} ${item.saleInfo.listPrice.currencyCode}`
            : "Unknown price";
          return {
            Title: item.volumeInfo.title,
            Description: item.volumeInfo.description,
            Author: item.volumeInfo.authors ? item.volumeInfo.authors : ['Unknown author'],
            Image: image,
            PublishedDate : item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate : ['Unknown date'],
            Category : item.volumeInfo.categories && item.volumeInfo.categories.length > 0
              ? item.volumeInfo.categories[0]
              : 'Category not stated',
            Price : price
          };
        })
      );


      onSearchSuccess(foundBooks,'');
    } catch (error) {
      console.error('Error:', error);
    }
  };





  const EnterHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      SearchHandler(event);
    }
  };
  const handleSearchClear = () => {
    console.log("CLEARED");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand">MyLibrary v1.0</a>
        <button
          className="navbar-toggler navbar-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/MyBooks">
                My Books
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/Library">
                Library
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={EnterHandler}
            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={SearchHandler}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

}


export default Header;



/*
class Text2ImageAPI {
    constructor(url, apiKey, secretKey) {
        this.URL = url;
        this.AUTH_HEADERS = {
            'X-Key': `Key ${apiKey}`,
            'X-Secret': `Secret ${secretKey}`,
        };
    }

    async getModels() {
      const response = await axios.get(`${this.URL}key/api/v1/models`, { headers: this.AUTH_HEADERS });
      return response.data[0].id;
    }

    async generate(prompt, model, images = 1, width = 1024, height = 1024, style = 3) {
        const styles = ["KANDINSKY", "UHD", "ANIME", "DEFAULT"];
        const params = {
            type: "GENERATE",
            numImages: images,
            width,
            height,
            style: styles[style],
            generateParams: {
                query: prompt
            }
        };

        const formData = new FormData();
        const modelIdData = { value: model, options: { contentType: null } };
        const paramsData = { value: JSON.stringify(params), options: { contentType: 'application/json' } };
        formData.append('model_id',modelIdData.options);
        formData.append('params', paramsData.options);

        const response = await axios.post(`${this.URL}key/api/v1/text2image/run`, formData, {
          headers: {
              ...this.AUTH_HEADERS
              
          },
          'Content-Type': 'multipart/form-data'
      });
        const data = response.data;
        return data.uuid;
    }

    async checkGeneration(requestId, attempts = 10, delay = 10) {
      while (attempts > 0) {
        try {
          const response = await axios.get(`${this.URL}key/api/v1/text2image/status/${requestId}`, { headers: this.AUTH_HEADERS });
          const data = response.data;
          if (data.status === 'DONE') {
            return data.images;
          }
        } catch (error) {
          console.error(error);
        }
        attempts--;
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
      }
    }
    
}

(async () => {
    const api = new Text2ImageAPI('https://api-key.fusionbrain.ai/', '86CAAEBD4CA45B13E7ACF1AD96981CDB', '62AC5D0965DB73E77F55E53B74F949B4');
    const modelId = await api.getModels();
    const uuid = await api.generate("Язык программирования JavaScript", 4,1, 1024, 1024, 1);
    const images = await api.checkGeneration(uuid);
    const base64String = images[0];

    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFile('image.jpg', buffer, 'base64', (err) => {
      if (err) throw err;
      console.log('Файл сохранен!');
    });
})();
*/