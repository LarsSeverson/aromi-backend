CREATE TABLE public.brand_scores (
  brand_id uuid NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.brand_scores
ADD CONSTRAINT brand_scores_pkey PRIMARY KEY (brand_id);

ALTER TABLE ONLY public.brand_scores
ADD CONSTRAINT brand_scores_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands (id) ON DELETE CASCADE;