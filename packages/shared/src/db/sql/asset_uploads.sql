CREATE TABLE public.asset_uploads (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  s3_key text NOT NULL,
  name text NOT NULL,
  status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
  content_type text NOT NULL,
  size_bytes bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.asset_uploads
ADD CONSTRAINT asset_uploads_pkey PRIMARY KEY (id);