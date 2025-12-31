CREATE TYPE public.asset_status AS enum('staged', 'ready');

CREATE TYPE public.avatar_status AS enum('PENDING', 'PROCESSING', 'READY', 'FAILED');

CREATE TYPE public.edit_status AS enum('APPROVED', 'REJECTED', 'PENDING');

CREATE TYPE public.edit_type AS enum('accord', 'note', 'fragrance', 'brand');

CREATE TYPE public.fragrance_concentration AS enum(
  'PARFUM',
  'EDP',
  'EDT',
  'OIL',
  'OTHER',
  'BODY_MIST',
  'EAU_FRAICHE',
  'EDC'
);

CREATE TYPE public.fragrance_reaction AS enum('dislike', 'like');

CREATE TYPE public.fragrance_status AS enum('REFORMULATED', 'DISCONTINUED', 'CURRENT');

CREATE TYPE public.fragrance_trait_enum AS enum(
  'complexity',
  'sillage',
  'balance',
  'allure',
  'gender',
  'longevity'
);

CREATE TYPE public.job_status AS enum('PROCESSING', 'FAILED', 'QUEUED', 'SUCCESS');

CREATE TYPE public.note_layer_enum AS enum('base', 'middle', 'top');

CREATE TYPE public.post_type AS enum('FRAGRANCE', 'TEXT', 'MEDIA');

CREATE TYPE public.request_status AS enum('PENDING', 'DENIED', 'ACCEPTED', 'DRAFT');

CREATE TYPE public.request_type AS enum('note', 'fragrance', 'brand', 'accord');

CREATE TYPE public.upload_status AS enum('uploaded', 'failed', 'pending');

CREATE TYPE public.user_role AS enum('MODERATOR', 'ADMIN', 'USER');
