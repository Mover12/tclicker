const upgrades = {
  1: {
    id: 1,
    name: "Улучшение 1",
    description: "+10 в секунду",
    price: 100,
    effects: {
      clicks_per_ms: (value) => value + 0.001,
    }
  },
  2: {
    id: 2,
    name: "Улучшение 1",
    description: "+20 в секунду",
    price: 200,
    effects: {
      clicks_per_ms: (value) => value + 0.002,
    }
  },
  3: {
    id: 3,
    name: "Улучшение 3",
    description: "+30 в секунду",
    price: 300,
    effects: {
      clicks_per_ms: (value) => value + 0.003,
    }
  },
  4: {
    id: 4,
    name: "Улучшение 4",
    description: "+40 в секунду",
    price: 400,
    effects: {
      clicks_per_ms: (value) => value + 0.004,
    }
  }
}

module.exports = upgrades