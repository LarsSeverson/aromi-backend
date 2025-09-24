CREATE TABLE public.fragrance_request_notes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  request_id uuid NOT NULL,
  note_id uuid NOT NULL,
  layer public.note_layer_enum NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.fragrance_request_notes
ADD CONSTRAINT fragrance_request_notes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_request_notes
ADD CONSTRAINT fragrance_request_notes_request_id_note_id_layer_key UNIQUE (request_id, note_id, layer);

ALTER TABLE ONLY public.fragrance_request_notes
ADD CONSTRAINT fragrance_request_notes_draft_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_request_notes
ADD CONSTRAINT fragrance_request_notes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes (id) ON DELETE CASCADE;