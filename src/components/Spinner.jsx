import React from 'react'

const Spinner = () => {
  return (
    <div className='flex justify-center items-center my-4'>
        <span className='loading loading-spinner loading-lg'></span>  
    </div> // "loading" → activates loading style  |  "loading-spinner" → makes it a spinner style  |  "loading-lg" → makes it large size
  )    // (  spinner classes we using are coming from "DaisyUI"  )
}    //REM: ( Icons are usually inside <span>. tho we can use div as well no issue )

export default Spinner;