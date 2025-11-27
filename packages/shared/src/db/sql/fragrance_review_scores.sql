CREATE TABLE public.fragrance_review_scores (
  review_id uuid NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);

ALTER TABLE ONLY public.fragrance_review_scores
ADD CONSTRAINT fragrance_review_vote_counts_pkey PRIMARY KEY (review_id);

ALTER TABLE ONLY public.fragrance_review_scores
ADD CONSTRAINT fragrance_review_vote_counts_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.fragrance_reviews (id) ON DELETE CASCADE;