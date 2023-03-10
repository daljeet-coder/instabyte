import { deletePostt } from '@/redux/postdata/post.actions'
import React, { Dispatch, useEffect } from 'react'
import { useDispatch} from 'react-redux'
type postDataAll = {
    id: string | undefined,
    closeModal: () => void
}
const DeleteModal = (props: postDataAll) => {
    useEffect(() => {
        document.body.className="overflow-y-hidden";
        return ()=>{
        document.body.className="overflow-y-auto";
        }
    }, [])
    const dispatch: Dispatch<any> = useDispatch();
    const { id, closeModal } = props;
    const deletePost = (id: string) => {
        dispatch((deletePostt(id)))
        closeModal();
    }
    return (
        <>
            {id && <div onClick={closeModal} className='fixed h-screen flex justify-center items-center right-0 top-0 left-0 bg-black/60 z-10' >
                <div onClick={(e) => { e.stopPropagation() }} className='bg-darkbg/80 flex flex-col h-32 md:h-[15%] rounded-xl md:w-[40%] items-center justify-around px-5 animate-in zoom-in'>
                    <p className='text-red-400'>Are You Sure To Delete the Post?</p>
                    <div className='md:w-1/3 w-5/6 flex justify-around'>
                        <button onClick={() => deletePost(id)} className='border-2 border-red-400 px-3 rounded-md' >Yes</button>
                        <button onClick={closeModal} className='border-2 border-gray-500 px-3 rounded-md'>cencel</button>
                    </div>
                </div>

            </div>}
        </>
    )
}

export default DeleteModal