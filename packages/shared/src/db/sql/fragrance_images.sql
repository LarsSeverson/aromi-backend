CREATE TABLE public.fragrance_images (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  fragrance_id uuid NOT NULL,
  old_s3_key character varying(255),
  s3_key character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  primary_color character varying(7),
  width integer DEFAULT 0 NOT NULL,
  height integer DEFAULT 0 NOT NULL,
  url text,
  content_type text DEFAULT 'image/jpeg'::text NOT NULL,
  name text DEFAULT 'unknown'::text NOT NULL,
  size_bytes bigint DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.fragrance_images
ADD CONSTRAINT fragrance_images_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_images
ADD CONSTRAINT fragrance_images_unique UNIQUE (s3_key);

ALTER TABLE ONLY public.fragrance_images
ADD CONSTRAINT fragrance_images_new_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON UPDATE CASCADE ON DELETE CASCADE;