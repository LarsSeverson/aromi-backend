CREATE TABLE public.accord_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name character varying(255),
  color text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  user_id uuid NOT NULL,
  version integer DEFAULT 0 NOT NULL,
  description text,
  asset_id uuid,
  request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL
);

ALTER TABLE ONLY public.accord_requests
ADD CONSTRAINT accord_requests_name_key UNIQUE (name);

ALTER TABLE ONLY public.accord_requests
ADD CONSTRAINT accord_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.accord_requests
ADD CONSTRAINT accord_request_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads (id) NOT VALID;

ALTER TABLE ONLY public.accord_requests
ADD CONSTRAINT accord_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;