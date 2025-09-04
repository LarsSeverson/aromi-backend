--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.0

-- Started on 2025-09-03 14:22:22 CDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 930 (class 1247 OID 17228)
-- Name: asset_status; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.asset_status AS ENUM (
    'staged',
    'ready'
);


ALTER TYPE public.asset_status OWNER TO aromi;

--
-- TOC entry 918 (class 1247 OID 17159)
-- Name: avatar_status; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.avatar_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'READY',
    'FAILED'
);


ALTER TYPE public.avatar_status OWNER TO aromi;

--
-- TOC entry 882 (class 1247 OID 16439)
-- Name: fragrance_reaction; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.fragrance_reaction AS ENUM (
    'like',
    'dislike'
);


ALTER TYPE public.fragrance_reaction OWNER TO aromi;

--
-- TOC entry 885 (class 1247 OID 16444)
-- Name: fragrance_trait_enum; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.fragrance_trait_enum AS ENUM (
    'longevity',
    'sillage',
    'complexity',
    'balance',
    'allure',
    'gender'
);


ALTER TYPE public.fragrance_trait_enum OWNER TO aromi;

--
-- TOC entry 888 (class 1247 OID 16458)
-- Name: image_format; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.image_format AS ENUM (
    'jpg',
    'png'
);


ALTER TYPE public.image_format OWNER TO aromi;

--
-- TOC entry 891 (class 1247 OID 16464)
-- Name: note_layer_enum; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.note_layer_enum AS ENUM (
    'top',
    'middle',
    'base'
);


ALTER TYPE public.note_layer_enum OWNER TO aromi;

--
-- TOC entry 957 (class 1247 OID 17397)
-- Name: request_status; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.request_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ACCEPTED',
    'DENIED',
    'PENDING'
);


ALTER TYPE public.request_status OWNER TO aromi;

--
-- TOC entry 894 (class 1247 OID 16472)
-- Name: upload_status; Type: TYPE; Schema: public; Owner: aromi
--

CREATE TYPE public.upload_status AS ENUM (
    'pending',
    'uploaded',
    'failed'
);


ALTER TYPE public.upload_status OWNER TO aromi;

--
-- TOC entry 247 (class 1255 OID 16479)
-- Name: auto_generate_username(); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.auto_generate_username() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If the id is not provided, fetch the next value from the sequence
    IF NEW.id IS NULL THEN
        NEW.id := nextval('users_id_seq');
    END IF;
    
    -- Set the username to 'user' concatenated with the id
    NEW.username := 'user' || NEW.id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_generate_username() OWNER TO aromi;

--
-- TOC entry 248 (class 1255 OID 16480)
-- Name: fragrance_accord_votes_agg(); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.fragrance_accord_votes_agg() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  old_vote int := coalesce(old.vote, 0);
  new_vote int := coalesce(new.vote, 0);
begin
  update fragrance_accords
  set  likes_count    = likes_count    + (new_vote = 1)::int - (old_vote = 1)::int,
       dislikes_count = dislikes_count + (new_vote = -1)::int - (old_vote = -1)::int,
       vote_score     = vote_score     + new_vote - old_vote
  where id = new.fragrance_accord_id;
  return new;
end;
$$;


ALTER FUNCTION public.fragrance_accord_votes_agg() OWNER TO aromi;

--
-- TOC entry 249 (class 1255 OID 16481)
-- Name: fragrance_note_votes_agg(); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.fragrance_note_votes_agg() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  old_vote int := coalesce(old.vote, 0);
  new_vote int := coalesce(new.vote, 0);
begin
  update fragrance_notes
  set  likes_count    = likes_count    + (new_vote = 1)::int - (old_vote = 1)::int,
       dislikes_count = dislikes_count + (new_vote = -1)::int - (old_vote = -1)::int,
       vote_score     = vote_score     + new_vote - old_vote
  where id = new.fragrance_note_id;
  return new;
