# ESLint Inspector

The ESLint Inspector is an interactive tool that helps you visualize and understand the ESLint configuration in your project.

## Overview

The ESLint Inspector provides:

- 📋 **Complete rule overview** - See all active ESLint rules in your configuration
- 🔍 **Rule details** - View descriptions, severity levels, and options for each rule
- 🏷️ **Category filtering** - Browse rules by category (Vue, TypeScript, Best Practices, etc.)
- 🔗 **Documentation links** - Quick access to official documentation for each rule
- ⚙️ **Configuration insights** - Understand how rules are configured in your project

## Launch the Inspector

You can access the ESLint Inspector directly from this documentation site:

<div class="tip custom-block" style="padding-top: 8px">
  <p style="font-size: 1.1em; margin-bottom: 12px;">
    👉 <strong><a href="/wisemen-core/eslint-inspector/" target="_blank">Open ESLint Inspector</a></strong>
  </p>
  <p style="margin: 0; font-size: 0.95em;">
    The inspector will open in a new window where you can explore all the rules included in <code>@wisemen/eslint-config-vue</code>.
  </p>
</div>

## How to Use

### 1. Browse Rules

The main view shows all ESLint rules organized by plugin and category. Use the navigation to filter rules:

- **By Plugin**: View rules from specific plugins (Vue, TypeScript, ESLint core, etc.)
- **By Category**: Filter by rule categories (Best Practices, Possible Errors, etc.)
- **By Status**: See which rules are enabled, disabled, or set to warning

### 2. Search for Rules

Use the search bar to quickly find specific rules by name or keyword. This is helpful when you:

- Want to understand why a specific error is occurring
- Need to check if a rule is enabled
- Want to find rules related to a specific topic

### 3. View Rule Details

Click on any rule to see:

- **Description**: What the rule checks for
- **Severity**: Error, warning, or disabled
- **Options**: Configuration options and their current values
- **Documentation**: Links to official rule documentation
- **Examples**: Code examples showing correct and incorrect patterns

### 4. Understand Configuration

The inspector shows how rules are configured in the `@wisemen/eslint-config-vue` preset, helping you:

- Understand default rule settings
- Decide which rules to override in your project
- Learn about available configuration options
- See the reasoning behind rule configurations

## Use Cases

### Debugging Lint Errors

When you encounter a lint error you don't understand:

1. Open the ESLint Inspector
2. Search for the rule name (shown in the error message)
3. Read the rule description and examples
4. Click through to the full documentation if needed

### Customizing Configuration

When you want to customize your ESLint setup:

1. Browse the inspector to see all available rules
2. Identify rules you want to change
3. Check the current configuration and available options
4. Add overrides to your `eslint.config.js`

### Learning Best Practices

Use the inspector to:

- Discover rules you didn't know existed
- Learn about Vue.js and TypeScript best practices
- Understand why certain patterns are recommended or discouraged
- Improve your code quality knowledge
