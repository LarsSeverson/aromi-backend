CREATE TABLE public.brand_images (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  brand_id uuid NOT NULL,
  content_type text NOT NULL,
  s3_key text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  size_bytes bigint NOT NULL,
  name text NOT NULL
);

ALTER TABLE ONLY public.brand_images
ADD CONSTRAINT brand_images_brand_type_key UNIQUE (brand_id, content_type);

ALTER TABLE ONLY public.brand_images
ADD CONSTRAINT brand_images_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.brand_images
ADD CONSTRAINT brand_images_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands (id) ON DELETE CASCADE;