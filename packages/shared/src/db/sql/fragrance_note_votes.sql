CREATE TABLE public.fragrance_note_votes (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  fragrance_id uuid NOT NULL,
  note_id uuid NOT NULL,
  layer public.note_layer_enum NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  vote integer DEFAULT 0 NOT NULL,
  CONSTRAINT fragrance_note_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);

ALTER TABLE ONLY public.fragrance_note_votes
ADD CONSTRAINT fragrance_note_votes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_note_votes
ADD CONSTRAINT fragrance_note_votes_unique UNIQUE (user_id, fragrance_id, note_id, layer);

ALTER TABLE ONLY public.fragrance_note_votes
ADD CONSTRAINT fragrance_note_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_note_votes
ADD CONSTRAINT fragrance_note_votes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_note_votes
ADD CONSTRAINT fragrance_note_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;