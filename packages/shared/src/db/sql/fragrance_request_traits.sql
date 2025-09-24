CREATE TABLE public.fragrance_request_traits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  request_id uuid NOT NULL,
  trait_type_id uuid NOT NULL,
  trait_option_id uuid NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.fragrance_request_traits
ADD CONSTRAINT fragrance_request_traits_request_id_trait_type_id_key UNIQUE (request_id, trait_type_id);

ALTER TABLE ONLY public.fragrance_request_traits
ADD CONSTRAINT fragrance_requests_traits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_request_traits
ADD CONSTRAINT fragrance_request_traits_draft_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_request_traits
ADD CONSTRAINT fragrance_request_traits_trait_option_id_fkey FOREIGN KEY (trait_option_id) REFERENCES public.trait_options (id);

ALTER TABLE ONLY public.fragrance_request_traits
ADD CONSTRAINT fragrance_request_traits_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types (id) ON DELETE CASCADE;