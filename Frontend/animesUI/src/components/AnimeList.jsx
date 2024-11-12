import React from 'react';

const AnimeList = ({ animes }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-4 px-4">
      {animes.map((anime) => (
        <div key={anime.mal_id} className="anime-card">
          <img 
            src={anime.images.webp.image_url} 
            width={350} 
            height={350} 
            alt={anime.title} 
            className="h-full object-cover max-h-64" 
          />
          <h3 className="font-bold md:text-xl text-sm p-4">{anime.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default AnimeList;