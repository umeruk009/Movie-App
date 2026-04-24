import { useState, useEffect } from "react"

import SearchBar from "./components/searchBar.jsx"
import Spinner from "./components/Spinner.jsx"
import ErrorMessage from "./components/ErrorMessage.jsx"
import MovieCard from "./components/MovieCard.jsx"
import { MovieDetailModal } from "./components/MovieDetailModal.jsx"
import { Pagination } from "./components/Pagination.jsx"



function App() {
  const [initialized, setInitialized] = useState(false)
  const [movies, setMovies] = useState( [] )
  const [favourites, setFourites] = useState( [] )
  const [searchTerm, setSearchTerm] = useState( "" )
  const [page, setPage] = useState( 1 )
  const [totalPages, setTotalPages] = useState( 0 )
  const [loading, setLoading] = useState( false )
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)   //this state basically controls if modal is open or not & Which movie the modal is showing
  const [view, setView] = useState("search")    // search or favourites


  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  
  useEffect(()=>{
    //                         Go into browser storage(localStorage) and get value saved under "favourites" (It returns a STRING.)
    const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    // Means:  Get stored string  →  Convert string into array  →  If nothing exists  → use empty array
    // "JSON.parse(string)"  →  Turns string into real JavaScript object.

    setFourites(storedFavourites);
    setInitialized(true);
  }, [])
  

  useEffect(()=>{
    if(initialized){
      localStorage.setItem("favourites", JSON.stringify(favourites));   // Saving to localStorage 
      //                             "JSON.stringify" converts object → string.
    }
  },[favourites, initialized])


  useEffect(()=>{

    if(view === "favourites"){
      setMovies([]);
      return;
    }



    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try{

        let url;

        if(searchTerm)
        {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`;
        }
        else{
          url= `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
        }

        const response = await fetch(url);
        if(!response.ok){
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json()
        console.log(data)

        setMovies(data.results)   //passing "data.results" inside "setMovies()" simply sets "movies = data.results"
        
        //setTotalPages(data.total_pages);     //same thing here
        setTotalPages(Math.min(data.total_pages || 0, 500));       //if we want to limit max pages(to 500 for example)
        //                         " || 0 " simply adds here a condition of when theres no page i.e "data.total_pages = false" (good for safety)

      }
      catch(err){
        setError("Failed to fetch movies.");
      }
      finally{  //"finally" here will always run even if error happens
        setLoading(false);
      }
    }

    fetchMovies();

  }, [searchTerm, page, view]);
  




  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  }

  const handlePageChange = (newPage) => {
    if(newPage >= 1 && newPage <= totalPages)
    {
      setPage(newPage)
    }
  }



  const openModal = async (movieId) => {
    setError(null);

    try{
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}` )

      if(!res.ok)
      {
        throw new Error("Failed to fetch movie details")
      }
      const data = await res.json();
      setSelectedMovie(data)

      
    }catch(err){
      setError("Failed to fetch movie details.")
      }
  }
  
  const closeModal = () =>{
    setSelectedMovie(null)
  }



  const toggleFavourite = (movie) => {    //"movie" is passed from MovieCard  & is full movie object.
    const exisits = favourites.some( (f)=>f.id===movie.id );    
    // ".some()" means: Check if at least one item matches condition → If yes: returns true.
    //above part is basically checking if movie exisits in favs or not...
    
    
    
    if(exisits)
    {      //if movie exists in favs, keep all others except that(i,e remove it)
      setFourites(favourites.filter( (f)=>f.id !== movie.id ))
    }
    else{   //otherwise add movie in favs
      const favMovie = {     //making movie equal to "favMovies" (i,e storing it)
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        vote_average: movie.vote_average
      };
      setFourites([...favourites, favMovie]);  //now passing that "favMovies" in array of favs along with the existing favs
    }
  }


  const isFavourite = (movieId) => favourites.some((f)=>f.id === movieId)   //"f" here is just an item coming from "favourites" 
  //"isFavourite" just storing true/flase   |  ".some()" always returns a boolean(checks if atleast one matches the condition or not)


  const displayMovies = view === "search"? movies: favourites
  







  return (
  <div className="container mx-auto p-4 flex flex-col items-center text-center">

    <h1 className="text-4xl font-extrabold mb-6 drop-shadow-2xl">
      Movie App
    </h1>



  <div className="tabs tabs-border mb-6" >
    <a className={`tab text-lg ${ view==="search"? "tab-active": ""}`} 
    onClick={()=>{  
      setView("search"); 
      setPage(page);
    }}> 
    Search / Popular
    </a>



    <a  className={`tab text-lg ${ view==="favourites"? "tab-active": ""}`} 
      onClick={ ()=> setView("favourites") } 
    > 
    Favourites ({favourites.length})  
    </a>

  </div>




  {view === "search" && (      // "w-full" always mean full width of its parent. not screen, not anyhting else, always parent
    <div className="w-full max-w-md mb-6">  

      <SearchBar onSearch={handleSearch}/>

    </div>  //"onSearch" is just a prop name and can be anything.. has nothing in common with onClick
  )}


  { loading && <Spinner/> }


  { error && <ErrorMessage message={error} /> }


  { !loading && !error && displayMovies.length === 0 && (
    <div>
      No Movies Found.{""}{view === "favourites"
      ? " Add some to your favourites!" 
      : " Try a different search."}
    </div>
  ) } 


  { !loading && !error && displayMovies.length>0 && (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {
        displayMovies.map((movie)=>(
          <MovieCard 
          key={movie.id} 
          movie={movie} 
          onToggleFavourite={toggleFavourite} 
          isFavourite={isFavourite(movie.id)} 
          onViewDetails={openModal}
          />
        ))
      }

    </div>
  ) }



  {view === "search" && totalPages > 1 && !loading && !error && (
    <div className="mt-6">

      <Pagination 
      currentPage={page} 
      totalPages={totalPages} 
      onPageChange={handlePageChange}
      />

    </div>
  )}


  {selectedMovie && (
    <MovieDetailModal 
    movie={selectedMovie}   //sending FULL movie object into modal
    isFavourite={isFavourite(selectedMovie.id)} 
    onToggleFavourite = {()=>toggleFavourite(selectedMovie)} 
    onClose={closeModal} />
  )}

  </div>
  )
  

}
export default App




function MyButton()
{
  const [count, setCount] = useState(0);

  function handleClcik()
  {
    setCount(count+1);
  }

  return(
    <button onClick={handleClcik}>
      clicked - {count}
    </button>

  )
}

