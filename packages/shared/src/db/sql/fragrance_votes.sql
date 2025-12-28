CREATE TABLE public.fragrance_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  fragrance_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  vote smallint NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fragrance_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);

ALTER TABLE ONLY public.fragrance_votes
ADD CONSTRAINT fragrance_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_votes
ADD CONSTRAINT fragrance_votes_unique UNIQUE (user_id, fragrance_id);

ALTER TABLE ONLY public.fragrance_votes
ADD CONSTRAINT fragrance_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_votes
ADD CONSTRAINT fragrance_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;