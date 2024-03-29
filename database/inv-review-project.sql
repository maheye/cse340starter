-- Create review table
CREATE TABLE IF NOT EXISTS public.review
(
    review_id INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    review_text TEXT NOT NULL,
    review_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    inv_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    CONSTRAINT review_pkey PRIMARY KEY (review_id),
    CONSTRAINT fk_inventory FOREIGN KEY (inv_id) REFERENCES public.inventory (inv_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES public.account (account_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION
);