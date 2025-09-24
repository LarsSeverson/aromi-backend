CREATE TABLE public.fragrance_requests (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text,
  concentration public.fragrance_concentration DEFAULT 'OTHER'::public.fragrance_concentration,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  fragrance_status public.fragrance_status DEFAULT 'CURRENT'::public.fragrance_status,
  version integer DEFAULT 0 NOT NULL,
  deleted_at timestamp with time zone,
  description text,
  release_year integer,
  brand_id uuid,
  asset_id uuid,
  request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL
);

ALTER TABLE ONLY public.fragrance_requests
ADD CONSTRAINT fragrance_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_requests
ADD CONSTRAINT fragrance_requests_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads (id) NOT VALID;

ALTER TABLE ONLY public.fragrance_requests
ADD CONSTRAINT fragrance_requests_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands (id) NOT VALID;

ALTER TABLE ONLY public.fragrance_requests
ADD CONSTRAINT fragrance_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);