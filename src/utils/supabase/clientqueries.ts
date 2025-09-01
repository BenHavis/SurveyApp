import createClient from "./client";

const supabase = createClient()

export const fetchSurveyInfo = async (surveyId: number) => {
    const { data, error } = await supabase.rpc('fetch_survey_info',
        {
            p_survey_id: surveyId
        })

        if (error) throw error
        return data
}

export const fetchSurveyQuestions = async (surveyId: number) => {
      const { data, error } = await supabase.rpc('fetch_survey_questions', {
    p_survey_id: surveyId
  })

  if (error) throw error
  return data

}

export const submitSurvey = async (
  surveyId: number,
  answers: Record<number, unknown> // e.g., { 1: "66", 2: "6g", ... }
) => {
  const { data, error } = await supabase.rpc('submit_survey', {
    p_survey_id: surveyId,
    p_answers: answers, // will serialize to jsonb
  })
  if (error) throw error
  return data as number // response_id
}