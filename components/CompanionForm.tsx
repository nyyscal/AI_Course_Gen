"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from "@/constants"
import { Textarea } from "./ui/textarea"


const formSchema = z.object({
  name: z.string().min(1,{message:"Companion is requried"}),
  subject: z.string().min(1,{message:"Subject is requried"}),
  topic: z.string().min(1,{message:"Topic is requried"}),
  voice: z.string().min(1,{message:"Voice is requried"}),
  style: z.string().min(1,{message:"Style is requried"}),
  duration: z.coerce.number().min(1,{message:"Duration is requried"}),
})


const CompanionForm = () => {
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject:"",
      topic:"",
      voice:"",
      style:"",
      duration:15
    },
  })
 
  // 2. Define a submit handler.
 const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your companion name" {...field} className="input"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
               <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
  <SelectTrigger className=" input capitalize">
    <SelectValue placeholder="Select the subject" />
  </SelectTrigger>
  <SelectContent className=" bg-white ">
    {subjects.map((subject)=>(
      <SelectItem value={subject} key={subject} className="capitalize cursor-pointer">{subject}</SelectItem>
    ))}
  </SelectContent>
</Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should the companion help with?</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex. Derivatives Integrals" {...field} className="input"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
               <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
  <SelectTrigger className=" input ">
    <SelectValue placeholder="Select the voice" />
  </SelectTrigger>
  <SelectContent className=" bg-white ">

      <SelectItem value="male"  className="capitalize cursor-pointer">Male</SelectItem>
      <SelectItem value="female" className="capitalize cursor-pointer">Female</SelectItem>

  </SelectContent>
</Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
               <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
  <SelectTrigger className=" input ">
    <SelectValue placeholder="Select the style" />
  </SelectTrigger>
  <SelectContent className=" bg-white ">

      <SelectItem value="formal"  className="capitalize cursor-pointer">Formal</SelectItem>
      <SelectItem value="casual" className="capitalize cursor-pointer">Casual</SelectItem>

  </SelectContent>
</Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration (in mins)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="15" {...field} className="input"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-black text-white hover:bg-black/80 w-full cursor-pointer">Build Your Companion</Button>
      </form>
    </Form>

  )
}

export default CompanionForm