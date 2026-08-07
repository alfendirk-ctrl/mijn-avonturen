-- Schema van de gedeelde database achter "Delen" in de app.
--
-- De app werkt zonder dit alles gewoon: localStorage is de werkkopie en de
-- database is alleen de brievenbus tussen twee toestellen. Dit bestand staat
-- hier zodat die brievenbus opnieuw op te bouwen is — Supabase pauzeert een
-- gratis project na een week zonder verkeer, en na lang niets doen kan het
-- helemaal weg zijn. Met dit bestand is dat een kwestie van uitvoeren in de
-- SQL-editor, niet van opnieuw uitvogelen hoe het ook alweer zat.
--
-- Toegangsmodel: het geheim ís de sleutel. Een ruimte_id (uuid) reist mee in
-- de header 'x-ruimte'; RLS vergelijkt die met de ruimte_id van de rij. Er is
-- geen login. Wie de deel-link heeft mag lezen én schrijven — bewust zo voor
-- een lijstje dagjes uit, maar zet er dus niets gevoeligs in.

-- ---- De ruimte uit de request-header ---------------------------------------

-- Geeft de ruimte uit de header terug, of null als hij ontbreekt of geen
-- geldige uuid is. Die controle staat hier met opzet: zonder de vormtoets zou
-- een onzinwaarde een castfout geven in plaats van "niets zichtbaar", en dat
-- verschil is precies wat een aanvaller wil zien.
create or replace function public.huidige_ruimte()
returns uuid
language sql
stable
as $$
  select case
           when h ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
           then h::uuid
           else null
         end
  from (
    select nullif(current_setting('request.headers', true)::json ->> 'x-ruimte', '') as h
  ) t
$$;

-- ---- Tabellen ---------------------------------------------------------------

-- Eén rij per avontuur per ruimte. Er staat geen foto-kolom in: foto's blijven
-- op het eigen toestel (IndexedDB), de vlag `foto` op de activiteit reist niet
-- mee. Dat is een keuze, geen omissie.
--
-- `verwijderd` is een grafsteen. Zonder dat zou een verwijdering op het ene
-- toestel ongedaan gemaakt worden doordat het andere toestel de rij terugduwt.
--
-- `bijgewerkt` is epoch-ms en beslist wie wint bij het samenvoegen: de nieuwste.
-- Bij gelijkspel wint de kant die van de server komt, zodat beide kanten naar
-- dezelfde uitkomst toe bewegen in plaats van elkaar te blijven overschrijven.
create table if not exists public.item (
  ruimte_id  uuid    not null,
  id         bigint  not null,
  naam       text    not null,
  locatie    text    not null,
  categorie  text    not null,
  type       text    not null,
  link       text,
  notities   text    not null,
  gedaan     boolean not null,
  favoriet   boolean not null,
  periode    text    not null,
  verwijderd boolean not null,
  bijgewerkt bigint  not null,
  primary key (ruimte_id, id)
);

-- Categorieën horen bij een ruimte, niet bij de app: wie een categorie hernoemt
-- of naar een ander tabblad verplaatst, doet dat voor allebei.
create table if not exists public.categorie (
  ruimte_id  uuid    not null,
  naam       text    not null,
  emoji      text    not null,
  kleur      text    not null,
  gradient   text    not null,
  soort      text    not null,
  verwijderd boolean not null,
  bijgewerkt bigint  not null,
  primary key (ruimte_id, naam)
);

-- ---- Afscherming ------------------------------------------------------------

alter table public.item      enable row level security;
alter table public.categorie enable row level security;

-- Eén regel voor alles: je ziet en raakt alleen rijen van je eigen ruimte. De
-- `with check` is net zo belangrijk als de `using` — zonder dat zou je wel
-- alleen je eigen rijen zien, maar rijen in andermans ruimte kunnen schrijven.
drop policy if exists item_eigen_ruimte on public.item;
create policy item_eigen_ruimte on public.item
  for all
  using (ruimte_id = public.huidige_ruimte())
  with check (ruimte_id = public.huidige_ruimte());

drop policy if exists categorie_eigen_ruimte on public.categorie;
create policy categorie_eigen_ruimte on public.categorie
  for all
  using (ruimte_id = public.huidige_ruimte())
  with check (ruimte_id = public.huidige_ruimte());

-- De app praat met de publieke sleutel, dus als de rol 'anon'. Die rechten
-- geven op zichzelf niets weg: RLS hierboven bepaalt welke rijen er bestaan
-- voor deze verbinding, en zonder geldige x-ruimte zijn dat er nul.
grant select, insert, update, delete on public.item      to anon, authenticated;
grant select, insert, update, delete on public.categorie to anon, authenticated;
