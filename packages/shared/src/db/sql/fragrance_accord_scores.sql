CREATE TABLE public.fragrance_accord_scores (
  fragrance_id uuid NOT NULL,
  accord_id uuid NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.fragrance_accord_scores
ADD CONSTRAINT fragrance_accord_scores_pkey PRIMARY KEY (fragrance_id, accord_id);

ALTER TABLE ONLY public.fragrance_accord_scores
ADD CONSTRAINT fragrance_accord_scores_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_accord_scores
ADD CONSTRAINT fragrance_accord_scores_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;