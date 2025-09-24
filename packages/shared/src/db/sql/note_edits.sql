CREATE TABLE public.note_edits (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  note_id uuid NOT NULL,
  user_id uuid NOT NULL,
  proposed_name character varying(255),
  proposed_description text,
  proposed_thumbnail_id uuid,
  status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  reviewer_feedback text
);

ALTER TABLE ONLY public.note_edits
ADD CONSTRAINT note_edits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.note_edits
ADD CONSTRAINT note_edits_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.note_edits
ADD CONSTRAINT note_edits_proposed_thumbnail_id_fkey FOREIGN KEY (proposed_thumbnail_id) REFERENCES public.asset_uploads (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.note_edits
ADD CONSTRAINT note_edits_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.note_edits
ADD CONSTRAINT note_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);