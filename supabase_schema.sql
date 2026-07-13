-- 1. Categories
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT
);

-- 2. Products
CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    rating NUMERIC DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    image TEXT,
    category TEXT,
    badge TEXT,
    description TEXT,
    is_new BOOLEAN DEFAULT false,
    is_best_deal BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 100
);

-- 3. Banners
CREATE TABLE public.promotional_banners (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    discount TEXT,
    image TEXT,
    bg_color TEXT,
    text_color TEXT,
    button_text TEXT,
    placement_type TEXT
);

-- 4. Brands
CREATE TABLE public.brands (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT
);

-- 5. Customers
CREATE TABLE public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    status TEXT DEFAULT 'Active',
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0
);

-- 6. Orders
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES public.customers(id),
    customer_name TEXT,
    customer_email TEXT,
    customer_avatar TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Processing',
    payment TEXT,
    address TEXT NOT NULL,
    processing_date TIMESTAMPTZ,
    shipped_date TIMESTAMPTZ,
    out_for_delivery_date TIMESTAMPTZ,
    delivered_date TIMESTAMPTZ,
    coupon_code TEXT,
    discount_amount DECIMAL
);

-- 7. Order Items
CREATE TABLE public.order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT
);

-- 8. Coupons
CREATE TABLE public.coupons (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT,
    value NUMERIC,
    status TEXT,
    expiry DATE
);

-- 9. Flash Sales
CREATE TABLE public.flash_sales (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    discount TEXT,
    status TEXT,
    start_date DATE,
    end_date DATE
);

-- Turn on Row Level Security (RLS) but allow anonymous access for development
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;

-- Create policies to allow full public access (since authentication isn't fully locking down the DB yet)
CREATE POLICY "Allow public read/write categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow public read/write products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public read/write promotional_banners" ON public.promotional_banners FOR ALL USING (true);
CREATE POLICY "Allow public read/write brands" ON public.brands FOR ALL USING (true);
CREATE POLICY "Allow public read/write customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow public read/write orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public read/write order_items" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Allow public read/write coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Allow public read/write flash_sales" ON public.flash_sales FOR ALL USING (true);
