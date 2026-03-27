
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  referral_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES auth.users(id),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view profiles by referral_code" ON public.profiles FOR SELECT USING (true);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INT NOT NULL CHECK (level BETWEEN 1 AND 5),
  bonus_percentage NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "System can insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Process referral chain up to 5 levels
CREATE OR REPLACE FUNCTION public.process_referral(
  _new_user_id UUID,
  _referral_code TEXT
)
RETURNS VOID AS $$
DECLARE
  _referrer_id UUID;
  _current_referrer UUID;
  _level INT := 1;
  _bonuses NUMERIC[] := ARRAY[10.0, 5.0, 3.0, 2.0, 1.0];
BEGIN
  SELECT user_id INTO _referrer_id FROM public.profiles WHERE referral_code = _referral_code;
  IF _referrer_id IS NULL OR _referrer_id = _new_user_id THEN
    RETURN;
  END IF;
  UPDATE public.profiles SET referred_by = _referrer_id WHERE user_id = _new_user_id;
  _current_referrer := _referrer_id;
  WHILE _level <= 5 AND _current_referrer IS NOT NULL LOOP
    INSERT INTO public.referrals (referrer_id, referred_id, level, bonus_percentage)
    VALUES (_current_referrer, _new_user_id, _level, _bonuses[_level])
    ON CONFLICT (referrer_id, referred_id) DO NOTHING;
    SELECT referred_by INTO _current_referrer FROM public.profiles WHERE user_id = _current_referrer;
    _level := _level + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
