CREATE TABLE public.request_jobs (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  request_id uuid NOT NULL,
  request_type public.request_type NOT NULL,
  status public.job_status DEFAULT 'QUEUED'::public.job_status NOT NULL,
  error text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  processed_at timestamp with time zone
);

ALTER TABLE ONLY public.request_jobs
ADD CONSTRAINT request_jobs_pkey PRIMARY KEY (id);

CREATE INDEX idx_request_jobs_lookup ON public.request_jobs USING btree (request_type, request_id);

CREATE INDEX idx_request_jobs_status ON public.request_jobs USING btree (status);