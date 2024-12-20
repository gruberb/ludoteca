import { defineStore } from "pinia";
import config from "../config/api";

export const useGamesStore = defineStore("games", {
  state: () => ({
    games: [],
    metadata: { sources: [] },
    selectedPlatform: "all",
    selectedSource: "all",
    sortBy: "name",
    sortDirection: "asc",
    searchQuery: "",
    loading: false,
    error: null,
    selectedGame: null,
  }),

  getters: {
    // Helper to check platform support
    isPlatformSupported: (state) => {
      return (game, platform) => {
        if (platform === "steamdeck") {
          return game.platforms[platform] === "verified";
        }
        return game.platforms[platform] === true;
      };
    },

    filteredGames() {
      // Step 1: Filter by search query
      // This happens first because it's the broadest filter and can eliminate games early
      let filtered = this.searchQuery
        ? this.games.filter((game) =>
            game.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
          )
        : this.games;

      // Step 2: Filter by source
      // After searching, we filter games based on whether they appear in the selected ranking source
      filtered = filtered.filter((game) => {
        return (
          this.selectedSource === "all" ||
          (game.rankings && game.rankings[this.selectedSource] !== undefined)
        );
      });

      // Step 3: Sort the filtered games
      // Finally, we sort the remaining games according to the selected criterion
      const sorted = [...filtered].sort((a, b) => {
        let comparison = 0;

        switch (this.sortBy) {
          case "name":
            comparison = a.title.localeCompare(b.title);
            break;
          case "score":
            comparison = (b.harmony_score || 0) - (a.harmony_score || 0);
            break;
          case "metacritic":
            comparison = (b.metacritic || 0) - (a.metacritic || 0);
            break;
          case "date":
            comparison = new Date(b.release_date) - new Date(a.release_date);
            break;
          case "rank":
            const aRank =
              this.selectedSource === "all"
                ? Math.min(...Object.values(a.rankings || {})) || 999
                : a.rankings[this.selectedSource] || 999;
            const bRank =
              this.selectedSource === "all"
                ? Math.min(...Object.values(b.rankings || {})) || 999
                : b.rankings[this.selectedSource] || 999;
            comparison = aRank - bRank;
            break;
        }

        return this.sortDirection === "desc" ? -comparison : comparison;
      });

      return sorted;
    },

    displayedGamesCount() {
      return this.filteredGames.filter((game) => {
        return (
          this.selectedPlatform === "all" ||
          this.isPlatformSupported(game, this.selectedPlatform)
        );
      }).length;
    },

    totalGamesCount() {
      return this.games.length;
    },

    shouldBeOpaque() {
      return (game) => {
        if (this.selectedPlatform === "all") return false;
        return !this.isPlatformSupported(game, this.selectedPlatform);
      };
    },
  },

  actions: {
    async fetchGames() {
      this.loading = true;
      try {
        const response = await fetch(config.manifestUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.games = data.games;
        this.metadata = data.metadata;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    setSort({ field, direction = null }) {
      if (this.sortBy === field) {
        // Toggle direction if sorting by the same field
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        // New field, set direction to ascending or provided direction
        this.sortBy = field;
        this.sortDirection = direction || "asc";
      }
    },

    setSelectedPlatform(platform) {
      this.selectedPlatform = platform;
    },

    setSelectedSource(source) {
      this.selectedGame = null;
      this.selectedSource = source;
    },

    setSelectedGame(game) {
      this.selectedGame = game;
    },

    setSearchQuery(query) {
      this.searchQuery = query;
    },
  },
});
