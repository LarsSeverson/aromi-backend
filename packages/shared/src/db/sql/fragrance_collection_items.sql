CREATE TABLE public.fragrance_collection_items (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  collection_id uuid NOT NULL,
  fragrance_id uuid NOT NULL,
  rank double precision NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.fragrance_collection_items
ADD CONSTRAINT fragrance_collection_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_collection_items
ADD CONSTRAINT fragrance_collection_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.fragrance_collections (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_collection_items
ADD CONSTRAINT fragrance_collection_items_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;