#!/usr/bin/env node
/**
 * Master seed script — runs all seeding tasks in order.
 * Usage: node seed-all.js
 */

import('./seed-cuisines.js');
import('./seed-meals.js');
import('./seed-chefs.js');
import('./seed-testimonials.js');
import('./seed-products.js');
import('./seed-website-pages.js');
import('./seed-blogs.js');

// Or run sequentially:
import { spawn } from 'child_process';
const scripts = [
  'seed-cuisines.js',
  'seed-meals.js',
  'seed-chefs.js',
  'seed-testimonials.js',
  'seed-products.js',
  'seed-website-pages.js',
  'seed-blogs.js'
];

let current = 0;

function runNext() {
  if (current >= scripts.length) {
    console.log('\n✅ All seeding complete!');
    process.exit(0);
  }
  const script = scripts[current];
  console.log(`\n▶ Running ${script}...`);
  const proc = spawn('node', [script], { stdio: 'inherit', cwd: __dirname });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`\n❌ ${script} failed with code ${code}. Stopping.`);
      process.exit(code);
    }
    current++;
    runNext();
  });
}

runNext();
