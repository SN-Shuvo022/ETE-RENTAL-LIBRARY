import React from 'react';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">📘 ETE Rental Library</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/books">Books</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Signup</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ETE Rental Library 📚</h1>
          <p>Your go-to platform to borrow, review, and enjoy your favorite books</p>
          <p className="signup-message">
            If you are an ETE department student of RUET, please signup and login to your account.
          </p>
          <div className="button-container">
            <button className="cta-button" onClick={() => window.location.href = "/signup"}>Signup</button>
            <button className="cta-button" onClick={() => window.location.href = "/login"}>Login</button>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="subsections">
        <div className="subsection">
          <h2>🏫 About RUET</h2>
          <p>RUET (Rajshahi University of Engineering & Technology) is one of the leading engineering universities in Bangladesh, known for its quality education and research.</p>
        </div>

        <div className="subsection">
          <h2>📡 ETE Department</h2>
          <p>The ETE (Electronics and Telecommunication Engineering) department offers modern education in communications, networks, signal processing, and embedded systems.</p>
        </div>

        <div className="subsection quote">
          <h2>📖 Quote of the Day</h2>
          <p>"A room without books is like a body without a soul." – Marcus Tullius Cicero</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 ETE Rental Library || Designed BY SN.</p>
      </footer>
    </div>
  );
}
