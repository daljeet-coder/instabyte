import Image from 'next/image'
import React, { useState, useEffect, useRef, Dispatch } from 'react'
import { FiMoreHorizontal, FiBookmark } from 'react-icons/fi'
import { AiFillHeart, AiOutlineDelete, AiOutlineEdit, AiOutlineHeart } from 'react-icons/ai'
import { BiCommentAdd, BiMessageRounded, BiMessageSquareAdd } from 'react-icons/bi'
import { HiDotsVertical } from 'react-icons/hi'
import CardSwiper from './CardSwiper'
import { useDispatch, useSelector } from 'react-redux'
import { postDataType } from './CreateModal'
import { rootReducertype } from '@/redux/store'
import Loader from './Loader'
import { editPost } from '@/redux/postdata/post.actions'
import AlertModal from './AlertModal'
import { useRouter } from 'next/router'
type PostCardType = {
    el: postDataType,
    handleEditPost: (id: string | undefined) => void,
    handleLike: (a: boolean, el: postDataType) => void,
    handlePostDetails: (el: postDataType) => void,
    handlePostEdit: (el: postDataType) => void,
    openAddImgModal: (el: postDataType) => void,
    handleDelModal: (el: postDataType) => void,
    isLast: boolean,
    newLimit: () => void
}
const PostCard = (props: PostCardType) => {
    const loading_post = useSelector((val: rootReducertype) => val?.allPosts?.loading_post)
    const handleCommentChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setComment(e.target.value)
    }
    const [addComment, setAddComment] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [comment, setComment] = useState('')

    const { el, handleEditPost, handleLike, handlePostDetails, handlePostEdit, openAddImgModal, handleDelModal, isLast, newLimit } = props

    const user = useSelector((val: rootReducertype) => val?.user?.user)
    const dispatch: Dispatch<any> = useDispatch();
    const cardRef: any = useRef()
    const Router = useRouter()

    useEffect(() => {
        if (!cardRef?.current) return
        const observe = new IntersectionObserver(([entry]) => {
            if (isLast && entry.isIntersecting) {
                newLimit();
                observe.unobserve(entry.target)
            } else {
            }
        })
        observe.observe(cardRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLast])
    const handleComment = (el: postDataType) => {
        if (user) {
            var newComment = {
                user: user.name,
                comment: comment,
                time: new Date().toDateString()
            }
            el.comments.push(newComment)
            dispatch(editPost(el))
            setComment("")
            el.comment = ""
            setAddComment(true)
        } else {
            Router.push("/login")
        }
    }
    const toggleCaption = () => {
        setShowComment(!showComment)
    }

    return (
        <div ref={cardRef} className='mt-10 border-[1px] border-gray-600 rounded-md relative' >
            <div className='flex w-full justify-between items-center'>
                <div className='flex items-center h-12' >
                    <div className='md:w-8 md:h-8 overflow-hidden h-10 w-10 rounded-full mx-2'>
                        <Image src={el?.owner_profile} alt="User's Photo" width={200} height={200} />
                    </div>
                    <div className='mx-2 font-semibold'> <p>{el?.owner}</p>
                        <p className='text-sm font-semibold text-gray-400'> {el?.posted_on} </p>
                    </div>
                </div>
                {el.owner === user?.name ? <div className='mr-2' >
                    <FiMoreHorizontal onClick={() => handleEditPost(el._id)} className='font-bold text-xl cursor-pointer' />
                </div> : ''}
            </div>
            <div className='h-fit my-2' >
                {loading_post ? <Loader text='Loading...' /> : <CardSwiper data={el?.imgUrl} />}
            </div>
            <div className='p-2' >
                <div className='postactions flex w-full justify-between' >
                    <div className='my-1 flex items-center' >
                        {
                            el.likes?.includes(user?.name) ? <AiFillHeart onClick={() => handleLike(false, el)} className='text-2xl cursor-pointer text-red-500 animate-in zoom-in' />
                                : <AiOutlineHeart onClick={() => handleLike(true, el)} className='text-2xl cursor-pointer animate-in zoom-in' />
                        }
                        <BiMessageRounded onClick={() => handlePostDetails(el)} className='text-2xl cursor-pointer mx-2' />
                        <FiBookmark className='text-2xl cursor-pointer' />
                        {/* <FiSend className='text-2xl cursor-pointer' /> */}
                    </div>
                </div>
                <div className='border-b-2 border-gray-600 pb-3'>
                    <div className='flex items-center' >
                        <p>
                            {
                                el?.likes?.length == 0 ? "No Likes" : el.likes?.length == 1 ? `1 Like ` : ` ${el.likes?.length} Likes`
                            }
                        </p>
                        <HiDotsVertical className='' />
                        <p>
                            {
                                el?.comments?.length == 1 ? `No Comments` : el.comments?.length === 2 ? "1 Comment" : `${el.comments?.length} Comments`
                            }
                        </p>
                    </div>
                    <p className=''>
                        <span className='font-semibold ml-2'>{el?.owner}</span>
                        {
                            showComment ? <span className='mx-2' >{el.caption}</span> :
                                <span className='mx-2'> {el?.caption?.split(' ').slice(0, 4).join(' ') + "..."}
                                </span>
                        }
                        <span className='text-sm text-gray-500 cursor-pointer' onClick={toggleCaption} > {showComment ? "less" : "more"}</span>
                    </p>
                    <p className='cursor-pointer mx-2 text-sm text-gray-200 w-fit hover:underline' onClick={() => handlePostDetails(el)} >
                        view comments
                    </p>
                </div>
                <div className='flex items-center justify-around'>
                    <BiCommentAdd />
                    <input value={el.comment} type="text" placeholder='add a comment...' onChange={(e) => handleCommentChange(e)} className='outline-none bg-transparent my-3 w-3/5' />
                    <button onClick={() => handleComment(el)} disabled={comment.length < 6} className={`font-bold bg-black/60 px-3 rounded-md ${comment.length < 6 ? "text-gray-500" : ""}`}>post</button>
                </div>
            </div>
            {(el?.edit_post) ? <div onClick={() => handleEditPost(el.id)} className='fixed h-screen flex justify-center items-center right-0 top-0 left-0 bg-black/20 z-10'> <div onClick={(e) => { e.stopPropagation() }} className='z-10 bg-black/70 font-bold p-10 rounded-lg animate-in zoom-in'>
                <p onClick={() => handlePostEdit(el)} className='border-b-2 border-gray-500 my-4 text-lime-100 cursor-pointer flex items-center'><AiOutlineEdit className='mr-2' /> Edit Post</p>
                <p onClick={() => openAddImgModal(el)} className='border-b-2 border-gray-500 my-4 text-lime-100 cursor-pointer flex items-center'> <BiMessageSquareAdd className='mr-2' /> Add photos</p>
                <p onClick={() => handleDelModal(el)} className='border-b-2 border-gray-500 my-4 text-red-300 cursor-pointer flex items-center'> <AiOutlineDelete className='mr-2' /> Delete Post</p>
            </div> </div> : ""}
            {addComment && <AlertModal text='Comment Added' color="bg-green-500" />}
        </div>
    )
}

export default PostCard