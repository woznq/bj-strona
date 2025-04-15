// import React from 'react';

// const Home = () => {
//   return <h2>Home Page</h2>;
// };

// export default Home;


import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/games/')
      .then(res => setGames(res.data))
      .catch(err => console.error('Błąd ładowania gier:', err));
  }, []);

  return (
    <div>
      <h1>Lista Gier z Django API</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            🎮 <strong>{game.title}</strong> — {game.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
