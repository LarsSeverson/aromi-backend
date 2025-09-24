CREATE TABLE public.trait_types (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL
);

ALTER TABLE ONLY public.trait_types
ADD CONSTRAINT trait_types_name_key UNIQUE (name);

ALTER TABLE ONLY public.trait_types
ADD CONSTRAINT trait_types_pkey PRIMARY KEY (id);