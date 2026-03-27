
-- Investment packages table (3 predefined packages)
CREATE TABLE public.investment_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  daily_return_pct numeric NOT NULL DEFAULT 0,
  points_reward integer NOT NULL DEFAULT 0,
  bonus_per_level jsonb NOT NULL DEFAULT '[10, 5, 3, 2, 1]',
  duration_days integer NOT NULL DEFAULT 30,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User investments
CREATE TABLE public.user_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES public.investment_packages(id),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'active',
  purchased_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investments" ON public.user_investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON public.user_investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User points
CREATE TABLE public.user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  source text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points" ON public.user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" ON public.user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow anyone to view packages (public listing)
ALTER TABLE public.investment_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages" ON public.investment_packages
  FOR SELECT USING (is_active = true);

-- Seed the 3 packages
INSERT INTO public.investment_packages (name, description, price, daily_return_pct, points_reward, bonus_per_level, duration_days) VALUES
  ('Starter', 'Pacote inicial para começar a investir. Ideal para novos membros.', 100, 1.5, 50, '[10, 5, 3, 2, 1]', 30),
  ('Pro', 'Pacote intermediário com retornos maiores e mais pontos.', 500, 2.5, 300, '[10, 5, 3, 2, 1]', 60),
  ('Elite', 'Pacote premium com os melhores retornos e bônus exclusivos.', 2000, 4.0, 1500, '[10, 5, 3, 2, 1]', 90);
