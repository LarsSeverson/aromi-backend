CREATE TABLE public.note_images (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  note_id uuid NOT NULL,
  s3_key text NOT NULL,
  name text NOT NULL,
  content_type text NOT NULL,
  size_bytes bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.note_images
ADD CONSTRAINT note_images_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.note_images
ADD CONSTRAINT note_images_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes (id) ON DELETE CASCADE;