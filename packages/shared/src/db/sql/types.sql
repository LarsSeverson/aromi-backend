CREATE TYPE public.asset_status AS enum('ready', 'staged');

CREATE TYPE public.avatar_status AS enum('PENDING', 'FAILED', 'READY', 'PROCESSING');

CREATE TYPE public.edit_status AS enum('REJECTED', 'APPROVED', 'PENDING');

CREATE TYPE public.edit_type AS enum('note', 'fragrance', 'brand', 'accord');

CREATE TYPE public.fragrance_concentration AS enum(
  'OTHER',
  'EDP',
  'EDC',
  'EAU_FRAICHE',
  'BODY_MIST',
  'PARFUM',
  'OIL',
  'EDT'
);

CREATE TYPE public.fragrance_reaction AS enum('like', 'dislike');

CREATE TYPE public.fragrance_status AS enum('CURRENT', 'DISCONTINUED', 'REFORMULATED');

CREATE TYPE public.fragrance_trait_enum AS enum(
  'sillage',
  'longevity',
  'complexity',
  'balance',
  'allure',
  'gender'
);

CREATE TYPE public.job_status AS enum('QUEUED', 'FAILED', 'SUCCESS', 'PROCESSING');

CREATE TYPE public.note_layer_enum AS enum('base', 'top', 'middle');

CREATE TYPE public.request_status AS enum('ACCEPTED', 'DENIED', 'DRAFT', 'PENDING');

CREATE TYPE public.request_type AS enum('note', 'fragrance', 'brand', 'accord');

CREATE TYPE public.upload_status AS enum('uploaded', 'failed', 'pending');

CREATE TYPE public.user_role AS enum('USER', 'ADMIN', 'MODERATOR');
