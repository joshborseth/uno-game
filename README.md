# UNO - (November UFV Hackathon)

Welcome to the Uno Real-Time Card Game App built with Next.js, Create-T3-App, Tailwind CSS, DaisyUI, Pusher.js, PlanetScale, and DrizzleORM. This project provides a web-based Uno card game with real-time updates and plans for future expansion to include a native frontend using React Native.

## Getting Started

[Visit Live Deployment](https://uno-vert.vercel.app/)

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- PNPM: [Install PNPM](https://pnpm.io/installation)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/joshborseth/uno-game.git
   ```

2. Change into the project directory:

   ```bash
   cd uno-game
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

### Configuration

1. Create a Pusher account: [Pusher](https://pusher.com/)
2. Obtain Pusher API credentials and update them in the `.env` file:

   ```env
   NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
   ```

3. Set up PlanetScale: [PlanetScale](https://planetscale.com/)

4. Obtain your PlanetScale database connection details and update them in the `.env` file:

   ```env
   DATABASE_URL=your_database_url
   ```

5. Configure other environment variables as needed.

### Running the App

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to access the Uno Real-Time Card Game App.

## Features

- Real-time updates using Pusher.js
- Responsive design with Tailwind CSS and DaisyUI
- Backend data management with DrizzleORM
- Scalable database with PlanetScale

## Future Plans

We have exciting plans for the future of this Uno Real-Time Card Game App:

- Native frontend development using React Native
- Enhanced game features and animations
- Adding pickup cards together when they are the same

Stay tuned for updates!

## Contributing

Feel free to contribute to the project by opening issues or submitting pull requests. Check out our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This Uno Real-Time Card Game App is open-source and available under the [MIT License](LICENSE).

Happy hacking! 🃏🎉
