CREATE TABLE public.trait_options (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  trait_type_id uuid NOT NULL,
  label text NOT NULL,
  score integer NOT NULL
);

ALTER TABLE ONLY public.trait_options
ADD CONSTRAINT trait_options_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.trait_options
ADD CONSTRAINT trait_options_trait_type_id_score_key UNIQUE (trait_type_id, score);

ALTER TABLE ONLY public.trait_options
ADD CONSTRAINT trait_options_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types (id) ON DELETE CASCADE;