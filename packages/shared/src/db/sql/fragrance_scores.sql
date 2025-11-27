CREATE TABLE public.fragrance_scores (
  fragrance_id uuid NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  average_rating real,
  review_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.fragrance_scores
ADD CONSTRAINT fragrance_scores_pkey PRIMARY KEY (fragrance_id);

ALTER TABLE ONLY public.fragrance_scores
ADD CONSTRAINT fragrance_scores_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;