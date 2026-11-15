# Space Mission

A browser-based space-program management game. Choose missions, research technologies, build rockets, and launch them to earn rewards and unlock the next missions.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8)
- npm

## Run locally

From the project directory, install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal, usually <http://localhost:5173/>.
The development server supports hot reloading as you edit the source files.

To check that the production bundle builds:

```bash
npm run build
```

To serve that build locally:

```bash
npm run preview
```

## Manual playtest

There is currently no automated `npm test` script. Use this walkthrough to test the main game loop:

1. Open the local app and choose **Jugar** (Play).
2. Select an empty campaign slot to create a campaign. On the mission map, select **Tierra** to enter the command center.
3. Open the mission tree, select the first mission, and choose **Confirmar e iniciar misión**. Review its launch conditions and reward.
4. Open **Investigación**. Check the categories and connected technologies; research requires science points and must be unlocked before its rocket component can be used.
5. Advance the turn to receive the monthly budget and science income. Research a technology needed by the selected mission.
6. Open **Taller** and assemble a rocket. Confirm that locked components cannot be installed and that the mission conditions update as the rocket changes.
7. Once all launch conditions are met, launch the rocket. Success is chance-based, so results can vary; a successful mission grants its reward and unlocks connected missions.
8. Refresh the browser and verify that the campaign progress remains available.

Campaign data is saved in the browser's local storage. Use the campaign's delete control in the app if you want to restart the walkthrough with a fresh save.
