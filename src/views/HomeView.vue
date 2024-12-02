<template>
    <div>
        <AppHeader />
        <main
            class="container mx-auto px-4 transition-all duration-300"
            :class="{ 'mr-96': sidebarOpen }"
        >
            <div class="flex justify-between items-center mb-4">
                <div class="flex-1">
                    <FilterBar
                        :sortBy="gamesStore.sortBy"
                        :view="viewMode"
                        @sort="handleSort"
                        @sourceFilter="handleSourceFilter"
                        @platformFilter="handlePlatformFilter"
                        @update:view="viewMode = $event"
                    />
                </div>
            </div>

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

            <template v-else>
                <!-- Grid View -->
                <GameGrid
                    v-if="viewMode === 'grid'"
                    :games="gamesStore.filteredGames"
                    @selectGame="selectGame"
                />

                <!-- List View -->
                <GameList
                    v-else
                    :games="gamesStore.filteredGames"
                    :sortBy="gamesStore.sortBy"
                    :sortDirection="gamesStore.sortDirection"
                    @sort="handleSort"
                />
            </template>

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
import GameList from "../components/GameList.vue";
import GameSidebar from "../components/GameSidebar.vue";

const gamesStore = useGamesStore();
const sidebarOpen = ref(false);
const viewMode = ref("grid");

onMounted(async () => {
    await gamesStore.fetchGames();
});

const handleSort = ({ column, direction }) => {
    gamesStore.setSort({ column, direction });
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
