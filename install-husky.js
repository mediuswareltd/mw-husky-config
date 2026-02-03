#!/usr/bin/env node

/**
 * Husky Config Installer
 * 
 * This script installs Husky hooks from the husky-config package
 * into your project's .husky directory.
 * 
 * Usage:
 *   npx husky-config install-husky
 * 
 * What it does:
 *   1. Initializes Husky in the target project
 *   2. Copies all hook files from this package to the project
 *   3. Makes hooks executable (on Unix-based systems)
 *   4. Provides setup guidance for required dependencies
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('');
  log('='.repeat(70), 'blue');
  log(`  ${message}`, 'bright');
  log('='.repeat(70), 'blue');
  console.log('');
}

function logSuccess(message) {
  log(`[SUCCESS] ${message}`, 'green');
}

function logWarning(message) {
  log(`[WARNING] ${message}`, 'yellow');
}

function logError(message) {
  log(`[ERROR] ${message}`, 'red');
}

function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function promptYesNo(message, defaultYes = true) {
  const defaultOption = defaultYes ? 'Y/n' : 'y/N';
  const answer = await question(`${message} (${defaultOption}): `);
  const normalized = answer.trim().toLowerCase();
  
  if (normalized === '') {
    return defaultYes;
  }
  
  return normalized === 'y' || normalized === 'yes';
}

function installDependencies(dependencies, isDev = true) {
  const devFlag = isDev ? '--save-dev' : '--save';
  const command = `npm install ${devFlag} ${dependencies.join(' ')}`;
  
  log(`Running: ${command}`, 'blue');
  execSync(command, { stdio: 'inherit' });
}

function updatePackageJson(packageJsonPath, updates) {
  const packageJson = fs.readJsonSync(packageJsonPath);
  
  // Merge scripts
  if (updates.scripts) {
    packageJson.scripts = packageJson.scripts || {};
    Object.assign(packageJson.scripts, updates.scripts);
  }
  
  // Merge lint-staged
  if (updates['lint-staged']) {
    packageJson['lint-staged'] = updates['lint-staged'];
  }
  
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
}

async function installHusky() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const isNonInteractive = args.includes('--yes') || args.includes('-y');
    
    // Determine installation mode
    let installMode = 'full-setup'; // default
    if (args.includes('--only-commit-msg')) {
      installMode = 'only-commit-msg';
    } else if (args.includes('--only-style-commit-msg')) {
      installMode = 'only-style-commit-msg';
    } else if (args.includes('--full-setup')) {
      installMode = 'full-setup';
    }
    
    logHeader('Installing Husky Configuration');
    
    // Display mode
    const modeDescriptions = {
      'full-setup': 'Full Setup (pre-commit + commit-msg + security)',
      'only-style-commit-msg': 'Style & Commit Message (prettier, eslint, spelling + commit-msg)',
      'only-commit-msg': 'Commit Message Only (conventional commits validation)'
    };
    
    log(`Mode: ${modeDescriptions[installMode]}`, 'blue');
    
    if (isNonInteractive) {
      log('Running in non-interactive mode (--yes flag detected)', 'blue');
    }
    console.log('');

    // Get paths
    const packageRoot = __dirname;
    const targetRoot = process.cwd();
    const sourceHuskyDir = path.join(packageRoot, '.husky');
    const targetHuskyDir = path.join(targetRoot, '.husky');

    log('Source: ' + sourceHuskyDir, 'blue');
    log('Target: ' + targetHuskyDir, 'blue');
    console.log('');

    // Step 1: Check if source .husky directory exists
    if (!fs.existsSync(sourceHuskyDir)) {
      logError('Source .husky directory not found in husky-config package!');
      logError('Path checked: ' + sourceHuskyDir);
      process.exit(1);
    }

    // Step 2: Initialize Husky in the target project
    log('Step 1: Initializing Husky...', 'bright');
    try {
      execSync('npx husky install', { 
        cwd: targetRoot, 
        stdio: 'inherit' 
      });
      logSuccess('Husky initialized successfully');
    } catch (error) {
      logWarning('Husky initialization had issues (this may be okay if already initialized)');
    }
    console.log('');

    // Step 3: Copy .husky folder to target project (based on mode)
    log('Step 2: Copying Git hooks...', 'bright');
    
    // Ensure target directory exists
    await fs.ensureDir(targetHuskyDir);

    // Determine which hooks to copy based on mode
    const hooksMapping = {
      'full-setup': [
        { source: 'commit-msg', target: 'commit-msg' },
        { source: 'pre-commit', target: 'pre-commit' }
      ],
      'only-style-commit-msg': [
        { source: 'commit-msg', target: 'commit-msg' },
        { source: 'pre-commit-style', target: 'pre-commit' }
      ],
      'only-commit-msg': [
        { source: 'commit-msg', target: 'commit-msg' }
      ]
    };
    
    const selectedHooks = hooksMapping[installMode];

    // Copy selected hooks
    for (const hook of selectedHooks) {
      const sourcePath = path.join(sourceHuskyDir, hook.source);
      const targetPath = path.join(targetHuskyDir, hook.target);
      
      if (!fs.existsSync(sourcePath)) {
        logWarning(`Source hook ${hook.source} not found, skipping`);
        continue;
      }
      
      await fs.copy(sourcePath, targetPath, { overwrite: true });
      
      // Make the hook executable (Unix-based systems)
      if (process.platform !== 'win32') {
        try {
          await fs.chmod(targetPath, 0o755);
        } catch (error) {
          logWarning(`Could not set executable permission for ${hook.target}`);
        }
      }
      
      logSuccess(`Copied ${hook.target}${hook.source !== hook.target ? ` (from ${hook.source})` : ''}`);
    }
    console.log('');

    // Step 3.5: Copy .gitmessage template if it exists
    const sourceGitMessage = path.join(packageRoot, '.gitmessage');
    const targetGitMessage = path.join(targetRoot, '.gitmessage');
    
    if (fs.existsSync(sourceGitMessage)) {
      await fs.copy(sourceGitMessage, targetGitMessage, { overwrite: true });
      logSuccess('Copied .gitmessage template');
      
      // Try to set it as the commit template
      try {
        execSync('git config commit.template .gitmessage', { 
          cwd: targetRoot, 
          stdio: 'pipe' 
        });
        logSuccess('Configured Git to use .gitmessage template');
      } catch (error) {
        logWarning('Could not set commit.template (this is optional)');
      }
    }
    
    // Step 3.6: Copy .secretlintrc.json if needed for full-setup mode
    if (installMode === 'full-setup') {
      const sourceSecretlintrc = path.join(packageRoot, '.secretlintrc.json');
      const targetSecretlintrc = path.join(targetRoot, '.secretlintrc.json');
      
      if (fs.existsSync(sourceSecretlintrc)) {
        // Only copy if it doesn't exist (don't overwrite user's config)
        if (!fs.existsSync(targetSecretlintrc)) {
          await fs.copy(sourceSecretlintrc, targetSecretlintrc, { overwrite: false });
          logSuccess('Copied .secretlintrc.json config');
        } else {
          log('Using existing .secretlintrc.json config', 'blue');
        }
      }
    }
    console.log('');

    // Step 4: Check for package.json and automate configuration
    log('Step 3: Configuring project...', 'bright');
    const packageJsonPath = path.join(targetRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      logWarning('package.json not found in current directory');
      logWarning('Skipping automated configuration');
      console.log('');
      return;
    }
    
    logSuccess('package.json found');
    console.log('');
    
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Check existing dependencies
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    // Define required dependencies based on mode
    const requiredDepsByMode = {
      'full-setup': {
        core: ['husky', 'lint-staged'],
        tools: ['prettier', 'eslint', 'cspell', 'secretlint', '@secretlint/secretlint-rule-preset-recommend']
      },
      'only-style-commit-msg': {
        core: ['husky', 'lint-staged'],
        tools: ['prettier', 'eslint', 'cspell']
      },
      'only-commit-msg': {
        core: ['husky'],
        tools: []
      }
    };
    
    const requiredDeps = requiredDepsByMode[installMode];
    const missingCore = requiredDeps.core.filter(dep => !allDeps[dep]);
    const missingTools = requiredDeps.tools.filter(dep => !allDeps[dep]);
    
    // Step 5: Install dependencies
    if (missingCore.length > 0 || missingTools.length > 0) {
      log('Step 4: Installing dependencies...', 'bright');
      console.log('');
      
      if (missingCore.length > 0) {
        log(`Missing core dependencies: ${missingCore.join(', ')}`, 'yellow');
        const shouldInstallCore = isNonInteractive || await promptYesNo('Install core dependencies now?');
        
        if (shouldInstallCore) {
          try {
            installDependencies(missingCore, true);
            logSuccess('Core dependencies installed');
          } catch (error) {
            logError('Failed to install core dependencies');
            log('Please install manually: npm install --save-dev ' + missingCore.join(' '), 'yellow');
          }
        }
        console.log('');
      }
      
      if (missingTools.length > 0) {
        log(`Missing tool dependencies: ${missingTools.join(', ')}`, 'yellow');
        const shouldInstallTools = isNonInteractive || await promptYesNo('Install tool dependencies now?');
        
        if (shouldInstallTools) {
          try {
            installDependencies(missingTools, true);
            logSuccess('Tool dependencies installed');
          } catch (error) {
            logError('Failed to install tool dependencies');
            log('Please install manually: npm install --save-dev ' + missingTools.join(' '), 'yellow');
          }
        }
        console.log('');
      }
    } else {
      logSuccess('All dependencies already installed');
      console.log('');
    }
    
    // Step 6: Configure package.json
    log('Step 5: Configuring package.json...', 'bright');
    
    // Define scripts and lint-staged config based on mode
    const scriptsByMode = {
      'full-setup': {
        'format': 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"',
        'lint:fix': 'eslint --fix',
        'spell': 'cspell "**/*.{js,jsx,ts,tsx,md,json}" --no-progress',
        'security:secrets': 'secretlint "**/*"',
        'security': 'npm audit --audit-level=moderate',
        'prepare': 'husky'
      },
      'only-style-commit-msg': {
        'format': 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"',
        'lint:fix': 'eslint --fix',
        'spell': 'cspell "**/*.{js,jsx,ts,tsx,md,json}" --no-progress',
        'prepare': 'husky'
      },
      'only-commit-msg': {
        'prepare': 'husky'
      }
    };
    
    const lintStagedByMode = {
      'full-setup': {
        '*.{js,jsx,ts,tsx}': [
          'prettier --write',
          'eslint --fix',
          'cspell --no-must-find-files'
        ],
        '*.{json,css,md}': [
          'prettier --write',
          'cspell --no-must-find-files'
        ]
      },
      'only-style-commit-msg': {
        '*.{js,jsx,ts,tsx}': [
          'prettier --write',
          'eslint --fix',
          'cspell --no-must-find-files'
        ],
        '*.{json,css,md}': [
          'prettier --write',
          'cspell --no-must-find-files'
        ]
      },
      'only-commit-msg': null // No lint-staged needed
    };
    
    const requiredScripts = scriptsByMode[installMode];
    const lintStagedConfig = lintStagedByMode[installMode];
    
    const existingScripts = packageJson.scripts || {};
    const existingLintStaged = packageJson['lint-staged'];
    
    const missingScripts = Object.keys(requiredScripts).filter(
      script => !existingScripts[script] || existingScripts[script] !== requiredScripts[script]
    );
    
    const needsLintStaged = lintStagedConfig && (
      !existingLintStaged || 
      JSON.stringify(existingLintStaged) !== JSON.stringify(lintStagedConfig)
    );
    
    if (missingScripts.length > 0 || needsLintStaged) {
      console.log('');
      if (missingScripts.length > 0) {
        log('Missing or outdated scripts:', 'yellow');
        missingScripts.forEach(script => {
          log(`  - ${script}`, 'yellow');
        });
      }
      
      if (needsLintStaged) {
        log('lint-staged configuration needs updating', 'yellow');
      }
      
      console.log('');
      const shouldUpdateConfig = isNonInteractive || await promptYesNo('Update package.json configuration now?');
      
      if (shouldUpdateConfig) {
        try {
          const updates = { scripts: requiredScripts };
          if (lintStagedConfig) {
            updates['lint-staged'] = lintStagedConfig;
          }
          updatePackageJson(packageJsonPath, updates);
          logSuccess('package.json updated successfully');
        } catch (error) {
          logError('Failed to update package.json');
          console.error(error);
        }
      }
    } else {
      logSuccess('package.json already configured');
    }
    console.log('');

    // Success summary
    logHeader('Installation Complete!');
    
    log('[SUCCESS] Git hooks installed in .husky/', 'green');
    log('[SUCCESS] Commit message template configured', 'green');
    log('[SUCCESS] Dependencies installed', 'green');
    log('[SUCCESS] package.json configured', 'green');
    console.log('');
    
    log('Your project is now set up with:', 'bright');
    
    // Mode-specific features
    if (installMode === 'full-setup') {
      log('  • Pre-commit hooks (formatting, linting, spelling, security)', 'blue');
      log('  • Commit message validation (conventional commits)', 'blue');
      log('  • Git commit template for guidance', 'blue');
    } else if (installMode === 'only-style-commit-msg') {
      log('  • Pre-commit hooks (formatting, linting, spelling)', 'blue');
      log('  • Commit message validation (conventional commits)', 'blue');
      log('  • Git commit template for guidance', 'blue');
      log('  • Note: Security checks not included in this mode', 'yellow');
    } else if (installMode === 'only-commit-msg') {
      log('  • Commit message validation (conventional commits)', 'blue');
      log('  • Git commit template for guidance', 'blue');
      log('  • Note: No pre-commit style/security checks in this mode', 'yellow');
    }
    console.log('');
    
    log('Next steps:', 'bright');
    log('  • Customize hooks in .husky/ if needed', 'blue');
    log('  • Make your first commit to test the setup', 'blue');
    console.log('');
    
    log('Try committing:', 'bright');
    log('  git add .', 'blue');
    log('  git commit -m "feat: initial commit with husky hooks"', 'blue');
    console.log('');
    
    log('For more information:', 'bright');
    log('  https://typicode.github.io/husky/', 'blue');
    log('  https://github.com/mediuswareltd/conventional-commit-spec', 'blue');
    console.log('');

  } catch (error) {
    console.log('');
    logHeader('Installation Failed');
    logError('An error occurred during installation:');
    console.error(error);
    process.exit(1);
  }
}

// Run the installer
installHusky();
