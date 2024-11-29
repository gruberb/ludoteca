// src/stores/games.js
import { defineStore } from "pinia";
import config from "../config/api";

export const useGamesStore = defineStore("games", {
  state: () => ({
    games: [],
    selectedPlatform: "all",
    selectedSource: "all",
    sortBy: "rank",
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
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case "rank":
            // When sorting by rank, we need to handle both "all sources" and specific source cases
            const aRank =
              this.selectedSource === "all"
                ? Math.min(...Object.values(a.rankings || {})) || 999
                : a.rankings[this.selectedSource] || 999;
            const bRank =
              this.selectedSource === "all"
                ? Math.min(...Object.values(b.rankings || {})) || 999
                : b.rankings[this.selectedSource] || 999;
            return aRank - bRank;

          case "date":
            // Simple date comparison, newer games first
            return new Date(b.release_date) - new Date(a.release_date);

          case "score":
            // New sorting option for total score
            // Use || 0 to handle cases where total_score might be undefined
            return (b.total_score || 0) - (a.total_score || 0);

          default:
            return 0;
        }
      });

      return filtered;
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
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    setSelectedPlatform(platform) {
      this.selectedPlatform = platform;
    },

    setSelectedSource(source) {
      this.selectedGame = null;
      this.selectedSource = source;
    },

    setSortBy(sortBy) {
      this.sortBy = sortBy;
    },

    setSelectedGame(game) {
      this.selectedGame = game;
    },

    setSearchQuery(query) {
      this.searchQuery = query;
    },
  },
});
