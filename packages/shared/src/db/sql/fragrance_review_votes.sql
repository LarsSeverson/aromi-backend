CREATE TABLE public.fragrance_review_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  review_id uuid NOT NULL,
  vote smallint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  CONSTRAINT fragrance_review_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);

ALTER TABLE ONLY public.fragrance_review_votes
ADD CONSTRAINT fragrance_review_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_review_votes
ADD CONSTRAINT fragrance_review_votes_user_id_review_id_key UNIQUE (user_id, review_id);

ALTER TABLE ONLY public.fragrance_review_votes
ADD CONSTRAINT fragrance_review_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.fragrance_reviews (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_review_votes
ADD CONSTRAINT fragrance_review_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;