#!/usr/bin/env node

const { NekoCLI } = require('./cli/cli');

// Main entry point for the NekoScript runtime
async function main() {
  try {
    // Initialize CLI
    const cli = new NekoCLI();
    
    // Run the CLI with command-line arguments
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error("Erreur fatale:", error);
    process.exit(1);
  }
}

// Start the application
main();
