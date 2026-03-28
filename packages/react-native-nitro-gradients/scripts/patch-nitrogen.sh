#!/bin/bash
# patch-nitrogen.sh
#
# Patches generated Nitrogen iOS ViewComponent files to fix a bug where
# native views lose all props after react-native-screens navigation.
#
# BUG: When react-native-screens navigates away and back, it destroys and
# recreates native view instances. React's diffing sees props haven't changed,
# so Nitro's CachedProp `isDirty` flag stays false. The new native view instance
# receives zero props and renders blank.
#
# FIX: Add a `_needsInitialProps` flag that forces all props to be delivered
# on the first `updateProps` call, regardless of `isDirty` state.
#
# NOTE: This must be re-run after every `bun run specs` (nitrogen codegen).

set -e

VIEWS_DIR="$(dirname "$0")/../nitrogen/generated/ios/c++/views"

for file in "$VIEWS_DIR"/Hybrid*ViewComponent.mm; do
  [ -f "$file" ] || continue
  name=$(basename "$file")

  if grep -q '_needsInitialProps' "$file"; then
    echo "✓ $name (already patched)"
    continue
  fi

  sed -i '' 's/\(std::shared_ptr<.*> _hybridView;\)/\1\
  BOOL _needsInitialProps;/' "$file"

  sed -i '' 's/\(if (self = \[super init\]) {\)/\1\
    _needsInitialProps = YES;/' "$file"

  awk '
  /swiftPart\.beforeUpdate\(\);/ {
    print
    print ""
    print "  BOOL forceAll = _needsInitialProps;"
    setters = ""
    original = ""
    while (getline > 0) {
      if ($0 ~ /swiftPart\.afterUpdate\(\);/) {
        print "  if (forceAll) {"
        print "    _needsInitialProps = NO;"
        printf "%s", setters
        print "  } else {"
        printf "%s", original
        print "  }"
        print ""
        print $0
        break
      }
      if ($0 ~ /swiftPart\.set[A-Z]/) {
        setter = $0
        gsub(/^[[:space:]]+/, "", setter)
        gsub(/[[:space:]]+$/, "", setter)
        getline dirtyLine
        dirtyReset = dirtyLine
        gsub(/^[[:space:]]+/, "", dirtyReset)
        gsub(/[[:space:]]+$/, "", dirtyReset)
        setters = setters "    " setter " " dirtyReset "\n"
        original = original "    " setter "\n" dirtyLine "\n"
      } else {
        original = original $0 "\n"
      }
    }
    next
  }
  /newViewProps\.hybridRef\.isDirty\)/ {
    gsub(/newViewProps\.hybridRef\.isDirty\)/, "newViewProps.hybridRef.isDirty || forceAll)")
  }
  { print }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"

  echo "✅ $name patched"
done
