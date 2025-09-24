CREATE TABLE public.fragrance_notes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  fragrance_id uuid NOT NULL,
  note_id uuid NOT NULL,
  vote_score integer DEFAULT 0 NOT NULL,
  layer public.note_layer_enum NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  likes_count integer DEFAULT 0 NOT NULL,
  dislikes_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.fragrance_notes
ADD CONSTRAINT fragrance_notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_notes
ADD CONSTRAINT unique_fragrance_note UNIQUE (fragrance_id, note_id, layer);

ALTER TABLE ONLY public.fragrance_notes
ADD CONSTRAINT fk_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.fragrance_notes
ADD CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES public.notes (id) ON UPDATE CASCADE;