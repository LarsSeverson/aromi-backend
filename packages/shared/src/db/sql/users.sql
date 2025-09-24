CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  username text NOT NULL,
  cognito_sub text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp with time zone,
  role public.user_role DEFAULT 'USER'::public.user_role NOT NULL,
  avatar_id uuid
);

ALTER TABLE ONLY public.users
ADD CONSTRAINT unqiue_email UNIQUE (email);

ALTER TABLE ONLY public.users
ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
ADD CONSTRAINT user_avatar_id_fkey FOREIGN KEY (avatar_id) REFERENCES public.user_images (id) NOT VALID;