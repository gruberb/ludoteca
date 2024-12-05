<template>
    <div class="bg-white shadow rounded-lg p-4 mb-6">
        <!-- Search Bar - Always visible -->
        <div class="mb-4">
            <div class="relative">
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search games..."
                    class="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    @input="handleSearch"
                />
                <Search
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size="20"
                />
            </div>
        </div>

        <!-- Mobile Filter Toggle -->
        <button
            @click="isFilterOpen = !isFilterOpen"
            class="md:hidden w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg mb-4 text-gray-700"
        >
            <span class="flex items-center gap-2">
                <SlidersHorizontal size="18" />
                Filters & Sort
                <span
                    v-if="activeFilterCount > 0"
                    class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full"
                >
                    {{ activeFilterCount }}
                </span>
            </span>
            <ChevronDown
                :class="{ 'rotate-180': isFilterOpen }"
                class="transition-transform duration-200"
                size="18"
            />
        </button>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
            <span
                v-if="sortBy !== 'name'"
                class="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
            >
                Sort: {{ formatSortBy(sortBy) }}
                <X
                    size="14"
                    class="ml-1 cursor-pointer"
                    @click="handleMobileFilter('sort', 'name')"
                />
            </span>

            <span
                v-if="store.selectedPlatform !== 'all'"
                class="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
            >
                Platform: {{ formatPlatformName(store.selectedPlatform) }}
                <X
                    size="14"
                    class="ml-1 cursor-pointer"
                    @click="handleMobileFilter('platform', 'all')"
                />
            </span>

            <span
                v-if="store.selectedSource !== 'all'"
                class="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
            >
                Source: {{ store.selectedSource }}
                <X
                    size="14"
                    class="ml-1 cursor-pointer"
                    @click="handleMobileFilter('source', 'all')"
                />
            </span>

            <button
                @click="resetFilters"
                class="text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
                Reset all
            </button>
        </div>

        <!-- Filters Section -->
        <div :class="{ 'hidden md:block': !isFilterOpen }">
            <!-- Desktop Layout: Filters in a row -->
            <div
                class="flex flex-col md:flex-row md:gap-4 space-y-4 md:space-y-0"
            >
                <!-- Sort Dropdown -->
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Sort by
                    </label>
                    <select
                        class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                        @change="(e) => handleFilter('sort', e.target.value)"
                        :value="sortBy"
                    >
                        <option value="name">Name</option>
                        <option value="rank">Ranking</option>
                        <option value="date">Release Date</option>
                        <option value="metacritic">Metacritic Score</option>
                        <option value="score">Harmony Score</option>
                    </select>
                </div>

                <!-- Source Dropdown -->
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Source
                    </label>
                    <select
                        class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                        @change="
                            (e) => handleMobileFilter('source', e.target.value)
                        "
                        :value="store.selectedSource"
                    >
                        <option value="all">All Sources</option>
                        <option value="IGN">IGN</option>
                        <option value="PCGamer">PC Gamer</option>
                        <option value="Eurogamer">Eurogamer</option>
                        <option value="Polygon">Polygon</option>
                        <option value="RPS">RPS</option>
                        <option value="Polygon - PS5 Top 25">
                            Polygon - PS5 Top 25
                        </option>
                    </select>
                </div>

                <!-- Platform Dropdown -->
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Platform
                    </label>
                    <select
                        class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                        @change="
                            (e) =>
                                handleMobileFilter('platform', e.target.value)
                        "
                        :value="store.selectedPlatform"
                    >
                        <option value="all">All Platforms</option>
                        <option value="windows">Windows</option>
                        <option value="macos">macOS</option>
                        <option value="linux">Linux</option>
                        <option value="steamdeck">Steam Deck</option>
                        <option value="switch">Switch</option>
                    </select>
                </div>

                <!-- View Toggle -->
                <div class="flex-initial">
                    <div class="block text-sm font-medium text-gray-700 mb-1">
                        View
                    </div>
                    <div class="flex items-center gap-1">
                        <button
                            @click="$emit('update:view', 'grid')"
                            :class="[
                                'p-2 rounded transition-colors',
                                view === 'grid'
                                    ? 'bg-gray-100 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-100',
                            ]"
                        >
                            <LayoutGrid size="20" />
                        </button>
                        <button
                            @click="$emit('update:view', 'list')"
                            :class="[
                                'p-2 rounded transition-colors',
                                view === 'list'
                                    ? 'bg-gray-100 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-100',
                            ]"
                        >
                            <ListIcon size="20" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Game Count -->
        <div class="mt-4 text-sm text-gray-600">
            Showing {{ store.displayedGamesCount }} of
            {{ store.totalGamesCount }} games
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    LayoutGrid,
    List as ListIcon,
    X,
} from "lucide-vue-next";
import { useGamesStore } from "../stores/games";

const store = useGamesStore();
const searchQuery = ref("");
const isFilterOpen = ref(false);

const props = defineProps({
    sortBy: {
        type: String,
        required: true,
    },
    view: {
        type: String,
        required: true,
    },
});

const emit = defineEmits([
    "sort",
    "sourceFilter",
    "platformFilter",
    "update:view",
]);

const handleSearch = () => {
    store.setSearchQuery(searchQuery.value);
};

const handleMobileFilter = (type, value) => {
    if (window.innerWidth < 768) {
        isFilterOpen.value = false;
    }
    if (type === "sort") {
        emit("sort", value);
    } else {
        emit(`${type}Filter`, value);
    }
};

const activeFilterCount = computed(() => {
    let count = 0;
    if (props.sortBy !== "name") count++;
    if (store.selectedSource !== "all") count++;
    if (store.selectedPlatform !== "all") count++;
    if (searchQuery.value) count++;
    return count;
});

const hasActiveFilters = computed(() => activeFilterCount.value > 0);

const resetFilters = () => {
    emit("sort", "name");
    emit("sourceFilter", "all");
    emit("platformFilter", "all");
    searchQuery.value = "";
    store.setSearchQuery("");
    isFilterOpen.value = false;
};

const handleFilter = (type, value) => {
    if (window.innerWidth < 768) {
        isFilterOpen.value = false;
    }

    // Handle sort separately from filters
    if (type === "sort") {
        emit("sort", value);
    } else {
        emit(`${type}Filter`, value);
    }
};

const formatSortBy = (sort) => {
    const formats = {
        name: "Name",
        date: "Release Date",
        score: "Harmony Score",
        rank: "Ranking",
    };
    return formats[sort] || sort;
};

const formatPlatformName = (platform) => {
    const names = {
        windows: "Windows",
        macos: "macOS",
        linux: "Linux",
        steamdeck: "Steam Deck",
        switch: "Switch",
    };
    return names[platform] || platform;
};
</script>
