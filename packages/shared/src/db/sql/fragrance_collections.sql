CREATE TABLE public.fragrance_collections (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.fragrance_collections
ADD CONSTRAINT fragrance_collections_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_collections
ADD CONSTRAINT fragrance_collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);