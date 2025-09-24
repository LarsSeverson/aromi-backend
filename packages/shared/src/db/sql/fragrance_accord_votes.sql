CREATE TABLE public.fragrance_accord_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  fragrance_id uuid NOT NULL,
  accord_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp with time zone,
  vote integer DEFAULT 0 NOT NULL,
  CONSTRAINT fragrance_accord_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);

ALTER TABLE ONLY public.fragrance_accord_votes
ADD CONSTRAINT fragrance_accord_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_accord_votes
ADD CONSTRAINT fragrance_accord_votes_unique UNIQUE (user_id, fragrance_id, accord_id);

ALTER TABLE ONLY public.fragrance_accord_votes
ADD CONSTRAINT fragrance_accord_votes_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_accord_votes
ADD CONSTRAINT fragrance_accord_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_accord_votes
ADD CONSTRAINT fragrance_accord_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;