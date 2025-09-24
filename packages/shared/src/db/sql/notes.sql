CREATE TABLE public.notes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  description text,
  thumbnail_image_id uuid
);

ALTER TABLE ONLY public.notes
ADD CONSTRAINT notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.notes
ADD CONSTRAINT notes_unique_name UNIQUE (name);

ALTER TABLE ONLY public.notes
ADD CONSTRAINT notes_thumbnail_image_id_fkey FOREIGN KEY (thumbnail_image_id) REFERENCES public.note_images (id) ON DELETE SET NULL;