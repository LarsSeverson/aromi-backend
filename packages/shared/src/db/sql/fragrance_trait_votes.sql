CREATE TABLE public.fragrance_trait_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  fragrance_id uuid NOT NULL,
  trait_type_id uuid NOT NULL,
  trait_option_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.fragrance_trait_votes
ADD CONSTRAINT fragrance_trait_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_trait_votes
ADD CONSTRAINT fragrance_trait_votes_user_id_fragrance_id_trait_type_id_key UNIQUE (user_id, fragrance_id, trait_type_id);

ALTER TABLE ONLY public.fragrance_trait_votes
ADD CONSTRAINT fragrance_trait_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_trait_votes
ADD CONSTRAINT fragrance_trait_votes_trait_option_id_fkey FOREIGN KEY (trait_option_id) REFERENCES public.trait_options (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_trait_votes
ADD CONSTRAINT fragrance_trait_votes_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_trait_votes
ADD CONSTRAINT fragrance_trait_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;