CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  fragrance_id uuid,
  type public.post_type NOT NULL,
  title text NOT NULL,
  content text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone
);

ALTER TABLE ONLY public.posts
ADD CONSTRAINT posts_pkey PRIMARY KEY (id);

CREATE INDEX idx_posts_fragrance_id ON public.posts USING btree (fragrance_id)
WHERE
  (fragrance_id IS NOT NULL);

CREATE INDEX idx_posts_type ON public.posts USING btree (type);

CREATE INDEX idx_posts_user_id ON public.posts USING btree (user_id);

ALTER TABLE ONLY public.posts
ADD CONSTRAINT posts_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.posts
ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;