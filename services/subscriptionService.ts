import { supabase } from './supabase';

export const checkSubscriptionStatus = async (userId: string): Promise<boolean> => {
    try {
        // If userId is passed, usage is explicit. If not, could fetch from auth.getUser() but here we stick to the signature.
        const { data, error } = await supabase
            .from('subscriptions')
            .select('status, current_period_end')
            .eq('user_id', userId)
            .in('status', ['active', 'trialing'])
            .single();

        if (error || !data) return false;

        // Check if period hasn't ended
        const now = new Date();
        const periodEnd = data.current_period_end ? new Date(data.current_period_end) : null;

        if (periodEnd && periodEnd < now) return false;

        return true;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
};
