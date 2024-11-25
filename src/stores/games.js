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
      // First, filter games based on search query
      let filtered = this.searchQuery
        ? this.games.filter((game) =>
            game.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
          )
        : this.games;

      // Then filter by source
      filtered = filtered.filter((game) => {
        return (
          this.selectedSource === "all" ||
          (game.rankings && game.rankings[this.selectedSource] !== undefined)
        );
      });

      // Sort the filtered games
      filtered.sort((a, b) => {
        if (this.sortBy === "rank") {
          const aRank =
            this.selectedSource === "all"
              ? Math.min(...Object.values(a.rankings || {})) || 999
              : a.rankings[this.selectedSource] || 999;
          const bRank =
            this.selectedSource === "all"
              ? Math.min(...Object.values(b.rankings || {})) || 999
              : b.rankings[this.selectedSource] || 999;
          return aRank - bRank;
        } else {
          return new Date(b.release_date) - new Date(a.release_date);
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
