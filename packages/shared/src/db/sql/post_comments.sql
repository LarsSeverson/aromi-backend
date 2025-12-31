CREATE TABLE public.post_comments (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  post_id uuid NOT NULL,
  parent_id uuid,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  depth integer DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.post_comments
ADD CONSTRAINT post_comments_pkey PRIMARY KEY (id);

CREATE INDEX idx_post_replies_parent_id ON public.post_comments USING btree (parent_id);

CREATE INDEX idx_post_replies_post_id ON public.post_comments USING btree (post_id);

ALTER TABLE ONLY public.post_comments
ADD CONSTRAINT post_replies_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.post_comments (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_comments
ADD CONSTRAINT post_replies_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.post_comments
ADD CONSTRAINT post_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;