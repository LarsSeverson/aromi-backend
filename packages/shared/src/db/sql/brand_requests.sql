CREATE TABLE public.brand_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name character varying(255),
  description text,
  website text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  user_id uuid NOT NULL,
  version integer DEFAULT 0 NOT NULL,
  asset_id uuid,
  request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL
);

ALTER TABLE ONLY public.brand_requests
ADD CONSTRAINT brand_requests_name_key UNIQUE (name);

ALTER TABLE ONLY public.brand_requests
ADD CONSTRAINT brand_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.brand_requests
ADD CONSTRAINT brand_requests_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads (id) NOT VALID;

ALTER TABLE ONLY public.brand_requests
ADD CONSTRAINT brand_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;