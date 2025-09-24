CREATE TABLE public.user_images (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  s3_key text NOT NULL,
  name text NOT NULL,
  content_type text NOT NULL,
  size_bytes bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.user_images
ADD CONSTRAINT user_images_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_images
ADD CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;