--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-01-20 23:05:53

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
-- TOC entry 5 (class 2615 OID 17519)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 17557)
-- Name: BottleSize; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BottleSize" (
    bottle_size_id integer NOT NULL,
    tamanho double precision NOT NULL
);


ALTER TABLE public."BottleSize" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17556)
-- Name: BottleSize_bottle_size_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BottleSize_bottle_size_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BottleSize_bottle_size_id_seq" OWNER TO postgres;

--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 222
-- Name: BottleSize_bottle_size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BottleSize_bottle_size_id_seq" OWNED BY public."BottleSize".bottle_size_id;


--
-- TOC entry 226 (class 1259 OID 17569)
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    wine_id integer NOT NULL,
    rating double precision NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17568)
-- Name: Review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Review_review_id_seq" OWNER TO postgres;

--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 225
-- Name: Review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_review_id_seq" OWNED BY public."Review".review_id;


--
-- TOC entry 219 (class 1259 OID 17530)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    nome character varying(40) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17529)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 221 (class 1259 OID 17545)
-- Name: Wine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wine" (
    wine_id integer NOT NULL,
    nome character varying(40) NOT NULL,
    descricao character varying(600) NOT NULL,
    preco double precision NOT NULL,
    imagem text,
    "emPromocao" boolean DEFAULT false NOT NULL,
    "precoPromocao" double precision,
    "emDestaque" boolean DEFAULT false NOT NULL,
    "descricaoDestaque" character varying(350),
    "averageRating" double precision DEFAULT 0.0 NOT NULL
);


ALTER TABLE public."Wine" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17563)
-- Name: WineBottleSize; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WineBottleSize" (
    wine_id integer NOT NULL,
    bottle_size_id integer NOT NULL
);


ALTER TABLE public."WineBottleSize" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17544)
-- Name: Wine_wine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Wine_wine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Wine_wine_id_seq" OWNER TO postgres;

--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 220
-- Name: Wine_wine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Wine_wine_id_seq" OWNED BY public."Wine".wine_id;


--
-- TOC entry 227 (class 1259 OID 17575)
-- Name: _WineBottleSizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_WineBottleSizes" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_WineBottleSizes" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17520)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4730 (class 2604 OID 17560)
-- Name: BottleSize bottle_size_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BottleSize" ALTER COLUMN bottle_size_id SET DEFAULT nextval('public."BottleSize_bottle_size_id_seq"'::regclass);


--
-- TOC entry 4731 (class 2604 OID 17572)
-- Name: Review review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN review_id SET DEFAULT nextval('public."Review_review_id_seq"'::regclass);


--
-- TOC entry 4724 (class 2604 OID 17533)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 4726 (class 2604 OID 17548)
-- Name: Wine wine_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wine" ALTER COLUMN wine_id SET DEFAULT nextval('public."Wine_wine_id_seq"'::regclass);


--
-- TOC entry 4905 (class 0 OID 17557)
-- Dependencies: 223
-- Data for Name: BottleSize; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BottleSize" (bottle_size_id, tamanho) FROM stdin;
1	0.5
2	0.75
3	1.5
4	3
\.


--
-- TOC entry 4908 (class 0 OID 17569)
-- Dependencies: 226
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (review_id, user_id, wine_id, rating) FROM stdin;
1	1	9	4.5
\.


--
-- TOC entry 4901 (class 0 OID 17530)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nome, email, password, "isAdmin") FROM stdin;
1	teste	teste@gmail.com	$2b$10$HT91ncBpv4YFiieoQvhsF.rkkor7zNo0oG1PYaVkXU4R/kKokHHsW	f
2	teste2	teste2@gmail.com	$2b$10$MhDTF2ykziqXP9olQvGHXe0JUlUftK4tEwjhDDgE.xzBCRv5VKWFW	f
3	Rui Pedro	rui@gmail.com	$2b$10$DZgB7AysaXs7QoGOk3TuuuS31XDTVTgVPg8Tbkt9JWuGjo7XjM.1i	f
4	rato	rato@gmail.com	$2b$10$Rl1cj7681PTpVPzbxCcuZuXcA9ueQCmKCqgxry/Y30nVtG7Btj3Pm	f
6	Admin	admin@gmail.com	$2b$10$YjSYU0Tkqlm0e/oOIlscTugrxIz9tnQsGuUaiSQ0yno9UFfJCwliu	t
\.


