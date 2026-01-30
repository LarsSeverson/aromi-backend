CREATE TYPE public.asset_status AS enum('staged', 'ready');

CREATE TYPE public.avatar_status AS enum('PENDING', 'PROCESSING', 'READY', 'FAILED');

CREATE TYPE public.edit_status AS enum('PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE public.edit_type AS enum('brand', 'fragrance', 'note', 'accord');

CREATE TYPE public.fragrance_concentration AS enum(
  'BODY_MIST',
  'EAU_FRAICHE',
  'EDC',
  'EDP',
  'EDT',
  'OIL',
  'OTHER',
  'PARFUM'
);

CREATE TYPE public.fragrance_reaction AS enum('like', 'dislike');

CREATE TYPE public.fragrance_status AS enum('CURRENT', 'DISCONTINUED', 'REFORMULATED');

CREATE TYPE public.fragrance_trait_enum AS enum(
  'longevity',
  'sillage',
  'complexity',
  'balance',
  'allure',
  'gender'
);

CREATE TYPE public.job_status AS enum('QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED');

CREATE TYPE public.note_layer_enum AS enum('top', 'middle', 'base');

CREATE TYPE public.post_type AS enum('TEXT', 'MEDIA', 'FRAGRANCE');

CREATE TYPE public.request_status AS enum('DRAFT', 'PENDING', 'ACCEPTED', 'DENIED');

CREATE TYPE public.request_type AS enum('fragrance', 'brand', 'accord', 'note');

CREATE TYPE public.upload_status AS enum('pending', 'uploaded', 'failed');

CREATE TYPE public.user_role AS enum('USER', 'MODERATOR', 'ADMIN');
