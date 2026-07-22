  - name: Set up Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '18'

  - name: Install system deps
    run: |
      sudo apt-get update
      sudo apt-get install -y gifsicle

  - name: Install npm deps
    run: |
      npm ci || true
      # if package.json doesn't exist (repo doesn't have a Node project), create minimal one and install puppeteer
      if [ ! -f package.json ]; then
        echo "{ \"name\": \"pinball-snake-gen\", \"private\": true, \"dependencies\": { \"puppeteer\": \"^21.0.0\" } }" > package.json
      fi
      npm install --no-audit --no-fund

  - name: Run generator
    run: |
      mkdir -p tmp_frames output
      node scripts/generate-pinball-snake.js

  - name: Commit and push GIF if changed
    run: |
      git config --local user.name "github-actions[bot]"
      git config --local user.email "github-actions[bot]@users.noreply.github.com"
      git add output/pinball-snake.gif || true
      if ! git diff --cached --exit-code; then
        git commit -m "chore: generate pinball-snake GIF"
        git push
      else
        echo "No changes to commit"
      fi