end;
$$;


ALTER FUNCTION public.fragrance_note_votes_agg() OWNER TO aromi;

--
-- TOC entry 250 (class 1255 OID 16482)
-- Name: fragrance_review_votes_agg(); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.fragrance_review_votes_agg() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  old_vote int := coalesce(old.vote, 0);
  new_vote int := coalesce(new.vote, 0);
begin
  update fragrance_reviews
  set  likes_count    = likes_count    + (new_vote = 1)::int - (old_vote = 1)::int,
       dislikes_count = dislikes_count + (new_vote = -1)::int - (old_vote = -1)::int,
       vote_score     = vote_score     + new_vote - old_vote
  where id = new.fragrance_review_id;
  return new;
end;
$$;


ALTER FUNCTION public.fragrance_review_votes_agg() OWNER TO aromi;

--
-- TOC entry 251 (class 1255 OID 16483)
-- Name: fragrance_reviews_count_inc(); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.fragrance_reviews_count_inc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  update fragrances
  set  reviews_count = reviews_count + 1
  where id = new.fragrance_id;
  return new;
end;
$$;


ALTER FUNCTION public.fragrance_reviews_count_inc() OWNER TO aromi;

--
-- TOC entry 252 (class 1255 OID 16484)
-- Name: fragrance_votes_agg(); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.fragrance_votes_agg() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  old_vote int := coalesce(old.vote, 0);
  new_vote int := coalesce(new.vote, 0);
begin
  update fragrances
  set  likes_count    = likes_count    + (new_vote = 1)::int - (old_vote = 1)::int,
       dislikes_count = dislikes_count + (new_vote = -1)::int - (old_vote = -1)::int,
       vote_score     = vote_score     + new_vote - old_vote
  where id = new.fragrance_id;
  return new;
end;
$$;


ALTER FUNCTION public.fragrance_votes_agg() OWNER TO aromi;

--
-- TOC entry 253 (class 1255 OID 16485)
-- Name: generate_s3_key(integer); Type: FUNCTION; Schema: public; Owner: aromi
--

CREATE FUNCTION public.generate_s3_key(i integer) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT 'note_images/' || i::text || '.png';
$$;


ALTER FUNCTION public.generate_s3_key(i integer) OWNER TO aromi;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 240 (class 1259 OID 17518)
-- Name: accord_request_images; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.accord_request_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.accord_request_images OWNER TO aromi;

--
-- TOC entry 245 (class 1259 OID 17605)
-- Name: accord_request_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.accord_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT accord_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 1])))
);


ALTER TABLE public.accord_request_votes OWNER TO aromi;

--
-- TOC entry 239 (class 1259 OID 17498)
-- Name: accord_requests; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.accord_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    color text,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    description text
);


ALTER TABLE public.accord_requests OWNER TO aromi;

--
-- TOC entry 219 (class 1259 OID 16933)
-- Name: accords; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.accords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    old_id integer NOT NULL,
    name character varying(255) NOT NULL,
    color character(7) DEFAULT '#C6471D'::bpchar NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT accords_new_color_check CHECK ((color ~ '^#[0-9A-Fa-f]{6}$'::text))
);


ALTER TABLE public.accords OWNER TO aromi;

--
-- TOC entry 236 (class 1259 OID 17427)
-- Name: brand_images; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.brand_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    type text NOT NULL,
    s3_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brand_images OWNER TO aromi;

--
-- TOC entry 238 (class 1259 OID 17483)
-- Name: brand_request_images; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.brand_request_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brand_request_images OWNER TO aromi;

--
-- TOC entry 244 (class 1259 OID 17585)
-- Name: brand_request_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.brand_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT brand_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 1])))
);


ALTER TABLE public.brand_request_votes OWNER TO aromi;

--
-- TOC entry 237 (class 1259 OID 17443)
-- Name: brand_requests; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.brand_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    description text,
    website text,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.brand_requests OWNER TO aromi;

