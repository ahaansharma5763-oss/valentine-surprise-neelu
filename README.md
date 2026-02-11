# 💖 Valentine's Day Interactive Experience

A personalized, interactive website with 3 stages: Puzzle, Game, and Love Letter.

## 🚀 How to Run Locally

1.  Simply double-click `index.html` to open it in your browser.
2.  **Note**: Audio might not auto-play until you interact with the page (click somewhere) due to browser security policies.

## 🎨 setup Assets

Before sending this to your special someone, replace the files in the `assets/` folder with your own:

| File Name | Description | Recommended Size |
| :--- | :--- | :--- |
| `image1.jpg` | Photo for the Sliding Puzzle | Square (e.g., 500x500px) |
| `image2.jpg` | Photo for the Final Love Letter | Any nice photo |
| `character.png` | Character for the Game | Small Square (e.g., 64x64px), Transparent BG |
| `music.mp3` | Background Music | MP3 format, ~2-3 mins loop |

## 🌐 How to Launch Online (GitHub Pages)

To send a link to someone, you need to host it. The easiest free way is **GitHub Pages**.

1.  **Create a GitHub Repository**:
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `valentine-surprise` (or similar).
    *   Make it **Public** (so they can see it) or Private (if you have Pro).
    *   Click "Create repository".

2.  **Upload Files**:
    *   Click "uploading an existing file" on the next screen.
    *   Drag and drop ALL your files (`index.html`, `style.css`, `script.js`, `game.js`, `puzzle.js` and the `assets` folder) into the box.
    *   Click "Commit changes".

3.  **Activate Pages**:
    *   Go to **Settings** (tab at the top of your repo).
    *   Click **Pages** (on the left sidebar).
    *   Under **Build and deployment** > **Branch**, select `main` (or `master`) and click **Save**.

4.  **Get the Link**:
    *   Wait about 1-2 minutes.
    *   Refresh the Pages settings page.
    *   You will see a banner: "Your site is live at..."
    *   **Send that link to your Valentine!** 💌

## 📝 Customizing Text

To change the Love Letter text:
1.  Open `script.js`.
2.  Scroll to the bottom (line ~64).
3.  Edit the text inside `letterText`. `\n` means a new line.

To change the Location:
1.  Open `index.html`.
2.  Find the `<a>` tag with `id="location-link"` (line 62).
3.  Change the `href` to your Google Maps link.
