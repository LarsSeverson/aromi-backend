CREATE TABLE public.accord_images (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  accord_id uuid NOT NULL,
  s3_key text NOT NULL,
  name text NOT NULL,
  content_type text NOT NULL,
  size_bytes bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.accord_images
ADD CONSTRAINT accord_images_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.accord_images
ADD CONSTRAINT accord_images_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords (id) ON DELETE CASCADE;