--
-- TOC entry 235 (class 1259 OID 17407)
-- Name: brands; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.brands OWNER TO aromi;

--
-- TOC entry 226 (class 1259 OID 17132)
-- Name: fragrance_accord_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_accord_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_accord_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    vote integer NOT NULL,
    CONSTRAINT fragrance_accord_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


ALTER TABLE public.fragrance_accord_votes OWNER TO aromi;

--
-- TOC entry 220 (class 1259 OID 16941)
-- Name: fragrance_accords; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_accords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    accord_id uuid NOT NULL,
    vote_score integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    likes_count integer DEFAULT 0 NOT NULL,
    dislikes_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.fragrance_accords OWNER TO aromi;

--
-- TOC entry 224 (class 1259 OID 17050)
-- Name: fragrance_collections; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fragrance_collections OWNER TO aromi;

--
-- TOC entry 218 (class 1259 OID 16913)
-- Name: fragrance_images; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    old_s3_key character varying(255) NOT NULL,
    s3_key character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    primary_color character varying(7),
    width integer DEFAULT 0 NOT NULL,
    height integer DEFAULT 0 NOT NULL,
    url text
);


ALTER TABLE public.fragrance_images OWNER TO aromi;

--
-- TOC entry 225 (class 1259 OID 17086)
-- Name: fragrance_note_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_note_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_note_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    vote integer NOT NULL,
    CONSTRAINT fragrance_note_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


ALTER TABLE public.fragrance_note_votes OWNER TO aromi;

--
-- TOC entry 222 (class 1259 OID 16976)
-- Name: fragrance_notes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    note_id uuid NOT NULL,
    vote_score integer DEFAULT 0 NOT NULL,
    layer public.note_layer_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    likes_count integer DEFAULT 0 NOT NULL,
    dislikes_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.fragrance_notes OWNER TO aromi;

--
-- TOC entry 233 (class 1259 OID 17328)
-- Name: fragrance_request_accords; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_request_accords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    accord_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fragrance_request_accords OWNER TO aromi;

--
-- TOC entry 228 (class 1259 OID 17233)
-- Name: fragrance_request_images; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_request_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fragrance_request_images OWNER TO aromi;

--
-- TOC entry 234 (class 1259 OID 17367)
-- Name: fragrance_request_notes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_request_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    note_id uuid NOT NULL,
    layer public.note_layer_enum,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fragrance_request_notes OWNER TO aromi;

--
-- TOC entry 232 (class 1259 OID 17305)
-- Name: fragrance_request_traits; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_request_traits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    trait_type_id uuid NOT NULL,
    trait_option_id uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fragrance_request_traits OWNER TO aromi;

--
-- TOC entry 243 (class 1259 OID 17565)
-- Name: fragrance_request_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fragrance_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 1])))
);


ALTER TABLE public.fragrance_request_votes OWNER TO aromi;

--
-- TOC entry 227 (class 1259 OID 17198)
-- Name: fragrance_requests; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text,
    concentration text DEFAULT 'OTHER'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    fragrance_status text DEFAULT 'CURRENT'::text,
    version integer DEFAULT 0 NOT NULL,
    deleted_at timestamp with time zone,
    description text,
    release_year integer,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL,
    brand_id uuid
);


ALTER TABLE public.fragrance_requests OWNER TO aromi;

--
-- TOC entry 231 (class 1259 OID 17276)
-- Name: fragrance_trait_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrance_trait_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    fragrance_id uuid NOT NULL,
    trait_type_id uuid NOT NULL,
    trait_option_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fragrance_trait_votes OWNER TO aromi;

--
-- TOC entry 217 (class 1259 OID 16861)
-- Name: fragrances; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.fragrances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    old_id integer NOT NULL,
    name character varying(255) NOT NULL,
    rating real,
    reviews_count integer NOT NULL,
    likes_count integer NOT NULL,
    dislikes_count integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    vote_score integer DEFAULT 0 NOT NULL,
    brand_id uuid
);


