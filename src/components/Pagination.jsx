import React from 'react'

export const Pagination = ({currentPage, totalPages, onPageChange}) => {

    const range = 3     //num of pages to show on each side of the current page
    const start = Math.max(1, currentPage - range)    //first page in the visible range  |  Math.max(1, -1) → 1
    const end = Math.min(totalPages, currentPage + range)    //Last page num in the visible range  |  Math.min(500, 502) → 500
    const pages = Array.from({ length: end - start + 1}, (_,i) => start + i)   //array of visible page nums

    

  return (
    <div className='flex justify-center mt-4 flex-wrap gap-1'>

        <button className='btn' disabled={currentPage === 1} onClick={()=>onPageChange(currentPage - 1)}> « </button>  


        {start > 1 && <button className='btn btn-disabled'>...</button>}  

        {pages.map((page) => (
            <button 
            onClick={()=> onPageChange(page)}
            className={`btn ${page === currentPage ? "btn-primary" : ""} `} 
            key={page}
            >

                {page}

            </button>
        ))}

        {end < totalPages && <button className='btn btn-disabled'>...</button>}


        <button 
        className='btn' 
        disabled={currentPage===totalPages}
        onClick={()=>onPageChange(currentPage+1)}
        > » </button>

    </div>
  )
}
