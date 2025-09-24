CREATE TABLE public.brand_request_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  request_id uuid NOT NULL,
  vote smallint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT brand_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);

ALTER TABLE ONLY public.brand_request_votes
ADD CONSTRAINT brand_request_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.brand_request_votes
ADD CONSTRAINT brand_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);

ALTER TABLE ONLY public.brand_request_votes
ADD CONSTRAINT brand_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.brand_requests (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.brand_request_votes
ADD CONSTRAINT brand_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;