ALTER TABLE public.fragrances OWNER TO aromi;

--
-- TOC entry 242 (class 1259 OID 17550)
-- Name: note_request_images; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.note_request_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.note_request_images OWNER TO aromi;

--
-- TOC entry 246 (class 1259 OID 17625)
-- Name: note_request_votes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.note_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT note_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 1])))
);


ALTER TABLE public.note_request_votes OWNER TO aromi;

--
-- TOC entry 241 (class 1259 OID 17533)
-- Name: note_requests; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.note_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.note_requests OWNER TO aromi;

--
-- TOC entry 221 (class 1259 OID 16964)
-- Name: notes; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    old_id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    s3_key character varying(100),
    thumbnail_s3_key text NOT NULL,
    thumbnail_url text NOT NULL
);


ALTER TABLE public.notes OWNER TO aromi;

--
-- TOC entry 230 (class 1259 OID 17261)
-- Name: trait_options; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.trait_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trait_type_id uuid NOT NULL,
    label text NOT NULL,
    score integer NOT NULL
);


ALTER TABLE public.trait_options OWNER TO aromi;

--
-- TOC entry 229 (class 1259 OID 17251)
-- Name: trait_types; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.trait_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.trait_types OWNER TO aromi;

--
-- TOC entry 223 (class 1259 OID 17040)
-- Name: users; Type: TABLE; Schema: public; Owner: aromi
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    cognito_sub text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    avatar_s3_key text,
    avatar_updated_at timestamp with time zone DEFAULT now() NOT NULL,
    avatar_error text,
    avatar_url text,
    avatar_status public.avatar_status DEFAULT 'PENDING'::public.avatar_status NOT NULL
);


ALTER TABLE public.users OWNER TO aromi;

--
-- TOC entry 4477 (class 2606 OID 17527)
-- Name: accord_request_images accord_request_images_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_request_images
    ADD CONSTRAINT accord_request_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4493 (class 2606 OID 17612)
-- Name: accord_request_votes accord_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4495 (class 2606 OID 17614)
-- Name: accord_request_votes accord_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- TOC entry 4473 (class 2606 OID 17511)
-- Name: accord_requests accord_requests_name_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_requests_name_key UNIQUE (name);


--
-- TOC entry 4475 (class 2606 OID 17509)
-- Name: accord_requests accord_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4403 (class 2606 OID 16940)
-- Name: accords accords_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accords
    ADD CONSTRAINT accords_pkey PRIMARY KEY (id);


--
-- TOC entry 4463 (class 2606 OID 17437)
-- Name: brand_images brand_images_brand_type_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_images
    ADD CONSTRAINT brand_images_brand_type_key UNIQUE (brand_id, type);


--
-- TOC entry 4465 (class 2606 OID 17435)
-- Name: brand_images brand_images_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_images
    ADD CONSTRAINT brand_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4471 (class 2606 OID 17492)
-- Name: brand_request_images brand_request_images_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_request_images
    ADD CONSTRAINT brand_request_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4489 (class 2606 OID 17592)
-- Name: brand_request_votes brand_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4491 (class 2606 OID 17594)
-- Name: brand_request_votes brand_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- TOC entry 4467 (class 2606 OID 17455)
-- Name: brand_requests brand_requests_name_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_name_key UNIQUE (name);


--
-- TOC entry 4469 (class 2606 OID 17453)
-- Name: brand_requests brand_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4459 (class 2606 OID 17416)
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- TOC entry 4461 (class 2606 OID 17414)
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- TOC entry 4427 (class 2606 OID 17140)
-- Name: fragrance_accord_votes fragrance_accord_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fragrance_accord_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4405 (class 2606 OID 16951)
-- Name: fragrance_accords fragrance_accords_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT fragrance_accords_pkey PRIMARY KEY (id);


