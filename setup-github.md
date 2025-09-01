# GitHub Repository Setup Instructions

To push this project to GitHub, follow these steps:

## 1. Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name the repository: `Pinboard`
5. Make it **Public** (or Private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## 2. Add the Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Pinboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Verify the Push

After pushing, you can visit your repository at:
`https://github.com/YOUR_USERNAME/Pinboard`

## Features Included

✅ **Dark Mode Support**: Automatically adapts to browser color scheme preference
✅ **Responsive Design**: Works on all device sizes
✅ **Modern UI**: Glass-morphism design with smooth animations
✅ **Complete Documentation**: README with setup instructions

The dark mode implementation uses CSS `prefers-color-scheme` media query to automatically switch between light and dark themes based on the user's browser settings.
