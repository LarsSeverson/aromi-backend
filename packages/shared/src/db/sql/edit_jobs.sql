CREATE TABLE public.edit_jobs (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  edit_id uuid NOT NULL,
  edit_type public.edit_type NOT NULL,
  status public.job_status DEFAULT 'QUEUED'::public.job_status NOT NULL,
  error text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  processed_at timestamp with time zone
);

ALTER TABLE ONLY public.edit_jobs
ADD CONSTRAINT edit_jobs_pkey PRIMARY KEY (id);

CREATE INDEX idx_edit_jobs_lookup ON public.edit_jobs USING btree (edit_type, edit_id);

CREATE INDEX idx_edit_jobs_status ON public.edit_jobs USING btree (status);