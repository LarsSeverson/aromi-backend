CREATE TABLE public.brands (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  website text,
  description text,
  avatar_id uuid
);

ALTER TABLE ONLY public.brands
ADD CONSTRAINT brands_name_key UNIQUE (name);

ALTER TABLE ONLY public.brands
ADD CONSTRAINT brands_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.brands
ADD CONSTRAINT brands_avatar_image_fkey FOREIGN KEY (avatar_id) REFERENCES public.brand_images (id) NOT VALID;