--
-- PostgreSQL database dump
--

\restrict t5njpgbfWg9P8EIKoij9fn5bYxsiuqG1UzQV1B2hE0OdWlGeHenuNzyW2FPCYvL

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

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
-- Name: asset_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.asset_status AS ENUM (
    'staged',
    'ready'
);


--
-- Name: avatar_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.avatar_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'READY',
    'FAILED'
);


--
-- Name: edit_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.edit_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: edit_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.edit_type AS ENUM (
    'brand',
    'fragrance',
    'note',
    'accord'
);


--
-- Name: fragrance_concentration; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fragrance_concentration AS ENUM (
    'BODY_MIST',
    'EAU_FRAICHE',
    'EDC',
    'EDP',
    'EDT',
    'OIL',
    'OTHER',
    'PARFUM'
);


--
-- Name: fragrance_reaction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fragrance_reaction AS ENUM (
    'like',
    'dislike'
);


--
-- Name: fragrance_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fragrance_status AS ENUM (
    'CURRENT',
    'DISCONTINUED',
    'REFORMULATED'
);


--
-- Name: fragrance_trait_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fragrance_trait_enum AS ENUM (
    'longevity',
    'sillage',
    'complexity',
    'balance',
    'allure',
    'gender'
);


--
-- Name: job_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.job_status AS ENUM (
    'QUEUED',
    'PROCESSING',
    'SUCCESS',
    'FAILED'
);


--
-- Name: note_layer_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.note_layer_enum AS ENUM (
    'top',
    'middle',
    'base'
);


--
-- Name: post_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.post_type AS ENUM (
    'TEXT',
    'MEDIA',
    'FRAGRANCE'
);


--
-- Name: request_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.request_status AS ENUM (
    'DRAFT',
    'PENDING',
    'ACCEPTED',
    'DENIED'
);


--
-- Name: request_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.request_type AS ENUM (
    'fragrance',
    'brand',
    'accord',
    'note'
);


--
-- Name: upload_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.upload_status AS ENUM (
    'pending',
    'uploaded',
    'failed'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'USER',
    'MODERATOR',
    'ADMIN'
);


SET default_table_access_method = heap;

--
-- Name: accord_edits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accord_edits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accord_id uuid NOT NULL,
    user_id uuid NOT NULL,
    proposed_name character varying(255),
    proposed_color text,
    proposed_description text,
    status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    reviewer_feedback text
);


--
-- Name: accord_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accord_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accord_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: accord_request_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accord_request_scores (
    request_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);


--
-- Name: accord_request_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accord_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT accord_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: accord_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accord_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    color text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    description text,
    asset_id uuid,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL
);


--
-- Name: accords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    color character(7) DEFAULT '#C6471D'::bpchar NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    description text,
    CONSTRAINT accords_new_color_check CHECK ((color ~ '^#[0-9A-Fa-f]{6}$'::text))
);


--
-- Name: asset_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asset_uploads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    status public.asset_status DEFAULT 'staged'::public.asset_status NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid
);


--
-- Name: brand_edits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_edits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    user_id uuid NOT NULL,
    proposed_name character varying(255),
    proposed_website text,
    proposed_description text,
    proposed_avatar_id uuid,
    status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    reviewer_feedback text
);


--
-- Name: brand_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand_id uuid NOT NULL,
    content_type text NOT NULL,
    s3_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    size_bytes bigint NOT NULL,
    name text NOT NULL
);


--
-- Name: brand_request_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_request_scores (
    request_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);


--
-- Name: brand_request_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT brand_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: brand_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    description text,
    website text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    asset_id uuid,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL
);


--
-- Name: brand_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_scores (
    brand_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: brand_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    vote smallint NOT NULL,
    CONSTRAINT brand_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    website text,
    description text,
    avatar_id uuid
);


