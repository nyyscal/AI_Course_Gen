"use client"

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from '@/constants'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'



const SubjectFilter = () => {
  const router= useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("subject")|| ""
  const [subject,setSubject] = useState(query)
  
  useEffect(()=>{
    let newUrl = "";
    if (subject === "all"){
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove:["subject"]
      })
    }else{
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key:"subject",
        value:subject
      })
    }
    router.push(newUrl,{scroll:false})
  },[subject])

  return (
    <Select onValueChange={setSubject} value={subject}>
  <SelectTrigger className="input capitalize">
    <SelectValue placeholder="Select Subject" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all" className='cursor-pointer'>All subjects</SelectItem>
  {subjects.map((subject)=>(
    <SelectItem className='cursor-pointer' key={subject} value={subject}>{subject}</SelectItem>))}
  </SelectContent>
</Select>

  )
}

export default SubjectFilter