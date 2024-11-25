<template>
    <div>
        <AppHeader />

        <main class="container mx-auto px-4">
            <FilterBar
                :sortBy="gamesStore.sortBy"
                @sort="handleSort"
                @sourceFilter="handleSourceFilter"
                @platformFilter="handlePlatformFilter"
            />

            <div v-if="gamesStore.loading" class="text-center py-12">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"
                ></div>
            </div>

            <div
                v-else-if="gamesStore.error"
                class="text-center py-12 text-red-600"
            >
                {{ gamesStore.error }}
            </div>

            <GameGrid
                v-else
                :games="gamesStore.filteredGames"
                @selectGame="selectGame"
            />

            <GameSidebar
                v-if="gamesStore.selectedGame"
                :game="gamesStore.selectedGame"
                :isOpen="sidebarOpen"
                @update:isOpen="sidebarOpen = $event"
            />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGamesStore } from "../stores/games";
import AppHeader from "../components/AppHeader.vue";
import FilterBar from "../components/FilterBar.vue";
import GameGrid from "../components/GameGrid.vue";
import GameSidebar from "../components/GameSidebar.vue";

const gamesStore = useGamesStore();
const sidebarOpen = ref(false);

onMounted(async () => {
    await gamesStore.fetchGames();
});

const handleSort = (sortBy) => {
    gamesStore.setSortBy(sortBy);
};

const handleSourceFilter = (source) => {
    gamesStore.setSelectedSource(source);
};

const handlePlatformFilter = (platform) => {
    gamesStore.setSelectedPlatform(platform);
};

const selectGame = (game) => {
    gamesStore.setSelectedGame(game);
    sidebarOpen.value = true;
};
</script>