--
-- Name: edit_jobs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: fragrance_accord_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_accord_scores (
    fragrance_id uuid NOT NULL,
    accord_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fragrance_accord_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_accord_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    fragrance_id uuid NOT NULL,
    accord_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    vote integer DEFAULT 0 NOT NULL,
    CONSTRAINT fragrance_accord_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: fragrance_accords; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: fragrance_collection_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_collection_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collection_id uuid NOT NULL,
    fragrance_id uuid NOT NULL,
    rank double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


--
-- Name: fragrance_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fragrance_edits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_edits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    user_id uuid NOT NULL,
    proposed_name character varying(255),
    proposed_description text,
    proposed_release_year integer,
    proposed_concentration public.fragrance_concentration,
    proposed_status public.fragrance_status,
    proposed_brand_id uuid,
    proposed_image_id uuid,
    status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
    reason text,
    reviewer_feedback text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewed_by uuid
);


--
-- Name: fragrance_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    old_s3_key character varying(255),
    s3_key character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    primary_color character varying(7),
    width integer DEFAULT 0 NOT NULL,
    height integer DEFAULT 0 NOT NULL,
    url text,
    content_type text DEFAULT 'image/jpeg'::text NOT NULL,
    name text DEFAULT 'unknown'::text NOT NULL,
    size_bytes bigint DEFAULT 0 NOT NULL
);


--
-- Name: fragrance_note_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_note_scores (
    fragrance_id uuid NOT NULL,
    note_id uuid NOT NULL,
    layer public.note_layer_enum NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fragrance_note_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_note_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    fragrance_id uuid NOT NULL,
    note_id uuid NOT NULL,
    layer public.note_layer_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    vote integer DEFAULT 0 NOT NULL,
    CONSTRAINT fragrance_note_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: fragrance_notes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: fragrance_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    user_id uuid NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fragrance_request_accords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_request_accords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    accord_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fragrance_request_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_request_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    note_id uuid NOT NULL,
    layer public.note_layer_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fragrance_request_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_request_scores (
    request_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);


--
-- Name: fragrance_request_traits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_request_traits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    trait_type_id uuid NOT NULL,
    trait_option_id uuid NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fragrance_request_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fragrance_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: fragrance_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text,
    concentration public.fragrance_concentration DEFAULT 'OTHER'::public.fragrance_concentration,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    fragrance_status public.fragrance_status DEFAULT 'CURRENT'::public.fragrance_status,
    version integer DEFAULT 0 NOT NULL,
    deleted_at timestamp with time zone,
    description text,
    release_year integer,
    brand_id uuid,
    asset_id uuid,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL
);


--
-- Name: fragrance_review_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_review_scores (
    review_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);


--
-- Name: fragrance_review_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_review_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    review_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT fragrance_review_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: fragrance_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fragrance_id uuid NOT NULL,
    user_id uuid NOT NULL,
    body text,
    rating smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT fragrance_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: fragrance_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_scores (
    fragrance_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    average_rating real,
    review_count integer DEFAULT 0 NOT NULL
);


--
-- Name: fragrance_trait_votes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: fragrance_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrance_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    fragrance_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    vote smallint NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fragrance_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: fragrances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fragrances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    brand_id uuid NOT NULL,
    description text,
    release_year integer,
    status public.fragrance_status DEFAULT 'CURRENT'::public.fragrance_status NOT NULL,
    concentration public.fragrance_concentration DEFAULT 'OTHER'::public.fragrance_concentration NOT NULL
);


--
-- Name: note_edits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_edits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    note_id uuid NOT NULL,
    user_id uuid NOT NULL,
    proposed_name character varying(255),
    proposed_description text,
    proposed_thumbnail_id uuid,
    status public.edit_status DEFAULT 'PENDING'::public.edit_status NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    reviewer_feedback text
);


--
-- Name: note_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    note_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: note_request_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_request_scores (
    request_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL
);


--
-- Name: note_request_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_request_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    request_id uuid NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT note_request_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: note_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    version integer DEFAULT 0 NOT NULL,
    asset_id uuid,
    request_status public.request_status DEFAULT 'DRAFT'::public.request_status NOT NULL,
    description text
);


--
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    description text,
    thumbnail_image_id uuid
);


