CREATE TABLE public.asset_uploads (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  s3_key text NOT NULL,
  name text NOT NULL,
  status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
  content_type text NOT NULL,
  size_bytes bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  user_id uuid
);

ALTER TABLE ONLY public.asset_uploads
ADD CONSTRAINT asset_uploads_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.asset_uploads
ADD CONSTRAINT user_id_asset FOREIGN KEY (user_id) REFERENCES public.users (id) NOT VALID;