--
-- TOC entry 4903 (class 0 OID 17545)
-- Dependencies: 221
-- Data for Name: Wine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wine" (wine_id, nome, descricao, preco, imagem, "emPromocao", "precoPromocao", "emDestaque", "descricaoDestaque", "averageRating") FROM stdin;
15	Vinho de Flor	1	39.99	VinhoLaranja.png	f	\N	f	\N	0
16	Vinho Rose	11	29.99	VinhoRose.png	f	\N	f	\N	0
17	Vinho Espumante	teste	34.99	VinhoEspumante.png	f	\N	f	\N	0
9	Vinho Tinto Reserva 	Este vinho tinto encorpado é uma celebração do sabor, com notas marcantes de frutas vermelhas que evocam sofisticação e intensidade. Perfeito para acompanhar carnes vermelhas, queijos maturados ou simplesmente para apreciar em momentos especiais.	26.99	VinhodeFlor.png	t	15.99	t	Perfeito para momentos especiais.	4.5
\.


--
-- TOC entry 4906 (class 0 OID 17563)
-- Dependencies: 224
-- Data for Name: WineBottleSize; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WineBottleSize" (wine_id, bottle_size_id) FROM stdin;
15	1
16	1
9	1
9	2
\.


--
-- TOC entry 4909 (class 0 OID 17575)
-- Dependencies: 227
-- Data for Name: _WineBottleSizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_WineBottleSizes" ("A", "B") FROM stdin;
1	9
2	9
1	15
1	16
1	17
\.


--
-- TOC entry 4899 (class 0 OID 17520)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2fad5649-b58c-4838-86d0-2f326492aaf2	c0839ca82c2784c98fe44a4271d51dda86a7caebca32ca3f2da5c72070b428e3	2025-01-18 20:20:47.73743+00	20250111133457_initial_migration	\N	\N	2025-01-18 20:20:47.701397+00	1
5f28a3a3-4c00-4fbb-b829-4fe232fe7c4e	577ea25f39cc49cd9bb4e2497ab09bf75df098b23d284426c99d2c1565cadcf2	2025-01-18 20:20:48.786255+00	20250118202048_remove_category	\N	\N	2025-01-18 20:20:48.781509+00	1
\.


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 222
-- Name: BottleSize_bottle_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BottleSize_bottle_size_id_seq"', 4, true);


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 225
-- Name: Review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_review_id_seq"', 1, true);


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 220
-- Name: Wine_wine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Wine_wine_id_seq"', 18, true);


--
-- TOC entry 4740 (class 2606 OID 17562)
-- Name: BottleSize BottleSize_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BottleSize"
    ADD CONSTRAINT "BottleSize_pkey" PRIMARY KEY (bottle_size_id);


--
-- TOC entry 4744 (class 2606 OID 17574)
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (review_id);


--
-- TOC entry 4736 (class 2606 OID 17536)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4742 (class 2606 OID 17567)
-- Name: WineBottleSize WineBottleSize_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WineBottleSize"
    ADD CONSTRAINT "WineBottleSize_pkey" PRIMARY KEY (wine_id, bottle_size_id);


--
-- TOC entry 4738 (class 2606 OID 17555)
-- Name: Wine Wine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wine"
    ADD CONSTRAINT "Wine_pkey" PRIMARY KEY (wine_id);


--
-- TOC entry 4746 (class 2606 OID 17579)
-- Name: _WineBottleSizes _WineBottleSizes_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_WineBottleSizes"
    ADD CONSTRAINT "_WineBottleSizes_AB_pkey" PRIMARY KEY ("A", "B");


--
-- TOC entry 4733 (class 2606 OID 17528)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4734 (class 1259 OID 17580)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4747 (class 1259 OID 17581)
-- Name: _WineBottleSizes_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_WineBottleSizes_B_index" ON public."_WineBottleSizes" USING btree ("B");


--
-- TOC entry 4750 (class 2606 OID 17597)
-- Name: Review Review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4751 (class 2606 OID 17602)
-- Name: Review Review_wine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_wine_id_fkey" FOREIGN KEY (wine_id) REFERENCES public."Wine"(wine_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4748 (class 2606 OID 17592)
-- Name: WineBottleSize WineBottleSize_bottle_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WineBottleSize"
    ADD CONSTRAINT "WineBottleSize_bottle_size_id_fkey" FOREIGN KEY (bottle_size_id) REFERENCES public."BottleSize"(bottle_size_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4749 (class 2606 OID 17587)
-- Name: WineBottleSize WineBottleSize_wine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WineBottleSize"
    ADD CONSTRAINT "WineBottleSize_wine_id_fkey" FOREIGN KEY (wine_id) REFERENCES public."Wine"(wine_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4752 (class 2606 OID 17607)
-- Name: _WineBottleSizes _WineBottleSizes_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_WineBottleSizes"
    ADD CONSTRAINT "_WineBottleSizes_A_fkey" FOREIGN KEY ("A") REFERENCES public."BottleSize"(bottle_size_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4753 (class 2606 OID 17612)
-- Name: _WineBottleSizes _WineBottleSizes_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_WineBottleSizes"
    ADD CONSTRAINT "_WineBottleSizes_B_fkey" FOREIGN KEY ("B") REFERENCES public."Wine"(wine_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-01-20 23:05:53

--
-- PostgreSQL database dump complete
--

