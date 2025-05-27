"use client"

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from '@/lib/actions/companion.actions'


enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

const CompanionComponent = ({companionId,subject,name,userName,topic,userImage,style,voice}:CompanionComponentProps) => {

  const [callStatus,setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [isSpeaking,setIsSpeaking ]= useState(false)
  const [messages,setMessages]= useState<SavedMessage[]>([])
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [isMuted,setIsMuted] = useState(false)

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted()
    vapi.setMuted(!isMuted)
    setIsMuted(!isMuted)
  }

  
  useEffect(()=>{
    if(lottieRef){
      if(isSpeaking){
        lottieRef.current?.play()
      }else {
          lottieRef.current?.stop()
        }
      }
    },[isSpeaking,lottieRef])
    
    const handleDisconnect = async()=>{
      setCallStatus(CallStatus.FINISHED)
      vapi.stop()
    }

    const handleCall = async()=>{
      setCallStatus(CallStatus.CONNECTING)
      const assistantOverrides ={
        variableValues:{
          subject,topic,style
        },
        clientMessages: ['transcript'],
        serverMessages:[]
      }

      // @ts-expect-error
      vapi.start(configureAssistant(voice,style),assistantOverrides)
    }

    
    useEffect(()=>{
      const onCallStart = () =>setCallStatus(CallStatus.ACTIVE)
      const onCallEnd = () => {
        setCallStatus(CallStatus.FINISHED)
        //add to Session History
        addToSessionHistory(companionId)
      }

    const onMessage=(message:Message)=> {
      if(message.type === "transcript" && message.transcriptType === "final"){
        const newMessage = {role: message.role, content: message.transcript}
        setMessages((prev)=>[newMessage,...prev])
      }
    }
    const onSpeechStart=()=> {setIsSpeaking(true)}

    const onSpeechEnd=()=> {setIsSpeaking(false)}
    const onError = (error:Error) => console.error("Error in companion component:", error)
    vapi.on("call-start",onCallStart)
    vapi.on("call-end",onCallEnd)
    vapi.on("message",onMessage)
    vapi.on("error",onError)
    vapi.on("speech-start",onSpeechStart)
    vapi.on("speech-end",onSpeechEnd)
    
    return () =>{
      vapi.off("call-start",onCallStart)
      vapi.off("call-end",onCallEnd)
      vapi.off("message",onMessage)
      vapi.off("error",onError)
      vapi.off("speech-start",onSpeechStart)
      vapi.off("speech-end",onSpeechEnd)
    }
  },[])
  return (
    <section className='flex flex-col h-[70vh]'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className='companion-section'>
          <div className='companion-avatar' style={{backgroundColor: getSubjectColor(subject)}}>
           <div className="relative w-[150px] h-[150px]">
  {/* Image */}
  <Image
    src={`/icons/${subject}.svg`}
    alt={subject}
    width={150}
    height={150}
    className={cn(
      "transition-opacity duration-300 max-sm:w-fit absolute inset-0",
      callStatus === CallStatus.ACTIVE ? "opacity-0" : "opacity-100"
    )}
  />

  {/* Lottie Animation */}
  <div className={cn(
    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
    callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
  )}>
    <Lottie
      lottieRef={lottieRef}
      animationData={soundwaves}
      autoPlay={false}
      className="companion-lottie"
    />
  </div>
</div>

          </div>
              <p className='font-bold text-2xl'>{name}</p>
        </div>
          <div className='user-section'>
            <div className='user-avatar'>
              <Image src={userImage} width={130} height={130} className='rounded-lg' alt='userImage'/>
              <p className='font-bold text-2xl'>{userName}</p>
            </div>
            <button className='btn-mic' onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
              <Image src={isMuted? "/icons/mic-off.svg":"/icons/mic-on.svg"} alt='mic' width={36} height={36}/>
              <p className='max-sm:hidden'>{isMuted?"Turn on microphone":"Turn off microphone"}</p>
            </button>
            <button className={cn("rounded-lg py-2 cursor-pointer tracking-normal w-full text-white", callStatus === CallStatus.ACTIVE ? "bg-red-500 hover:bg-red-600":"bg-blue-500 hover:bg-blue-600", callStatus===CallStatus.CONNECTING && "animate-pulse")} 
            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
              {callStatus === CallStatus.ACTIVE ? "End Session":callStatus === CallStatus.CONNECTING ? "Connecting...":"Start Session"}
            </button>
          </div>
      </section>
      <section className='transcript'>
        <div className='transcript-message no-scrollbar'>
          {messages.map((message,index)=>{
            if(message.role === "assistant"){
              return (
                <p key={index} className='text-xl'>
                 {name.split(" ")[0].replace(/[.,]/g, "")}:{message.content}
                </p>
              )
            }else{
              return <p key={index} className='text-primary sm:text-xl'>{userName} : {" "} {message.content}</p>
            }
          })}
        </div>
        <div className='transcript-fade'/>
      </section>
    </section>
  )
}

export default CompanionComponent