const { Pool } = require("pg");
require("dotenv").config();

// This will use the DATABASE_URL from your environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Create tables
    console.log("Creating tables...");

    // Teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        rating DECIMAL(3,1) NOT NULL,
        date_est DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    // Players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        world_ranking INTEGER NOT NULL,
        playing_hand VARCHAR(50) NOT NULL,
        age INTEGER NOT NULL,
        join_date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    // Team_Players junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_players (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        join_date DATE NOT NULL DEFAULT CURRENT_DATE,
        UNIQUE(team_id, player_id)
      );
    `);

    console.log("Tables created successfully");

    // Clear existing data
    console.log("Clearing existing data...");
    await client.query("DELETE FROM team_players");
    await client.query("DELETE FROM players");
    await client.query("DELETE FROM teams");

    // Insert sample data
    console.log("Inserting sample data...");

    // Insert players
    const players = [
      ["Novak", "Djokovic", "Serbia", 1, "right", 36],
      ["Carlos", "Alcaraz", "Spain", 2, "right", 20],
      ["Jannik", "Sinner", "Italy", 3, "right", 22],
      ["Daniil", "Medvedev", "Russia", 4, "right", 28],
      ["Rafael", "Nadal", "Spain", 5, "left", 37],
    ];

    for (const [
      first_name,
      last_name,
      country,
      world_ranking,
      playing_hand,
      age,
    ] of players) {
      await client.query(
        `INSERT INTO players (first_name, last_name, country, world_ranking, playing_hand, age)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [first_name, last_name, country, world_ranking, playing_hand, age]
      );
    }

    // Insert teams
    const teams = [
      ["European All-Stars", 9.5],
      ["Young Guns", 8.8],
      ["Veterans United", 8.2],
    ];

    for (const [team_name, rating] of teams) {
      await client.query(
        `INSERT INTO teams (team_name, rating)
         VALUES ($1, $2)
         RETURNING id`,
        [team_name, rating]
      );
    }

    // Create team-player associations
    // Get all players
    const { rows: playerRows } = await client.query(
      "SELECT id, first_name FROM players"
    );

    // Get all teams
    const { rows: teamRows } = await client.query(
      "SELECT id, team_name FROM teams"
    );

    // Create associations
    const associations = [
      [teamRows[0].id, playerRows[0].id], // European All-Stars - Djokovic
      [teamRows[0].id, playerRows[2].id], // European All-Stars - Sinner
      [teamRows[1].id, playerRows[1].id], // Young Guns - Alcaraz
      [teamRows[1].id, playerRows[2].id], // Young Guns - Sinner
      [teamRows[2].id, playerRows[0].id], // Veterans United - Djokovic
      [teamRows[2].id, playerRows[4].id], // Veterans United - Nadal
    ];

    for (const [team_id, player_id] of associations) {
      await client.query(
        `INSERT INTO team_players (team_id, player_id, join_date)
         VALUES ($1, $2, CURRENT_DATE)`,
        [team_id, player_id]
      );
    }

    // Commit transaction
    await client.query("COMMIT");
    console.log("Database setup completed successfully!");
  } catch (error) {
    // Rollback in case of error
    await client.query("ROLLBACK");
    console.error("Error setting up database:", error);
    throw error;
  } finally {
    // Release the client
    client.release();
    // Close the pool
    await pool.end();
  }
}

// Run the setup
setupDatabase().catch(console.error);
