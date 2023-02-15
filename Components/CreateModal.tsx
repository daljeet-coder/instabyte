import { rootReducertype } from '@/redux/store'
import Image from 'next/image'
import React,{useState,Dispatch,useEffect} from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FcStackOfPhotos } from 'react-icons/fc'
import {useDispatch, useSelector} from 'react-redux'
import { postUrl, resetPost } from '../redux/ImageUrl/actions'
import { postDetails } from '../redux/postdata/post.actions'

type createmodalTypes = {
    handleModal: ()=>void
}
export type commontsType = {user:string,comment:string,time:string}
export type postDataType={
        [x: string]: any
        caption: string,
        imgUrl: string[],
        owner: string,
        owner_profile:string,
        posted_on:string,
        likes: string[],
        comments:commontsType[],
        show_Caption:boolean,
        edit_post:boolean,
        _id?:string
}

const CreateModal = (props: createmodalTypes) => {
    useEffect(() => {
        document.body.className="overflow-y-hidden";
        return ()=>{
        document.body.className="overflow-y-auto";
        }
    }, [])
    const user = useSelector((val:rootReducertype)=>val?.user.user)
    const {isloading,img,iserror,isdone} = useSelector((val:rootReducertype)=>val?.imgUrl)
    const dispatch:Dispatch<any> = useDispatch()
    const [caption, setCaption]  = useState("Caption...")
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
        posted_on:datestr,
        comments:[
          {
            user:"",
            comment:"",
            time:""
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
        <div onClick={handleClose} className={`fixed top-0 left-0 bg-black/60 right-0 w-full min-h-screen flex items-center justify-center z-10`} >
            {
                iserror?<div> Image Upload Failed ☹️ <span onClick={handleClose} className='underline font-bold text-sm'>close</span> </div>:                
                <div onClick={(e)=>{e.stopPropagation()}} className='m-auto w-11/12 md:w-1/2 bg-gray-900 text-center text-white rounded-lg max-h-[80vh] overflow-auto animate-in zoom-in border-[1px] border-gray-500'>
                <div className='w-full relative'>
               {isloading?<h3 className='text-2xl mt-2'>Please Wait...</h3> :<h3 className='text-2xl mt-2'>Create a Post </h3> }
                <AiOutlineClose onClick={handleClose} className='absolute right-0 top-0 text-xl mt-2 mr-2 font-bold cursor-pointer'/>
                </div>
                {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    isloading?<img src="https://cdn.dribbble.com/users/563824/screenshots/3633228/media/d876c7712d969c0656302b16b16af2cc.gif" />:img?<Image className='w-5/6 m-auto bg-black/80 my-4' src={img} width={300} height={300} alt="" />:<FcStackOfPhotos className='text-[180px] m-auto my-4' />
                }
                {isdone?<div className='flex w-11/12 m-auto justify-around py-1 mb-4' > 
                    <input type="text" placeholder='Post Caption here' className='bg-gray-600 rounded-lg pl-2  outline-none' value={caption} onChange={handleCaption} />
                    <button onClick={handlePost} className='bg-blue-800 px-4 py-1 rounded-lg w-fit m-auto'>Post</button>
                     </div>:
                <div className='bg-blue-500 py-1 px-4 cursor-pointer w-fit m-auto mb-6 rounded-md'>
                 <label htmlFor='imageUpload' className='cursor-pointer' >Select from Device
                    <input onChange={handleImage} type="file" className='hidden' id="imageUpload" accept="image"/>
                </label>
                </div>}
            </div>}
        </div>
        </>
    )
}

export default CreateModal