--
-- TOC entry 4421 (class 2606 OID 17059)
-- Name: fragrance_collections fragrance_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_collections
    ADD CONSTRAINT fragrance_collections_pkey PRIMARY KEY (id);


--
-- TOC entry 4399 (class 2606 OID 16924)
-- Name: fragrance_images fragrance_images_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_images
    ADD CONSTRAINT fragrance_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4401 (class 2606 OID 16926)
-- Name: fragrance_images fragrance_images_unique; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_images
    ADD CONSTRAINT fragrance_images_unique UNIQUE (s3_key);


--
-- TOC entry 4423 (class 2606 OID 17094)
-- Name: fragrance_note_votes fragrance_note_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fragrance_note_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4413 (class 2606 OID 16986)
-- Name: fragrance_notes fragrance_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT fragrance_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4451 (class 2606 OID 17336)
-- Name: fragrance_request_accords fragrance_request_accords_draft_id_accord_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_draft_id_accord_id_key UNIQUE (request_id, accord_id);


--
-- TOC entry 4453 (class 2606 OID 17334)
-- Name: fragrance_request_accords fragrance_request_accords_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_pkey PRIMARY KEY (id);


--
-- TOC entry 4433 (class 2606 OID 17241)
-- Name: fragrance_request_images fragrance_request_images_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_images
    ADD CONSTRAINT fragrance_request_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4455 (class 2606 OID 17373)
-- Name: fragrance_request_notes fragrance_request_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4457 (class 2606 OID 17375)
-- Name: fragrance_request_notes fragrance_request_notes_request_id_note_id_layer_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_request_id_note_id_layer_key UNIQUE (request_id, note_id, layer);


--
-- TOC entry 4447 (class 2606 OID 17312)
-- Name: fragrance_request_traits fragrance_request_traits_request_id_trait_type_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_request_id_trait_type_id_key UNIQUE (request_id, trait_type_id);


--
-- TOC entry 4485 (class 2606 OID 17572)
-- Name: fragrance_request_votes fragrance_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4487 (class 2606 OID 17574)
-- Name: fragrance_request_votes fragrance_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- TOC entry 4431 (class 2606 OID 17206)
-- Name: fragrance_requests fragrance_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4449 (class 2606 OID 17310)
-- Name: fragrance_request_traits fragrance_requests_traits_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_requests_traits_pkey PRIMARY KEY (id);


--
-- TOC entry 4443 (class 2606 OID 17282)
-- Name: fragrance_trait_votes fragrance_trait_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4445 (class 2606 OID 17284)
-- Name: fragrance_trait_votes fragrance_trait_votes_user_id_fragrance_id_trait_type_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_user_id_fragrance_id_trait_type_id_key UNIQUE (user_id, fragrance_id, trait_type_id);


--
-- TOC entry 4395 (class 2606 OID 16869)
-- Name: fragrances fragrances_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrances
    ADD CONSTRAINT fragrances_pkey PRIMARY KEY (id);


--
-- TOC entry 4397 (class 2606 OID 17423)
-- Name: fragrances fragrances_unique_brand_id_name; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrances
    ADD CONSTRAINT fragrances_unique_brand_id_name UNIQUE (brand_id, name);


--
-- TOC entry 4483 (class 2606 OID 17559)
-- Name: note_request_images note_request_images_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_request_images
    ADD CONSTRAINT note_request_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4497 (class 2606 OID 17632)
-- Name: note_request_votes note_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4499 (class 2606 OID 17634)
-- Name: note_request_votes note_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- TOC entry 4479 (class 2606 OID 17544)
-- Name: note_requests note_requests_name_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_name_key UNIQUE (name);


--
-- TOC entry 4481 (class 2606 OID 17542)
-- Name: note_requests note_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4409 (class 2606 OID 16973)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4411 (class 2606 OID 16975)
-- Name: notes notes_unique_name; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_unique_name UNIQUE (name);


