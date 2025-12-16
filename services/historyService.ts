import { supabase } from './supabase';

export interface AnalysisRecord {
    id: string;
    user_id: string;
    contract_title: string;
    contract_content: string;
    analysis_report: string;
    created_at: string;
}

export const saveAnalysis = async (
    userId: string,
    title: string,
    content: string,
    report: string
) => {
    const { data, error } = await supabase
        .from('analyses')
        .insert([
            {
                user_id: userId,
                contract_title: title,
                contract_content: content,
                analysis_report: report
            }
        ])
        .select();

    return { data, error };
};

export const getUserHistory = async (userId: string) => {
    const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return { data, error };
};
