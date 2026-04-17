import { createClient } from '@supabase/supabase-js';

// No need for dotenv - Next.js handles .env.local when run via npm script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase keys. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearInquiries() {
    console.log("Starting Atelier Database Surgery...");

    // This deletes all rows from the inquiries table
    const { error } = await supabase
        .from('inquiries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Surgical wipe of all UUIDs

    if (error) {
        console.error("Error wiping table:", error.message);
    } else {
        console.log("Success: Showroom floor is now spotless. All test inquiries removed.");
    }
}

clearInquiries();
