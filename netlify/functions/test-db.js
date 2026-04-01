const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data, error } = await supabase
    .from('borrowers')
    .select('count')
    .limit(1);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ connected: false, error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ connected: true })
  };
};
