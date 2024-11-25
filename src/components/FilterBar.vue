<template>
    <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="flex flex-wrap gap-6 items-center">
            <div class="rank-order flex items-center gap-4">
                <span class="text-sm font-medium text-gray-700">Sort by:</span>
                <div class="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        @click="$emit('sort', 'rank')"
                        :class="[
                            'px-3 py-1 rounded transition-all',
                            sortBy === 'rank'
                                ? 'bg-white shadow'
                                : 'hover:bg-gray-200',
                        ]"
                    >
                        Rank
                    </button>
                    <button
                        @click="$emit('sort', 'date')"
                        :class="[
                            'px-3 py-1 rounded transition-all',
                            sortBy === 'date'
                                ? 'bg-white shadow'
                                : 'hover:bg-gray-200',
                        ]"
                    >
                        Release Date
                    </button>
                </div>
            </div>

            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Source</label
                >
                <select
                    class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                    @change="$emit('sourceFilter', $event.target.value)"
                >
                    <option value="all">All Sources</option>
                    <option value="IGN">IGN</option>
                    <option value="PCGamer">PC Gamer</option>
                    <option value="Eurogamer">Eurogamer</option>
                    <option value="RPS">RPS</option>
                </select>
            </div>

            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Platform</label
                >
                <select
                    class="w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                    @change="$emit('platformFilter', $event.target.value)"
                >
                    <option value="all">All Platforms</option>
                    <option value="windows">Windows</option>
                    <option value="macos">macOS</option>
                    <option value="linux">Linux</option>
                    <option value="steamdeck">Steam Deck</option>
                    <option value="switch">Switch</option>
                </select>
            </div>
        </div>

        <div class="mt-4 text-sm text-gray-600">
            Showing {{ store.displayedGamesCount }} of
            {{ store.totalGamesCount }} games
        </div>
    </div>
</template>

<script setup>
import { useGamesStore } from "../stores/games";

const store = useGamesStore();

defineProps({
    sortBy: {
        type: String,
        required: true,
    },
});

defineEmits(["sort", "sourceFilter", "platformFilter"]);
</script>