--
-- TOC entry 4439 (class 2606 OID 17268)
-- Name: trait_options trait_options_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.trait_options
    ADD CONSTRAINT trait_options_pkey PRIMARY KEY (id);


--
-- TOC entry 4441 (class 2606 OID 17270)
-- Name: trait_options trait_options_trait_type_id_score_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.trait_options
    ADD CONSTRAINT trait_options_trait_type_id_score_key UNIQUE (trait_type_id, score);


--
-- TOC entry 4435 (class 2606 OID 17260)
-- Name: trait_types trait_types_name_key; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.trait_types
    ADD CONSTRAINT trait_types_name_key UNIQUE (name);


--
-- TOC entry 4437 (class 2606 OID 17258)
-- Name: trait_types trait_types_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.trait_types
    ADD CONSTRAINT trait_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4429 (class 2606 OID 17142)
-- Name: fragrance_accord_votes unique_accord_user; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT unique_accord_user UNIQUE (fragrance_accord_id, user_id);


--
-- TOC entry 4407 (class 2606 OID 16953)
-- Name: fragrance_accords unique_fragrance_accord; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT unique_fragrance_accord UNIQUE (fragrance_id, accord_id);


--
-- TOC entry 4415 (class 2606 OID 16988)
-- Name: fragrance_notes unique_fragrance_note; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT unique_fragrance_note UNIQUE (fragrance_id, note_id, layer);


--
-- TOC entry 4425 (class 2606 OID 17096)
-- Name: fragrance_note_votes unique_fragrance_note_vote; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT unique_fragrance_note_vote UNIQUE (fragrance_note_id, user_id);


--
-- TOC entry 4417 (class 2606 OID 17156)
-- Name: users unqiue_email; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unqiue_email UNIQUE (email);


--
-- TOC entry 4419 (class 2606 OID 17047)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4530 (class 2606 OID 17528)
-- Name: accord_request_images accord_request_images_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_request_images
    ADD CONSTRAINT accord_request_images_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.accord_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4537 (class 2606 OID 17620)
-- Name: accord_request_votes accord_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.accord_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4538 (class 2606 OID 17615)
-- Name: accord_request_votes accord_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4529 (class 2606 OID 17512)
-- Name: accord_requests accord_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4526 (class 2606 OID 17438)
-- Name: brand_images brand_images_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_images
    ADD CONSTRAINT brand_images_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- TOC entry 4528 (class 2606 OID 17493)
-- Name: brand_request_images brand_request_images_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_request_images
    ADD CONSTRAINT brand_request_images_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.brand_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4535 (class 2606 OID 17600)
-- Name: brand_request_votes brand_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.brand_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4536 (class 2606 OID 17595)
-- Name: brand_request_votes brand_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4527 (class 2606 OID 17477)
-- Name: brand_requests brand_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4502 (class 2606 OID 16959)
-- Name: fragrance_accords fk_accord_id; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT fk_accord_id FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4509 (class 2606 OID 17143)
-- Name: fragrance_accord_votes fk_fragrance_accord; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fk_fragrance_accord FOREIGN KEY (fragrance_accord_id) REFERENCES public.fragrance_accords(id) ON DELETE CASCADE;


--
-- TOC entry 4503 (class 2606 OID 16954)
-- Name: fragrance_accords fk_fragrance_id; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT fk_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4504 (class 2606 OID 16989)
-- Name: fragrance_notes fk_fragrance_id; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT fk_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4507 (class 2606 OID 17097)
-- Name: fragrance_note_votes fk_fragrance_note; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fk_fragrance_note FOREIGN KEY (fragrance_note_id) REFERENCES public.fragrance_notes(id) ON DELETE CASCADE;


--
-- TOC entry 4505 (class 2606 OID 16994)
-- Name: fragrance_notes fk_note_id; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES public.notes(id) ON UPDATE CASCADE;