--
-- Name: post_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: post_comment_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_comment_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    comment_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: post_scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_scores (
    post_id uuid NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    score integer GENERATED ALWAYS AS ((upvotes - downvotes)) STORED NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    comment_count integer DEFAULT 0 NOT NULL
);


--
-- Name: post_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    vote smallint NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT post_votes_vote_check CHECK ((vote = ANY (ARRAY['-1'::integer, 0, 1])))
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: request_jobs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: trait_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trait_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trait_type_id uuid NOT NULL,
    label text NOT NULL,
    score integer NOT NULL
);


--
-- Name: trait_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trait_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid NOT NULL,
    followed_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT user_follows_check CHECK ((follower_id <> followed_id))
);


--
-- Name: user_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    s3_key text NOT NULL,
    name text NOT NULL,
    content_type text NOT NULL,
    size_bytes bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    cognito_sub text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    role public.user_role DEFAULT 'USER'::public.user_role NOT NULL,
    avatar_id uuid,
    follower_count integer DEFAULT 0 NOT NULL,
    following_count integer DEFAULT 0 NOT NULL
);


--
-- Name: accord_request_scores acccord_request_vote_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_request_scores
    ADD CONSTRAINT acccord_request_vote_counts_pkey PRIMARY KEY (request_id);


--
-- Name: accord_edits accord_edits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_edits
    ADD CONSTRAINT accord_edits_pkey PRIMARY KEY (id);


--
-- Name: accord_images accord_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_images
    ADD CONSTRAINT accord_images_pkey PRIMARY KEY (id);


--
-- Name: accord_request_votes accord_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_pkey PRIMARY KEY (id);


--
-- Name: accord_request_votes accord_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- Name: accord_requests accord_requests_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_requests_name_key UNIQUE (name);


--
-- Name: accord_requests accord_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_requests_pkey PRIMARY KEY (id);


--
-- Name: accords accords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accords
    ADD CONSTRAINT accords_pkey PRIMARY KEY (id);


--
-- Name: asset_uploads asset_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_uploads
    ADD CONSTRAINT asset_uploads_pkey PRIMARY KEY (id);


--
-- Name: brand_edits brand_edits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_edits
    ADD CONSTRAINT brand_edits_pkey PRIMARY KEY (id);


--
-- Name: brand_images brand_images_brand_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_images
    ADD CONSTRAINT brand_images_brand_type_key UNIQUE (brand_id, content_type);


--
-- Name: brand_images brand_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_images
    ADD CONSTRAINT brand_images_pkey PRIMARY KEY (id);


--
-- Name: brand_request_scores brand_request_vote_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_request_scores
    ADD CONSTRAINT brand_request_vote_counts_pkey PRIMARY KEY (request_id);


--
-- Name: brand_request_votes brand_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_pkey PRIMARY KEY (id);


--
-- Name: brand_request_votes brand_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- Name: brand_requests brand_requests_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_name_key UNIQUE (name);


--
-- Name: brand_requests brand_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_pkey PRIMARY KEY (id);


--
-- Name: brand_scores brand_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_scores
    ADD CONSTRAINT brand_scores_pkey PRIMARY KEY (brand_id);


--
-- Name: brand_votes brand_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_votes
    ADD CONSTRAINT brand_votes_pkey PRIMARY KEY (id);


--
-- Name: brand_votes brand_votes_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_votes
    ADD CONSTRAINT brand_votes_unique UNIQUE (user_id, brand_id);


--
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: edit_jobs edit_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edit_jobs
    ADD CONSTRAINT edit_jobs_pkey PRIMARY KEY (id);


--
-- Name: fragrance_accord_scores fragrance_accord_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_scores
    ADD CONSTRAINT fragrance_accord_scores_pkey PRIMARY KEY (fragrance_id, accord_id);


--
-- Name: fragrance_accord_votes fragrance_accord_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fragrance_accord_votes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_accord_votes fragrance_accord_votes_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fragrance_accord_votes_unique UNIQUE (user_id, fragrance_id, accord_id);


--
-- Name: fragrance_accords fragrance_accords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT fragrance_accords_pkey PRIMARY KEY (id);


