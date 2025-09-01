'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { fetchSurveyQuestions } from '@/utils/supabase/clientqueries'
import { Form, Input, Button, Alert, Typography, Progress } from 'antd'
import { useRouter } from 'next/navigation'
import styles from './survey.module.css'
import { submitSurvey } from '@/utils/supabase/clientqueries'

const Survey = () => {

    type SurveyQuestion = {
  id: number
  survey_id: number
  sort_order: number
  title: string
  description: string | null
  is_required: boolean
}


const { TextArea } = Input

const [questions, setQuestions] = useState<SurveyQuestion[]>([])
const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
   const [submitting, setSubmitting] = useState(false)
 const [answers, setAnswers] = useState<Record<number, string>>({})
  const [form] = Form.useForm()


  const total = questions.length
  const current = questions[index]

  const progressPercentage = useMemo(
    () => (total ? Math.round(((index + 1) / total) * 100) : 0),
    [index,total]
  )

  useEffect(() => {
    if(!current) return
    const saved = answers[current.id]
    if (saved !== undefined){
        form.setFieldsValue({answer: saved})
    } else {
        form.resetFields(['answer'])
    }
    setErrorMsg(null)

  }, [current, answers, form])

  useEffect(() => {
    const loadQuestions = async() => {
        try{
            setLoading(true)
            const data = await fetchSurveyQuestions(1)
            console.log('data', data)
            setQuestions(data ?? [])
            // preload the value to the form
            if(data?.length){
                const firstQuestion = data[0]
                form.setFieldsValue({ answer: answers[firstQuestion.id] ?? ''})
            }
                  } catch (e: unknown) {
        setErrorMsg(e instanceof Error ? e.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
            
        
    
  }, [form, answers])

  const handlePrevious = () => {
    if(index > 0) setIndex((i) => i - 1)
  }

  const handleNext = () => {
   
    const value: string = form.getFieldValue('answer') ?? ''
    if(current?.is_required && !value.trim()){
        setErrorMsg('this message is required')
        return
    }

    // persist answer in react state
    if(current){
     setAnswers((prev) => ({ ...prev, [current.id]: value }))

    }
    //otherwise contiue
    if (index < total -1) setIndex((i) => i + 1)

  }

  const handlesubmit = async () => {
    const value: string = form.getFieldValue('answer') ?? ''
    if (current?.is_required && !value.trim()){
        setErrorMsg('this message is required')
        return
    }

    const finalAnswers = current ? {...answers, [current.id]: value} : answers
    setSubmitting(true)
    const responseId = await submitSurvey(1, finalAnswers)

    console.log('submitting with answers', finalAnswers)
    setSubmitting(false)
  }




  return (
    <main className={styles.container}>
        <div className={styles.card}>
            <header className={styles.header}>
                <div className={styles.title}>Survey</div>
                <div className={styles.index}>
                    {index + 1} / {total}
                </div>
            </header>

            <Progress percent={progressPercentage} showInfo  />

            <Form form={form} layout='vertical'>
                <div className={styles.question}>
                    {current?.title}
                {current?.is_required && ' *'}
                </div>

                {current?.description && (
                    <div className={styles.description}>{current.description}</div>
                )}

                <Form.Item name='answer' rules={[]} required={current?.is_required} >
                    <TextArea rows={4} placeholder='Enter your answer here...' />
                </Form.Item>

                {errorMsg && (
                    <Alert className={styles.error} showIcon message={errorMsg} />
                )}


                <div className={styles.buttonArea}>
                    <Button onClick={handlePrevious}>
                        Previous
                    </Button>

                    {index < total - 1 ? (
                        <Button type='primary' onClick={handleNext}>
                            Next
                        </Button>
                    ):
                    <Button type='primary' onClick={handlesubmit} loading={submitting}>
                        Submit
                    </Button>
                    }

                </div>




            </Form>

        </div>
    </main>
  )
}

export default Survey