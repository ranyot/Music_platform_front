import * as musics from '../actions/musics'
// src/count-context.js
import{createContext, useContext, useEffect, useReducer} from 'react'
import { updateObject } from '../utils';
import axios from 'axios';
  
  const initialState = {
    musics:[],
    error:'',
    isLoading:true,
    current:1
  }
  
  function startMusicListStart(state, payload){
    const newState ={
      musics:payload ? payload : [],
      // musics:[
      //   {id:1, name:'Music', artist:"Mansur", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      //   {id:2, name:'Music2', artist:"Mansur", url:"mp3/2.mp3"},
      //   {id:3, name:'Music', artist:"Mansur", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      //   {id:4, name:'Music2', artist:"Mansur", url:"mp3/2.mp3"},
      //   {id:5, name:'Music', artist:"Mansur", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      //   {id:6, name:'Music2', artist:"Mansur", url:"mp3/2.mp3"},
      //   {id:7, name:'Music', artist:"Mansur", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      //   {id:8, name:'Music2', artist:"Mansur", url:"mp3/2.mp3"},
      //   {id:9, name:'Music', artist:"Mansur", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      //   {id:10, name:'Music2', artist:"Mansur", url:"mp3/2.mp3"},
      //   {id:11, name:'Music', artist:"Mansur", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      //   {id:12, name:'Music2', artist:"Mansur", url:"mp3/2.mp3"}
      // ],
      isLoading:false
    }
    const result = updateObject(state, newState)

    return result
  }
  function deleteMusic(state, id){
    // const music = state.musics;
    // const filtered = music.filter(x=>x.id!==id ? x : '')
    // const newState = {
    //   musics:filtered
    // }
    // return updateObject(state, newState)
  }
  function SetCurrentMusic(state, id){
    const newState = {
      current:id
    }
  
    
    return updateObject(state, newState)
  }
  function AddMusic(state, name){
    const maxItem =state.musics.length===0 ? {id:0} : state.musics.reduce((p, v)=>{
      return (p>v ? p :v)
    })
    const newState = {musics:[...state.musics, ...[{id:maxItem.id+1, name:name}]]}
    return updateObject(state, newState)
  }

  function SetNextMusic(state, step){
      const currentIndex = state.musics.findIndex(x=>x.id===state.current ? x: '')
      const nextIndex = step >0 ? ((state.musics.length-1 ===currentIndex ) ? 0 : currentIndex+step)
                                 : step<0 ? ((currentIndex===0) ? state.musics.length-1 : currentIndex+step) :currentIndex
      console.log(nextIndex)
     return SetCurrentMusic(state, state.musics[nextIndex].id)
  }
  function reducerMusics(state, action) {
    switch (action.type) {
      case musics.MUSICS_LIST_START_LOADING:
        return startMusicListStart(state ,action.payload);
      case musics.MUSICS_DELETE:
        return deleteMusic(state, action.payload);
      case musics.MUSICS_ADD:
        return AddMusic(state, action.payload);
      case musics.SET_CURRENT_MUSIC:
        return SetCurrentMusic(state, action.payload);
      case musics.SET_STEP_MUSIC_TO_CURRENT:
        return SetNextMusic(state, action.payload);
      default:
        throw new Error();
    }
  }

  const Context = createContext();
  
  export default function MusicsProvider({children}){
    const [state, dispatch] = useReducer(reducerMusics, initialState)
    const fetchData=async()=>{

      await axios.get('https://muzikpage.000webhostapp.com/api/muzik').then(res=>{
        dispatch({type:musics.MUSICS_LIST_START_LOADING, payload:res.data})
      })
      .catch(err =>console.log(err))
    }
    useEffect(
        ()=>{
          fetchData()
        }, [])
    return (
      <Context.Provider value={{state, dispatch}}>
        <Context.Consumer>
          {()=>children}
        </Context.Consumer>
      </Context.Provider>
    )
  }

 export const useMusics=()=>{
    const {state, dispatch}= useContext(Context)
    return {state, dispatch}
  }