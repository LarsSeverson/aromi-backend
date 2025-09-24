CREATE TABLE public.fragrances (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  brand_id uuid NOT NULL,
  description text,
  release_year integer,
  status public.fragrance_status DEFAULT 'CURRENT'::public.fragrance_status NOT NULL,
  concentration public.fragrance_concentration DEFAULT 'OTHER'::public.fragrance_concentration NOT NULL
);

ALTER TABLE ONLY public.fragrances
ADD CONSTRAINT fragrances_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrances
ADD CONSTRAINT fragrances_unique_brand_id_name UNIQUE (brand_id, name);

ALTER TABLE ONLY public.fragrances
ADD CONSTRAINT fragrances_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands (id) ON DELETE CASCADE;