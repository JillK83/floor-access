const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

const cleanItems = [
  {
    name: "Hand Painted Teal Cabinet",
    price: 1150,
    description: "Measurements 39”W x 16.5”D x 35”H",
    image_url: "https://static1.squarespace.com/static/59c26c90bce176b201481ae4/63b5b6ee64b96a44587f8628/674f76274472251de1f0e470/1776388484176/68a735c05c6d32df1e57c8d94e63784f183955628b056158e26715ae62ad7eb2.png",
    status: "available"
  },
  {
    name: "5 Drawers Panel Doors Tall Cabinet",
    price: 1750,
    description: "Measurements 26.5”W x 16”D x 73”H",
    image_url: "https://static1.squarespace.com/static/59c26c90bce176b201481ae4/63b5b6ee64b96a44587f8628/674f26ca4472251de1f08833/1776388484176/5fa675109b8296a246813248801d848135899dd061730d12594a1d643d92ec35.png",
    status: "available"
  },
  {
    name: "Antique Distressed Cream Cabinet",
    price: 850,
    description: "Measurements 41.5”W x 19”D x 33.25”H",
    image_url: "https://static1.squarespace.com/static/59c26c90bce176b201481ae4/63b5b6ee64b96a44587f8628/674f260d4472251de1f0814a/1776388484176/5d54ed919ac5fefde7fc26fb46969eb21e0693581177651030e463a8a9a46077.png",
    status: "available"
  }
];

async function forceMigrate() {
  console.log('FORCE: Deleting ALL inquiries...');
  await supabase.from('inquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('FORCE: Deleting ALL floor items...');
  await supabase.from('floor_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('FORCE: Inserting 3 REAL items...');
  const { data, error } = await supabase.from('floor_items').insert(cleanItems).select();
  
  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data.length, 'items inserted.');
    console.log('FIRST ITEM IMAGE:', data[0].image_url);
  }
}

forceMigrate();
