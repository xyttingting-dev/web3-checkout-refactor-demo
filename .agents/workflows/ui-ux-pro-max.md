---
description: Apply UI/UX Pro Max design intelligence to user requests
---

# UI/UX Pro Max Workflow

When the user requests UI/UX work (design, build, create, implement, review, fix, improve), you MUST follow this standardized process to leverage the `ui-ux-pro-max` skill.

## Step 1: Analyze Requirements
Extract the following information from the user's request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

## Step 2: Generate Design System (REQUIRED)
Always start with the `--design-system` flag to get comprehensive recommendations based on product and industry.

// turbo
```bash
python3 "/Users/jessie_xu/Downloads/.claude 7/skills/ui-ux-pro-max/scripts/search.py" "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

*Note: To persist this design system into hierarchical rules (`design-system/MASTER.md` and overrides), append `--persist` and optionally `--page "<page-name>"`.*

## Step 3: Supplement with Detailed Searches (as needed)
If you require more specific information after generating the main design system, use domain-specific inquiries:

// turbo
```bash
python3 "/Users/jessie_xu/Downloads/.claude 7/skills/ui-ux-pro-max/scripts/search.py" "<keyword>" --domain <domain>
```
*Available Domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`, `react`, `web`, `prompt`.*

## Step 4: Review Stack Guidelines
Obtain implementation-specific best practices for the chosen stack.

// turbo
```bash
python3 "/Users/jessie_xu/Downloads/.claude 7/skills/ui-ux-pro-max/scripts/search.py" "layout responsive" --stack <stack>
```
*Available Stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`. (Default is `html-tailwind`)*

## Step 5: Implement & Pre-Delivery Audit
Before delivering code to the user, ensure your UI fully complies with the requested design system and passes these UI/UX anti-patterns checks:
1. **No Emojis**: Always use real SVG icons (e.g., Lucide, Heroicons), NEVER text emojis.
2. **Interactive Elements**: Assure `cursor-pointer`, hover feedback, and focus outlines are present.
3. **Contrast**: Minimum 4.5:1 ratio, visible borders in light mode, correct muted text colors.
4. **Layout**: Content isn't hidden behind fixed nodes, responsive down to 375px without horizontal scrolling.
5. **Accessibility**: Form labels, aria-labels for icon buttons, alt text.
