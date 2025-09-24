CREATE TABLE public.accord_edits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  accord_id uuid NOT NULL,
  user_id uuid NOT NULL,
  proposed_name character varying(255),
  proposed_color text,
  proposed_description text,
  status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  reviewer_feedback text
);

ALTER TABLE ONLY public.accord_edits
ADD CONSTRAINT accord_edits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.accord_edits
ADD CONSTRAINT accord_edits_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.accord_edits
ADD CONSTRAINT accord_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);