CREATE TABLE public.post_scores (
  post_id uuid NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  comment_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.post_scores
ADD CONSTRAINT post_scores_pkey PRIMARY KEY (post_id);

ALTER TABLE ONLY public.post_scores
ADD CONSTRAINT post_scores_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts (id) ON DELETE CASCADE;