CREATE TABLE public.fragrance_note_scores (
  fragrance_id uuid NOT NULL,
  note_id uuid NOT NULL,
  layer public.note_layer_enum NOT NULL,
  upvotes integer DEFAULT 0 NOT NULL,
  downvotes integer DEFAULT 0 NOT NULL,
  score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.fragrance_note_scores
ADD CONSTRAINT fragrance_note_scores_pkey PRIMARY KEY (fragrance_id, note_id, layer);

ALTER TABLE ONLY public.fragrance_note_scores
ADD CONSTRAINT fragrance_note_scores_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_note_scores
ADD CONSTRAINT fragrance_note_scores_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes (id) ON DELETE CASCADE;