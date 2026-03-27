
DROP POLICY "System can insert referrals" ON public.referrals;
CREATE POLICY "Authenticated can insert referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
