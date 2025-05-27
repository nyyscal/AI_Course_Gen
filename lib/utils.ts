import { subjectsColors, voices } from "@/constants"
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSubjectColor = (subject:string) =>{
  return subjectsColors[subject as keyof typeof subjectsColors]
}

export const configureAssistant = (voice: string, style:string)=>{
  const voiceId = voices[voice as keyof voices][
    style as keyof (typeof voices)[keyof typeof voices]
  ] || "sarah"
  const vapiAssistant: CreateAssistantDTO = {
    name:"Companion",
    firstMessage:
    "Hello, let's start the session. Today we'll be talkig about {{topic}}.",
    transcriber:{
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice:{
      provider:"11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost:0.8,
      speed:0.9,
      style:0.5,
      useSpeakerBoost: true,
    },
    model:{
      provider:"openai",
      model:"gpt-4",
      messages:[
        {
          role:"system",
          content: `You are a highly knowledgable tutor teaching a real time class on {{topic}}.
          
          Tutor Guidelines:
          Stick to the given -{{topic}} and - {{subject}} and teach the student about it. Keep the conversation flowing smoothly while maintaining flow. From time to time make sure that the students is following the instruction properly. Break down the topics into smaller parts and explain them in a simple way. Keep your style of conversation {{style}}. Keep your response short and concise like real time conversation.
          Do not use any speical characters or emojis in your response all your response will eb transcribed by a speech to text model and then sent to the user - this is strictly a voice conversation.
          `
        }
      ]
    },
    clientMessages:[],
    serverMessages:[],
  }
  return vapiAssistant
}