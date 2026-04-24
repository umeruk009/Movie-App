import { useState } from 'react'

const SearchBar = ({onSearch}) => {
  const [term, setTerm] = useState("");

  //     "e" here is just an event object(can be named anything)
  const handleSubmit=(e)=>{   // means: "When form submits, give me the event details that just happend(eg submit)" -> react gives that info to your func
    e.preventDefault();   // this here mean "Do NOT reload the page" | without it whole app would refresh, states reset an inputs gone..
    onSearch(term);   
  }
  
  
  return ( // "onSubmit" is a built-in browser event for forms.
    <form onSubmit={handleSubmit} className='flex gap-2 justify-center mb-4'>
      <input
        type="text"
        onChange={(e) => setTerm(e.target.value)}
        value={term}     //value here is simply used to control the component input
        placeholder='Search Movies...'
        className='input input-success'
      >
      </input>

      <button type='submit' className='btn btn-success' >Search</button>
    </form>
  )
}

export default SearchBar