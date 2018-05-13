import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="header">
    <div className="container">
      <a href="#" className="header-logo"></a>
      <form className="form form_header">
        <div className="socials">
        <a href="https://github.com/rstormsf/PresalePool" target="_blank" className="socials-i socials-i_github"></a>
      </div>
      </form>
    </div>
  </header>
);
