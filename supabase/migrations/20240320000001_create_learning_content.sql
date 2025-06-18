-- Create learning_content table
CREATE TABLE IF NOT EXISTS public.learning_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'article', 'course')),
    url TEXT,
    thumbnail_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS learning_content_status_idx ON public.learning_content(status);
CREATE INDEX IF NOT EXISTS learning_content_type_idx ON public.learning_content(type);
CREATE INDEX IF NOT EXISTS learning_content_is_featured_idx ON public.learning_content(is_featured);

-- Enable Row Level Security
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active learning content"
    ON public.learning_content FOR SELECT
    USING (status = 'active');

CREATE POLICY "Only admins can insert learning content"
    ON public.learning_content FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.profiles 
            WHERE email = 'work.rparagoso@gmail.com'
        )
    );

CREATE POLICY "Only admins can update learning content"
    ON public.learning_content FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.profiles 
            WHERE email = 'work.rparagoso@gmail.com'
        )
    );

CREATE POLICY "Only admins can delete learning content"
    ON public.learning_content FOR DELETE
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.profiles 
            WHERE email = 'work.rparagoso@gmail.com'
        )
    );

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_learning_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER handle_learning_content_updated_at
    BEFORE UPDATE ON public.learning_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_learning_content_updated_at(); 