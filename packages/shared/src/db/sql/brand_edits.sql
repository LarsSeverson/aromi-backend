CREATE TABLE public.brand_edits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  brand_id uuid NOT NULL,
  user_id uuid NOT NULL,
  proposed_name character varying(255),
  proposed_website text,
  proposed_description text,
  proposed_avatar_id uuid,
  status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  reviewer_feedback text
);

ALTER TABLE ONLY public.brand_edits
ADD CONSTRAINT brand_edits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.brand_edits
ADD CONSTRAINT brand_edits_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.brand_edits
ADD CONSTRAINT brand_edits_propsed_avatar_id_fkey FOREIGN KEY (proposed_avatar_id) REFERENCES public.asset_uploads (id);

ALTER TABLE ONLY public.brand_edits
ADD CONSTRAINT brand_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);