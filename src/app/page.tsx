'use client'
import styles from './page.module.css'
import {Typography, Button} from 'antd'
import Link from 'next/link'
import { fetchSurveyInfo } from '../utils/supabase/clientqueries';
import { useEffect, useState } from 'react';


const {Paragraph} = Typography

type SurveyInfo = {
  title: string
  description: string
  is_active: boolean
}


export default function Home() {
  const [survey, setSurvey] = useState<SurveyInfo | null>(null)


  const getSurveyInfo = async () => {
    const data = await fetchSurveyInfo(1)
    console.log('data', data)
    setSurvey(data?.[0])

  }

  useEffect(() => {
    getSurveyInfo()

  },[])



  
  return (
    <main className={styles.container}>
    
       <div className={styles.column}>
         <div  className={styles.title}>
         <h1> Welcome to the {survey?.title ? survey.title : 'the survey'}</h1>
        </div>

          <Paragraph className={styles.centeredText}>
          {survey?.description ? survey.description : 'This is a demo that lets you sign up, take a survey, and review your responses.'}
        </Paragraph>
        <Paragraph className={styles.centeredText}>
          Please create an account or sign in to begin filling out your survey.
        </Paragraph>

        <div className={styles.buttonRow}>
      <Link href='/sign-up'>
          <Button type="primary" size="large" >
            Sign Up
       </Button>
     </Link>

           <Link href='sign-in'>
            <Button  size="large" >
            Log in
          </Button>
           </Link>
        </div>

       </div>
     

    </main>
  );
}
