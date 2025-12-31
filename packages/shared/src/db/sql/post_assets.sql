CREATE TABLE public.post_assets (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  post_id uuid NOT NULL,
  asset_id uuid NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.post_assets
ADD CONSTRAINT post_assets_pkey PRIMARY KEY (id);

CREATE INDEX idx_post_assets_asset_id ON public.post_assets USING btree (asset_id);

CREATE INDEX idx_post_assets_post_id ON public.post_assets USING btree (post_id);

ALTER TABLE ONLY public.post_assets
ADD CONSTRAINT post_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_assets
ADD CONSTRAINT post_assets_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts (id) ON DELETE CASCADE;