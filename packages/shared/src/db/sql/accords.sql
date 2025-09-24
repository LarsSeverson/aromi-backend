CREATE TABLE public.accords (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name character varying(255) NOT NULL,
  color character(7) DEFAULT '#C6471D'::bpchar NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  description text,
  CONSTRAINT accords_new_color_check CHECK ((color ~ '^#[0-9A-Fa-f]{6}$'::text))
);

ALTER TABLE ONLY public.accords
ADD CONSTRAINT accords_pkey PRIMARY KEY (id);