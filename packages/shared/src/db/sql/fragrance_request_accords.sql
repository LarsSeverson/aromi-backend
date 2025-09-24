CREATE TABLE public.fragrance_request_accords (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  request_id uuid NOT NULL,
  accord_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.fragrance_request_accords
ADD CONSTRAINT fragrance_request_accords_draft_id_accord_id_key UNIQUE (request_id, accord_id);

ALTER TABLE ONLY public.fragrance_request_accords
ADD CONSTRAINT fragrance_request_accords_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fragrance_request_accords
ADD CONSTRAINT fragrance_request_accords_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.fragrance_request_accords
ADD CONSTRAINT fragrance_request_accords_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests (id) ON DELETE CASCADE;