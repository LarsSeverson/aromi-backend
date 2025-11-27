CREATE TABLE public.user_follows (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  follower_id uuid NOT NULL,
  followed_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  CONSTRAINT user_follows_check CHECK ((follower_id <> followed_id))
);

ALTER TABLE ONLY public.user_follows
ADD CONSTRAINT user_follows_follower_id_followed_id_key UNIQUE (follower_id, followed_id);

ALTER TABLE ONLY public.user_follows
ADD CONSTRAINT user_follows_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_follows
ADD CONSTRAINT user_follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_follows
ADD CONSTRAINT user_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users (id) ON DELETE CASCADE;