--
-- TOC entry 4510 (class 2606 OID 17148)
-- Name: fragrance_accord_votes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4508 (class 2606 OID 17102)
-- Name: fragrance_note_votes fk_user_new; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fk_user_new FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4506 (class 2606 OID 17060)
-- Name: fragrance_collections fragrance_collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_collections
    ADD CONSTRAINT fragrance_collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4501 (class 2606 OID 16927)
-- Name: fragrance_images fragrance_images_new_fragrance_id; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_images
    ADD CONSTRAINT fragrance_images_new_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4522 (class 2606 OID 17342)
-- Name: fragrance_request_accords fragrance_request_accords_accord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON DELETE CASCADE;


--
-- TOC entry 4523 (class 2606 OID 17337)
-- Name: fragrance_request_accords fragrance_request_accords_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4513 (class 2606 OID 17242)
-- Name: fragrance_request_images fragrance_request_images_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_images
    ADD CONSTRAINT fragrance_request_images_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4524 (class 2606 OID 17381)
-- Name: fragrance_request_notes fragrance_request_notes_draft_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_draft_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4525 (class 2606 OID 17376)
-- Name: fragrance_request_notes fragrance_request_notes_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- TOC entry 4519 (class 2606 OID 17313)
-- Name: fragrance_request_traits fragrance_request_traits_draft_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_draft_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4520 (class 2606 OID 17323)
-- Name: fragrance_request_traits fragrance_request_traits_trait_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_trait_option_id_fkey FOREIGN KEY (trait_option_id) REFERENCES public.trait_options(id);


--
-- TOC entry 4521 (class 2606 OID 17318)
-- Name: fragrance_request_traits fragrance_request_traits_trait_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types(id) ON DELETE CASCADE;


--
-- TOC entry 4533 (class 2606 OID 17580)
-- Name: fragrance_request_votes fragrance_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4534 (class 2606 OID 17575)
-- Name: fragrance_request_votes fragrance_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4511 (class 2606 OID 17472)
-- Name: fragrance_requests fragrance_requests_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) NOT VALID;


--
-- TOC entry 4512 (class 2606 OID 17207)
-- Name: fragrance_requests fragrance_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4515 (class 2606 OID 17290)
-- Name: fragrance_trait_votes fragrance_trait_votes_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- TOC entry 4516 (class 2606 OID 17300)
-- Name: fragrance_trait_votes fragrance_trait_votes_trait_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_trait_option_id_fkey FOREIGN KEY (trait_option_id) REFERENCES public.trait_options(id) ON DELETE CASCADE;


--
-- TOC entry 4517 (class 2606 OID 17295)
-- Name: fragrance_trait_votes fragrance_trait_votes_trait_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types(id) ON DELETE CASCADE;


--
-- TOC entry 4518 (class 2606 OID 17285)
-- Name: fragrance_trait_votes fragrance_trait_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4500 (class 2606 OID 17417)
-- Name: fragrances fragrances_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.fragrances
    ADD CONSTRAINT fragrances_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- TOC entry 4532 (class 2606 OID 17560)
-- Name: note_request_images note_request_images_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_request_images
    ADD CONSTRAINT note_request_images_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.note_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4539 (class 2606 OID 17640)
-- Name: note_request_votes note_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.note_requests(id) ON DELETE CASCADE;


--
-- TOC entry 4540 (class 2606 OID 17635)
-- Name: note_request_votes note_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4531 (class 2606 OID 17545)
-- Name: note_requests note_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4514 (class 2606 OID 17271)
-- Name: trait_options trait_options_trait_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aromi
--

ALTER TABLE ONLY public.trait_options
    ADD CONSTRAINT trait_options_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types(id) ON DELETE CASCADE;


-- Completed on 2025-09-03 14:22:26 CDT

--
-- PostgreSQL database dump complete
--

