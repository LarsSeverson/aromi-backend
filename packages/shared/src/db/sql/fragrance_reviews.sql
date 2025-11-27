CREATE TABLE public.fragrance_reviews (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  fragrance_id uuid NOT NULL,
  user_id uuid NOT NULL,
  body text,
  rating smallint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  CONSTRAINT fragrance_reviews_rating_check CHECK (
    (
      (rating >= 1)
      AND (rating <= 5)
    )
  )
);

ALTER TABLE ONLY public.fragrance_reviews
ADD CONSTRAINT fragrance_reviews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_reviews
ADD CONSTRAINT fragrance_reviews_unique_user_fragrance UNIQUE (fragrance_id, user_id);

ALTER TABLE ONLY public.fragrance_reviews
ADD CONSTRAINT fragrance_reviews_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_reviews
ADD CONSTRAINT fragrance_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;