CREATE TABLE public.fragrance_accords (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  fragrance_id uuid NOT NULL,
  accord_id uuid NOT NULL,
  vote_score integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  likes_count integer DEFAULT 0 NOT NULL,
  dislikes_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.fragrance_accords
ADD CONSTRAINT fragrance_accords_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_accords
ADD CONSTRAINT unique_fragrance_accord UNIQUE (fragrance_id, accord_id);

ALTER TABLE ONLY public.fragrance_accords
ADD CONSTRAINT fk_accord_id FOREIGN KEY (accord_id) REFERENCES public.accords (id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.fragrance_accords
ADD CONSTRAINT fk_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON UPDATE CASCADE ON DELETE RESTRICT;