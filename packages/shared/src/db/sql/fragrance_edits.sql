CREATE TABLE public.fragrance_edits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  fragrance_id uuid NOT NULL,
  user_id uuid NOT NULL,
  proposed_name character varying(255),
  proposed_description text,
  proposed_release_year integer,
  proposed_concentration public.fragrance_concentration,
  proposed_status public.fragrance_status,
  proposed_brand_id uuid,
  proposed_image_id uuid,
  status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
  reason text,
  reviewer_feedback text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewed_by uuid
);

ALTER TABLE ONLY public.fragrance_edits
ADD CONSTRAINT fragrance_edits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_edits
ADD CONSTRAINT fragrance_edits_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_edits
ADD CONSTRAINT fragrance_edits_proposed_brand_id_fkey FOREIGN KEY (proposed_brand_id) REFERENCES public.brands (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.fragrance_edits
ADD CONSTRAINT fragrance_edits_proposed_image_id_fkey FOREIGN KEY (proposed_image_id) REFERENCES public.asset_uploads (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.fragrance_edits
ADD CONSTRAINT fragrance_edits_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.fragrance_edits
ADD CONSTRAINT fragrance_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);