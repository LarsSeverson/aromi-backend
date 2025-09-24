CREATE TABLE public.fragrance_request_scores (
  request_id uuid NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);

ALTER TABLE ONLY public.fragrance_request_scores
ADD CONSTRAINT fragrance_request_vote_counts_pkey PRIMARY KEY (request_id);

ALTER TABLE ONLY public.fragrance_request_scores
ADD CONSTRAINT fragrance_request_vote_counts_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests (id) ON DELETE CASCADE;