CREATE TABLE public.brand_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  brand_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  vote smallint NOT NULL,
  CONSTRAINT brand_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);

ALTER TABLE ONLY public.brand_votes
ADD CONSTRAINT brand_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.brand_votes
ADD CONSTRAINT brand_votes_unique UNIQUE (user_id, brand_id);

ALTER TABLE ONLY public.brand_votes
ADD CONSTRAINT brand_votes_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.brand_votes
ADD CONSTRAINT brand_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;