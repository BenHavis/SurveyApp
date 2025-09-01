'use client'
import React, { useState } from 'react'
import { Form, Input, Button, Typography, Alert} from 'antd'
import Link from 'next/link'
import createClient from '@/utils/supabase/client'
import styles from './signup.module.css'

const { Title, Paragraph } = Typography

const SignUp = () => {

  const supabase = createClient()

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  

  const handleSubmit = async (values: {email: string, password: string, confirm: string}) => {
    setErrorMessage(null)
    setInfoMessage(null)

    const {email, password, confirm} = values

    if (password !== confirm){
      setErrorMessage('Passwords do not match.')
    }

    try {
      setSubmitting(true)
      const { error} = await supabase.auth.signUp({ email, password})

      if (error){
        setErrorMessage(error.message)
        return
      }

      setInfoMessage('Account created. If email confirmation is enabled, check your emai'l)
    } catch(e: any) {
      setErrorMessage(e?.message ?? 'Unexpected error signing up, please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <Title className={styles.title} level={2}>Create your account</Title>
        <Paragraph className={styles.subtitle}>
          Sign up to start your survey.
        </Paragraph>

        {errorMessage && <Alert type='error' showIcon message={errorMessage} style={{marginBottom: 16}} />}
        {infoMessage && <Alert type='success' showIcon message={infoMessage} style={{marginBottom: 16}} />}

        
        <Form
        layout='vertical'
        labelCol={{ span: 6}}
        wrapperCol={{ span: 18}}
        onFinish={handleSubmit}
        requiredMark='optional'
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


            <Form.Item
          name='confirm'
          label='confirm password'
          dependencies={['password']}
          rules={[
            {required: true, message: 'Please confirm your password'},
                          ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve()
                  return Promise.reject(new Error('Passwords do not match'))
                },
              }),
            ]}

          >
            <Input.Password placeholder='Re-enter your password' autoComplete='new-password' />
          </Form.Item>

                 <Form.Item>
            <Button type='primary' block loading={submitting} htmlType='submit' >
              Sign Up
            </Button>
          </Form.Item>

        </Form>

        <Paragraph className={styles.footer}>
          Already have an account?  <Link href='/log-in'>Log in here</Link>
        </Paragraph>
        
      </div>
    </main>
  )
}

export default SignUp