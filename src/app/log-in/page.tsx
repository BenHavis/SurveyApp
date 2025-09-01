'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {Form, Input, Button, Typography, Alert} from 'antd'
import Link from 'next/link'
import createClient from '@/utils/supabase/client'
import styles from './login.module.css'

const {Title, Paragraph} = Typography

const LogIn = () => {
  const supabase = createClient()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (values: {email: string; password: string}) => {
    setErrorMsg(null)

    const {email, password} = values

    try{
      setSubmitting(true)
      const {error} = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if(error) {
        setErrorMsg(error.message)
        return
      }

      // if they succeded in logging, redirect to surveys
      router.replace('/survey')

        } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Unexpected error logging in')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <Title className={styles.title} level={2}>Log in</Title>
        <Paragraph className={styles.subtitle}>
          Access your account
        </Paragraph>

        {errorMsg && <Alert type='error' showIcon message={errorMsg} style={{marginBottom: 16}} />}
        <Form
        layout='vertical'
        onFinish={handleSubmit}
        requiredMark='optional'
        disabled={submitting}
        >

          <Form.Item
          name='email'
          label='email'
             rules={[
            {required: true, message: 'Email is required'},
            {type: 'email', message: 'Enter a valid email'}
          ]}
          >
            <Input placeholder='you@email.com' autoComplete='email' />
          </Form.Item>

                     <Form.Item
                    name='password'
                    label='password'
                    rules={[
                      {required: true, message: 'Password is required'},
                      {min: 6, message: 'your password should be at least 6 characters'}
                    ]}
                    >
                      <Input.Password placeholder='123456' autoComplete='new-password' />
                    </Form.Item>

                 <Form.Item>
            <Button type='primary' loading={submitting} htmlType='submit' >
             Log In
            </Button>
          </Form.Item>

        </Form>
        
               <Paragraph className={styles.footerText}>
          Don’t have an account? <Link href="/sign-up">Sign up</Link>
        </Paragraph>





      </div>
    </main>
  )
}

export default LogIn