--
-- Name: fragrance_collection_items fragrance_collection_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_collection_items
    ADD CONSTRAINT fragrance_collection_items_pkey PRIMARY KEY (id);


--
-- Name: fragrance_collections fragrance_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_collections
    ADD CONSTRAINT fragrance_collections_pkey PRIMARY KEY (id);


--
-- Name: fragrance_edits fragrance_edits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_edits
    ADD CONSTRAINT fragrance_edits_pkey PRIMARY KEY (id);


--
-- Name: fragrance_images fragrance_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_images
    ADD CONSTRAINT fragrance_images_pkey PRIMARY KEY (id);


--
-- Name: fragrance_images fragrance_images_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_images
    ADD CONSTRAINT fragrance_images_unique UNIQUE (s3_key);


--
-- Name: fragrance_note_scores fragrance_note_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_scores
    ADD CONSTRAINT fragrance_note_scores_pkey PRIMARY KEY (fragrance_id, note_id, layer);


--
-- Name: fragrance_note_votes fragrance_note_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fragrance_note_votes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_note_votes fragrance_note_votes_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fragrance_note_votes_unique UNIQUE (user_id, fragrance_id, note_id, layer);


--
-- Name: fragrance_notes fragrance_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT fragrance_notes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_reports fragrance_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reports
    ADD CONSTRAINT fragrance_reports_pkey PRIMARY KEY (id);


--
-- Name: fragrance_request_accords fragrance_request_accords_draft_id_accord_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_draft_id_accord_id_key UNIQUE (request_id, accord_id);


--
-- Name: fragrance_request_accords fragrance_request_accords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_pkey PRIMARY KEY (id);


--
-- Name: fragrance_request_notes fragrance_request_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_request_notes fragrance_request_notes_request_id_note_id_layer_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_request_id_note_id_layer_key UNIQUE (request_id, note_id, layer);


--
-- Name: fragrance_request_traits fragrance_request_traits_request_id_trait_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_request_id_trait_type_id_key UNIQUE (request_id, trait_type_id);


--
-- Name: fragrance_request_scores fragrance_request_vote_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_scores
    ADD CONSTRAINT fragrance_request_vote_counts_pkey PRIMARY KEY (request_id);


--
-- Name: fragrance_request_votes fragrance_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_request_votes fragrance_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- Name: fragrance_requests fragrance_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_pkey PRIMARY KEY (id);


--
-- Name: fragrance_request_traits fragrance_requests_traits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_requests_traits_pkey PRIMARY KEY (id);


--
-- Name: fragrance_review_scores fragrance_review_vote_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_review_scores
    ADD CONSTRAINT fragrance_review_vote_counts_pkey PRIMARY KEY (review_id);


--
-- Name: fragrance_review_votes fragrance_review_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_review_votes
    ADD CONSTRAINT fragrance_review_votes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_review_votes fragrance_review_votes_user_id_review_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_review_votes
    ADD CONSTRAINT fragrance_review_votes_user_id_review_id_key UNIQUE (user_id, review_id);


--
-- Name: fragrance_reviews fragrance_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reviews
    ADD CONSTRAINT fragrance_reviews_pkey PRIMARY KEY (id);


--
-- Name: fragrance_reviews fragrance_reviews_unique_user_fragrance; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reviews
    ADD CONSTRAINT fragrance_reviews_unique_user_fragrance UNIQUE (fragrance_id, user_id);


--
-- Name: fragrance_scores fragrance_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_scores
    ADD CONSTRAINT fragrance_scores_pkey PRIMARY KEY (fragrance_id);


--
-- Name: fragrance_trait_votes fragrance_trait_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_trait_votes fragrance_trait_votes_user_id_fragrance_id_trait_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_user_id_fragrance_id_trait_type_id_key UNIQUE (user_id, fragrance_id, trait_type_id);


--
-- Name: fragrance_votes fragrance_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_votes
    ADD CONSTRAINT fragrance_votes_pkey PRIMARY KEY (id);


