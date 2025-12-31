CREATE TABLE public.post_comment_assets (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  comment_id uuid NOT NULL,
  asset_id uuid NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.post_comment_assets
ADD CONSTRAINT post_comment_assets_pkey PRIMARY KEY (id);

CREATE INDEX idx_post_reply_assets_asset_id ON public.post_comment_assets USING btree (asset_id);

CREATE INDEX idx_post_reply_assets_replu_id ON public.post_comment_assets USING btree (comment_id);

ALTER TABLE ONLY public.post_comment_assets
ADD CONSTRAINT post_comment_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_comment_assets
ADD CONSTRAINT post_comment_assets_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.post_comments (id) ON DELETE CASCADE;