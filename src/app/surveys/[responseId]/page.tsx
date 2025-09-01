'use client'
import React, { useEffect, useState} from 'react'
import { useParams } from 'next/navigation'
import createClient from '@/utils/supabase/client'
import { fetchSurveyQuestions } from '@/utils/supabase/clientqueries'

type AnswerRow = { question_id: number; value: string }

type Question = {
  id: number
  survey_id: number
  sort_order: number
  title: string
  description: string | null
  is_required: boolean
}

const Responses = () => {
     const { responseId } = useParams<{ responseId: string }>()

     const resId = Number(responseId)

     const supabase = createClient()
      const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answersByQ, setAnswersByQ] = useState<Record<number, unknown>>({})

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        // 1) questions via RPC (single survey -> id 1)
        const qs = await fetchSurveyQuestions(1)
        setQuestions((qs ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order))

        // 2) answers for this response
        const { data, error } = await supabase
          .from('surveyanswers')
          .select('question_id, value')
          .eq('response_id', resId)

        if (error) throw error

        const map: Record<number, unknown> = {}
        ;(data as unknown as AnswerRow[]).forEach((row) => {
          map[row.question_id] = row.value
        })
        setAnswersByQ(map)
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : 'Failed to load response')
      } finally {
        setLoading(false)
      }
    }

    if (!Number.isNaN(resId)) load()
  }, [resId, supabase])

  if(loading) return <main><p>Loading...</p></main>
  if(errorMsg) return <main><p>Error: {errorMsg}</p></main>

  return (
     <main>
      <h2>Submission Summary (Response# {resId})</h2>

      <ul>
        {questions.map((q) => {
          const raw = answersByQ[q.id]
          const text =
            raw == null
              ? ''
              : Array.isArray(raw)
              ? raw.join(', ')
              : typeof raw === 'object'
              ? JSON.stringify(raw)
              : String(raw)

          return (
            <li key={q.id}>
              <strong>{q.sort_order}. {q.title}</strong>
              {q.description ? <div>{q.description}</div> : null}
              <div>{text || '(no answer provided)'}</div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default Responses