--
-- Name: fragrance_votes fragrance_votes_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_votes
    ADD CONSTRAINT fragrance_votes_unique UNIQUE (user_id, fragrance_id);


--
-- Name: fragrances fragrances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrances
    ADD CONSTRAINT fragrances_pkey PRIMARY KEY (id);


--
-- Name: fragrances fragrances_unique_brand_id_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrances
    ADD CONSTRAINT fragrances_unique_brand_id_name UNIQUE (brand_id, name);


--
-- Name: note_edits note_edits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_edits
    ADD CONSTRAINT note_edits_pkey PRIMARY KEY (id);


--
-- Name: note_images note_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_images
    ADD CONSTRAINT note_images_pkey PRIMARY KEY (id);


--
-- Name: note_request_scores note_request_vote_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_request_scores
    ADD CONSTRAINT note_request_vote_counts_pkey PRIMARY KEY (request_id);


--
-- Name: note_request_votes note_request_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_pkey PRIMARY KEY (id);


--
-- Name: note_request_votes note_request_votes_user_id_request_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_user_id_request_id_key UNIQUE (user_id, request_id);


--
-- Name: note_requests note_requests_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_name_key UNIQUE (name);


--
-- Name: note_requests note_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: notes notes_unique_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_unique_name UNIQUE (name);


--
-- Name: post_assets post_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_assets
    ADD CONSTRAINT post_assets_pkey PRIMARY KEY (id);


