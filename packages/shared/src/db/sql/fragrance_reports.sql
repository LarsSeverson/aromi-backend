CREATE TABLE public.fragrance_reports (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  fragrance_id uuid NOT NULL,
  user_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.fragrance_reports
ADD CONSTRAINT fragrance_reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_reports
ADD CONSTRAINT fragrance_reports_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_reports
ADD CONSTRAINT fragrance_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;