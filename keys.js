console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.movies = {
  id: process.env.MOVIES_ID
};

exports.bands = {
  id: process.env.BANDS_ID
};