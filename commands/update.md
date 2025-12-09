# Update CodeAssist

Update to the latest version.

## What to Do

```bash
# Show current version
echo "Current version:"
cat .claude/VERSION 2>/dev/null || echo "Unknown"

# Check for updates
echo ""
echo "Fetching latest version..."
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.claude/VERSION -o /tmp/codeassist-latest-version 2>/dev/null

if [ -f /tmp/codeassist-latest-version ]; then
    echo "Latest version: $(cat /tmp/codeassist-latest-version)"
    rm /tmp/codeassist-latest-version
fi

echo ""
echo "To update, run:"
echo "  curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash"
echo ""
echo "Changelog: https://github.com/liauw-media/CodeAssist/blob/main/CHANGELOG.md"
```

## When to Use

- Check for new versions
- Monthly maintenance
- After hearing about updates
