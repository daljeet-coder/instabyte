import { rootReducertype } from '@/redux/store'
import axios from 'axios'
import Image from 'next/image'
import React,{useState,Dispatch,useEffect, ChangeEventHandler} from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import {useDispatch, useSelector} from 'react-redux'
import { postUrl, resetPost } from '../redux/ImageUrl/actions'
import { getAllPosts, postDetails } from '../redux/postdata/post.actions'

type createmodalTypes = {
    createModal: boolean,
    handleModal: ()=>void
}
export type commontsType = {user:string,comment:string}
export type postDataType={
        [x: string]: any
        caption: string,
        imgUrl: string[],
        owner: string,
        owner_profile:string,
        posted_on:string,
        likes: string[],
        id: string | number,
        comments:commontsType[],
        show_Caption:boolean,
        edit_post:boolean
}

const CreateModal = (props: createmodalTypes) => {
    const user = useSelector((val:rootReducertype)=>val?.user.user)
    const {isloading,img,iserror,isdone} = useSelector((val:rootReducertype)=>val?.imgUrl)
    const dispatch:Dispatch<any> = useDispatch()
    const [caption, setCaption]  = useState("Caption...")
    useEffect(() => {
      dispatch(getAllPosts())
    }, [dispatch])
    const handleCaption = (e: { target: { value: React.SetStateAction<string> } })=>{
        setCaption(e.target.value)
    }
    const handleImage = (e:any)=>{
    let form = new FormData()
    form.append("image",e.target.files[0])
    dispatch(postUrl(form))
}
const handleClose = ()=>{
    dispatch(resetPost())
    props.handleModal()
}
const handlePost = ()=>{
    let datestr = new Date().toLocaleDateString("en-US",{day:"numeric",month:"short"})
    const postData:postDataType = {
        caption: caption,
        imgUrl:[img],
        owner: user.name,
        owner_profile:user.profile,
        likes: [],
        id:'',
        posted_on:datestr,
        comments:[
          {
            user:"",
            comment:""
          }
        ],
        show_Caption:false,
        edit_post:false
      }
      dispatch(postDetails(postData))
      handleClose()
      props.handleModal()
}
   return (<>
        {props.createModal||<div className={`fixed top-0 left-0 bg-black/60 right-0 w-full min-h-screen flex items-center justify-center z-10`} >
            {
                iserror?<div> Image Upload Failed ☹️ <span onClick={handleClose} className='underline font-bold text-sm'>close</span> </div>:                
                <div className='m-auto w-5/6 md:w-96 bg-gray-900 text-center text-white rounded-lg max-h-[80vh] overflow-auto'>
                <div className='w-full relative'>
               {isloading?<h3 className='text-2xl'>Please Wait...</h3> :<h3 className='text-2xl'>Create a Post </h3> }
                <AiOutlineClose onClick={handleClose} className='absolute right-0 top-0 text-xl mt-2 mr-2 font-bold cursor-pointer'/>
                </div>
                {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    isloading?<img src="https://cdn.dribbble.com/users/563824/screenshots/3633228/media/d876c7712d969c0656302b16b16af2cc.gif" />:
                    //  eslint-disable-next-line @next/next/no-img-element
                    <Image className='w-5/6 m-auto bg-black/80 my-4' src={img} alt="" />
                }
                {isdone?<div className='flex w-11/12 m-auto justify-around py-1 mb-4' > 
                    <input type="text" placeholder='Post Caption here' className='bg-gray-600 rounded-lg pl-2  outline-none' value={caption} onChange={handleCaption} />
                    <button onClick={handlePost} className='bg-blue-800 px-4 py-1 rounded-lg w-fit m-auto'>Post</button>
                     </div>:
                <div className='bg-blue-700 py-1 px-4 w-fit m-auto mb-4'>
                 <label htmlFor='imageUpload'>Select from Device
                    <input onChange={handleImage} type="file" className='hidden' id="imageUpload" accept="image"/>
                </label>
                </div>}
            </div>}
        </div>}
        </>
    )
}

export default CreateModal