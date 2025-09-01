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