--
-- Name: post_comment_assets post_comment_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comment_assets
    ADD CONSTRAINT post_comment_assets_pkey PRIMARY KEY (id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (id);


--
-- Name: post_scores post_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_scores
    ADD CONSTRAINT post_scores_pkey PRIMARY KEY (post_id);


--
-- Name: post_votes post_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_votes
    ADD CONSTRAINT post_votes_pkey PRIMARY KEY (id);


--
-- Name: post_votes post_votes_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_votes
    ADD CONSTRAINT post_votes_unique UNIQUE (user_id, post_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: request_jobs request_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.request_jobs
    ADD CONSTRAINT request_jobs_pkey PRIMARY KEY (id);


--
-- Name: trait_options trait_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trait_options
    ADD CONSTRAINT trait_options_pkey PRIMARY KEY (id);


--
-- Name: trait_options trait_options_trait_type_id_score_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trait_options
    ADD CONSTRAINT trait_options_trait_type_id_score_key UNIQUE (trait_type_id, score);


--
-- Name: trait_types trait_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trait_types
    ADD CONSTRAINT trait_types_name_key UNIQUE (name);


--
-- Name: trait_types trait_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trait_types
    ADD CONSTRAINT trait_types_pkey PRIMARY KEY (id);


--
-- Name: fragrance_accords unique_fragrance_accord; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT unique_fragrance_accord UNIQUE (fragrance_id, accord_id);


--
-- Name: fragrance_notes unique_fragrance_note; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT unique_fragrance_note UNIQUE (fragrance_id, note_id, layer);


--
-- Name: users unqiue_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unqiue_email UNIQUE (email);


--
-- Name: user_follows user_follows_follower_id_followed_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_id_followed_id_key UNIQUE (follower_id, followed_id);


--
-- Name: user_follows user_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (id);


--
-- Name: user_images user_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_edit_jobs_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_edit_jobs_lookup ON public.edit_jobs USING btree (edit_type, edit_id);


--
-- Name: idx_edit_jobs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_edit_jobs_status ON public.edit_jobs USING btree (status);


--
-- Name: idx_post_assets_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_assets_asset_id ON public.post_assets USING btree (asset_id);


--
-- Name: idx_post_assets_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_assets_post_id ON public.post_assets USING btree (post_id);


--
-- Name: idx_post_replies_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_replies_parent_id ON public.post_comments USING btree (parent_id);


--
-- Name: idx_post_replies_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_replies_post_id ON public.post_comments USING btree (post_id);


--
-- Name: idx_post_reply_assets_asset_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_reply_assets_asset_id ON public.post_comment_assets USING btree (asset_id);


--
-- Name: idx_post_reply_assets_replu_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_reply_assets_replu_id ON public.post_comment_assets USING btree (comment_id);


--
-- Name: idx_posts_fragrance_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_fragrance_id ON public.posts USING btree (fragrance_id) WHERE (fragrance_id IS NOT NULL);


--
-- Name: idx_posts_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_type ON public.posts USING btree (type);


--
-- Name: idx_posts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_user_id ON public.posts USING btree (user_id);


--
-- Name: idx_request_jobs_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_request_jobs_lookup ON public.request_jobs USING btree (request_type, request_id);


--
-- Name: idx_request_jobs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_request_jobs_status ON public.request_jobs USING btree (status);


--
-- Name: accord_edits accord_edits_accord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_edits
    ADD CONSTRAINT accord_edits_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON DELETE CASCADE;


--
-- Name: accord_edits accord_edits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_edits
    ADD CONSTRAINT accord_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: accord_images accord_images_accord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_images
    ADD CONSTRAINT accord_images_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON DELETE CASCADE;


--
-- Name: accord_requests accord_request_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_request_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads(id) NOT VALID;


--
-- Name: accord_request_scores accord_request_vote_counts_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_request_scores
    ADD CONSTRAINT accord_request_vote_counts_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.accord_requests(id) ON DELETE CASCADE;


--
-- Name: accord_request_votes accord_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.accord_requests(id) ON DELETE CASCADE;


--
-- Name: accord_request_votes accord_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_request_votes
    ADD CONSTRAINT accord_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: accord_requests accord_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accord_requests
    ADD CONSTRAINT accord_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: brand_edits brand_edits_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_edits
    ADD CONSTRAINT brand_edits_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: brand_edits brand_edits_propsed_avatar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_edits
    ADD CONSTRAINT brand_edits_propsed_avatar_id_fkey FOREIGN KEY (proposed_avatar_id) REFERENCES public.asset_uploads(id);


--
-- Name: brand_edits brand_edits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_edits
    ADD CONSTRAINT brand_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: brand_images brand_images_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_images
    ADD CONSTRAINT brand_images_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: brand_request_scores brand_request_vote_counts_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_request_scores
    ADD CONSTRAINT brand_request_vote_counts_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.brand_requests(id) ON DELETE CASCADE;


--
-- Name: brand_request_votes brand_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.brand_requests(id) ON DELETE CASCADE;


--
-- Name: brand_request_votes brand_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_request_votes
    ADD CONSTRAINT brand_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: brand_requests brand_requests_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads(id) NOT VALID;


--
-- Name: brand_requests brand_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_requests
    ADD CONSTRAINT brand_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: brand_scores brand_scores_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_scores
    ADD CONSTRAINT brand_scores_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: brand_votes brand_votes_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_votes
    ADD CONSTRAINT brand_votes_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: brand_votes brand_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_votes
    ADD CONSTRAINT brand_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: brands brands_avatar_image_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_avatar_image_fkey FOREIGN KEY (avatar_id) REFERENCES public.brand_images(id) NOT VALID;


--
-- Name: fragrance_accords fk_accord_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT fk_accord_id FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fragrance_accords fk_fragrance_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accords
    ADD CONSTRAINT fk_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fragrance_notes fk_fragrance_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT fk_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: fragrance_notes fk_note_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_notes
    ADD CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES public.notes(id) ON UPDATE CASCADE;


--
-- Name: fragrance_accord_scores fragrance_accord_scores_accord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_scores
    ADD CONSTRAINT fragrance_accord_scores_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON DELETE CASCADE;


--
-- Name: fragrance_accord_scores fragrance_accord_scores_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_scores
    ADD CONSTRAINT fragrance_accord_scores_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_accord_votes fragrance_accord_votes_accord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fragrance_accord_votes_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON DELETE CASCADE;


--
-- Name: fragrance_accord_votes fragrance_accord_votes_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fragrance_accord_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_accord_votes fragrance_accord_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_accord_votes
    ADD CONSTRAINT fragrance_accord_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_collection_items fragrance_collection_items_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_collection_items
    ADD CONSTRAINT fragrance_collection_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.fragrance_collections(id) ON DELETE CASCADE;


--
-- Name: fragrance_collection_items fragrance_collection_items_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_collection_items
    ADD CONSTRAINT fragrance_collection_items_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_collections fragrance_collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_collections
    ADD CONSTRAINT fragrance_collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: fragrance_edits fragrance_edits_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_edits
    ADD CONSTRAINT fragrance_edits_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_edits fragrance_edits_proposed_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_edits
    ADD CONSTRAINT fragrance_edits_proposed_brand_id_fkey FOREIGN KEY (proposed_brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: fragrance_edits fragrance_edits_proposed_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_edits
    ADD CONSTRAINT fragrance_edits_proposed_image_id_fkey FOREIGN KEY (proposed_image_id) REFERENCES public.asset_uploads(id) ON DELETE SET NULL;


--
-- Name: fragrance_edits fragrance_edits_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_edits
    ADD CONSTRAINT fragrance_edits_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: fragrance_edits fragrance_edits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_edits
    ADD CONSTRAINT fragrance_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: fragrance_images fragrance_images_new_fragrance_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_images
    ADD CONSTRAINT fragrance_images_new_fragrance_id FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fragrance_note_scores fragrance_note_scores_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_scores
    ADD CONSTRAINT fragrance_note_scores_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_note_scores fragrance_note_scores_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_scores
    ADD CONSTRAINT fragrance_note_scores_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: fragrance_note_votes fragrance_note_votes_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fragrance_note_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_note_votes fragrance_note_votes_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fragrance_note_votes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: fragrance_note_votes fragrance_note_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_note_votes
    ADD CONSTRAINT fragrance_note_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_reports fragrance_reports_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reports
    ADD CONSTRAINT fragrance_reports_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_reports fragrance_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reports
    ADD CONSTRAINT fragrance_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_accords fragrance_request_accords_accord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_accord_id_fkey FOREIGN KEY (accord_id) REFERENCES public.accords(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_accords fragrance_request_accords_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_accords
    ADD CONSTRAINT fragrance_request_accords_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_notes fragrance_request_notes_draft_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_draft_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_notes fragrance_request_notes_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_notes
    ADD CONSTRAINT fragrance_request_notes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_traits fragrance_request_traits_draft_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_draft_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_traits fragrance_request_traits_trait_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_trait_option_id_fkey FOREIGN KEY (trait_option_id) REFERENCES public.trait_options(id);


--
-- Name: fragrance_request_traits fragrance_request_traits_trait_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_traits
    ADD CONSTRAINT fragrance_request_traits_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_scores fragrance_request_vote_counts_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_scores
    ADD CONSTRAINT fragrance_request_vote_counts_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_votes fragrance_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.fragrance_requests(id) ON DELETE CASCADE;


--
-- Name: fragrance_request_votes fragrance_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_request_votes
    ADD CONSTRAINT fragrance_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_requests fragrance_requests_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads(id) NOT VALID;


--
-- Name: fragrance_requests fragrance_requests_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) NOT VALID;


--
-- Name: fragrance_requests fragrance_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_requests
    ADD CONSTRAINT fragrance_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: fragrance_review_scores fragrance_review_vote_counts_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_review_scores
    ADD CONSTRAINT fragrance_review_vote_counts_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.fragrance_reviews(id) ON DELETE CASCADE;


--
-- Name: fragrance_review_votes fragrance_review_votes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_review_votes
    ADD CONSTRAINT fragrance_review_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.fragrance_reviews(id) ON DELETE CASCADE;


--
-- Name: fragrance_review_votes fragrance_review_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_review_votes
    ADD CONSTRAINT fragrance_review_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_reviews fragrance_reviews_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reviews
    ADD CONSTRAINT fragrance_reviews_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_reviews fragrance_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_reviews
    ADD CONSTRAINT fragrance_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_scores fragrance_scores_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_scores
    ADD CONSTRAINT fragrance_scores_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_trait_votes fragrance_trait_votes_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_trait_votes fragrance_trait_votes_trait_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_trait_option_id_fkey FOREIGN KEY (trait_option_id) REFERENCES public.trait_options(id) ON DELETE CASCADE;


--
-- Name: fragrance_trait_votes fragrance_trait_votes_trait_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types(id) ON DELETE CASCADE;


--
-- Name: fragrance_trait_votes fragrance_trait_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_trait_votes
    ADD CONSTRAINT fragrance_trait_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrance_votes fragrance_votes_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_votes
    ADD CONSTRAINT fragrance_votes_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE CASCADE;


--
-- Name: fragrance_votes fragrance_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrance_votes
    ADD CONSTRAINT fragrance_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fragrances fragrances_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fragrances
    ADD CONSTRAINT fragrances_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: note_edits note_edits_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_edits
    ADD CONSTRAINT note_edits_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: note_edits note_edits_proposed_thumbnail_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_edits
    ADD CONSTRAINT note_edits_proposed_thumbnail_id_fkey FOREIGN KEY (proposed_thumbnail_id) REFERENCES public.asset_uploads(id) ON DELETE SET NULL;


--
-- Name: note_edits note_edits_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_edits
    ADD CONSTRAINT note_edits_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: note_edits note_edits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_edits
    ADD CONSTRAINT note_edits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: note_images note_images_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_images
    ADD CONSTRAINT note_images_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: note_request_scores note_request_vote_counts_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_request_scores
    ADD CONSTRAINT note_request_vote_counts_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.note_requests(id) ON DELETE CASCADE;


--
-- Name: note_request_votes note_request_votes_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.note_requests(id) ON DELETE CASCADE;


--
-- Name: note_request_votes note_request_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_request_votes
    ADD CONSTRAINT note_request_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: note_requests note_requests_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads(id) NOT VALID;


--
-- Name: note_requests note_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_requests
    ADD CONSTRAINT note_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notes notes_thumbnail_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_thumbnail_image_id_fkey FOREIGN KEY (thumbnail_image_id) REFERENCES public.note_images(id) ON DELETE SET NULL;


--
-- Name: post_assets post_assets_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_assets
    ADD CONSTRAINT post_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads(id) ON DELETE CASCADE;


--
-- Name: post_assets post_assets_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_assets
    ADD CONSTRAINT post_assets_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_comment_assets post_comment_assets_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comment_assets
    ADD CONSTRAINT post_comment_assets_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.asset_uploads(id) ON DELETE CASCADE;


--
-- Name: post_comment_assets post_comment_assets_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comment_assets
    ADD CONSTRAINT post_comment_assets_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.post_comments(id) ON DELETE CASCADE;


--
-- Name: post_comments post_replies_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_replies_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.post_comments(id) ON DELETE CASCADE;


--
-- Name: post_comments post_replies_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_replies_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_comments post_replies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: post_scores post_scores_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_scores
    ADD CONSTRAINT post_scores_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_votes post_votes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_votes
    ADD CONSTRAINT post_votes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_votes post_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_votes
    ADD CONSTRAINT post_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_fragrance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_fragrance_id_fkey FOREIGN KEY (fragrance_id) REFERENCES public.fragrances(id) ON DELETE SET NULL;


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trait_options trait_options_trait_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trait_options
    ADD CONSTRAINT trait_options_trait_type_id_fkey FOREIGN KEY (trait_type_id) REFERENCES public.trait_types(id) ON DELETE CASCADE;


--
-- Name: users user_avatar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_avatar_id_fkey FOREIGN KEY (avatar_id) REFERENCES public.user_images(id) NOT VALID;


--
-- Name: user_follows user_follows_followed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_follows user_follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: asset_uploads user_id_asset; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_uploads
    ADD CONSTRAINT user_id_asset FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: user_images user_images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_images
    ADD CONSTRAINT user_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict t5njpgbfWg9P8EIKoij9fn5bYxsiuqG1UzQV1B2hE0OdWlGeHenuNzyW2FPCYvL

