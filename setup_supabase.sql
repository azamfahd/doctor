-- إنشاء جدول السجلات الطبية
CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age TEXT,
    gender TEXT,
    symptoms TEXT,
    vitals JSONB,
    image TEXT,
    diagnosis JSONB,
    chat_history JSONB DEFAULT '[]'::jsonb,
    date TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الإعدادات
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    center_name TEXT,
    doctor_name TEXT,
    personality TEXT,
    model TEXT,
    deep_thinking BOOLEAN,
    thinking_budget INTEGER,
    google_search BOOLEAN,
    theme TEXT,
    auto_save BOOLEAN,
    voice_enabled BOOLEAN,
    voice_output_enabled BOOLEAN,
    profile_image TEXT,
    api_key TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة سياسات الوصول (RLS)
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to records" ON records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to settings" ON settings FOR ALL USING (true) WITH CHECK (true);
