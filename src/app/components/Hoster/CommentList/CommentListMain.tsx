import React from 'react'
import CommentListMainTop from './CommentListMainTop'
import CommentListMainList from './CommentListMainList'

function CommentListMain() {
    return (
        <div className='  w-full  h-full  relative  '>
       <CommentListMainTop/>
       <CommentListMainList/>
        </div>
    )
}

export default CommentListMain
