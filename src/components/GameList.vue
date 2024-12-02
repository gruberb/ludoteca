<template>
    <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Table Header with clickable columns -->
        <div
            class="grid grid-cols-list gap-4 p-4 bg-gray-50 border-b text-sm text-gray-600"
        >
            <!-- Game column - sort by name -->
            <button
                @click="handleSort('name')"
                class="flex items-center gap-2 font-medium hover:text-primary-600"
            >
                Game
                <SortIcon
                    v-if="sortBy === 'name'"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                    class="w-4 h-4 transition-transform"
                />
            </button>

            <!-- Rankings column - not sortable -->
            <div class="font-medium">Rankings</div>

            <!-- Harmony Score column -->
            <button
                @click="handleSort('score')"
                class="text-center flex items-center justify-center gap-2 font-medium hover:text-primary-600"
            >
                Harmony Score
                <SortIcon
                    v-if="sortBy === 'score'"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                    class="w-4 h-4 transition-transform"
                />
            </button>

            <!-- Metacritic column -->
            <button
                @click="handleSort('metacritic')"
                class="text-center flex items-center justify-center gap-2 font-medium hover:text-primary-600"
            >
                Metacritic
                <SortIcon
                    v-if="sortBy === 'metacritic'"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                    class="w-4 h-4 transition-transform"
                />
            </button>

            <!-- Static columns -->
            <div class="font-medium">Platforms</div>
            <div class="font-medium">Links</div>
        </div>

        <!-- Table Body -->
        <div class="divide-y">
            <div
                v-for="game in games"
                :key="game.title"
                class="grid grid-cols-list gap-4 p-4 items-center hover:bg-gray-50"
            >
                <!-- Game Info -->
                <div class="flex items-center gap-3">
                    <img
                        :src="game.header_image"
                        :alt="game.title"
                        class="w-24 h-16 object-cover rounded"
                    />
                    <div>
                        <div class="font-medium">{{ game.title }}</div>
                        <div class="text-sm text-gray-500">
                            {{ new Date(game.release_date).getFullYear() }}
                        </div>
                    </div>
                </div>

                <!-- Rankings -->
                <div class="divide-y divide-gray-100">
                    <div
                        v-for="(rank, source) in game.rankings"
                        :key="source"
                        class="text-sm flex justify-between px-2 py-1"
                        :class="{ 'bg-gray-50': index % 2 === 0 }"
                    >
                        <span class="text-gray-600">{{ source }}</span>
                        <span class="font-medium">#{{ rank }}</span>
                    </div>
                </div>

                <!-- Harmony Score -->
                <div class="text-center">
                    <span class="font-medium text-green-600">
                        {{ game.harmony_score ? game.harmony_score : "-" }}
                    </span>
                </div>

                <!-- Metacritic -->
                <div class="text-center">
                    <a
                        v-if="game.metacritic_url"
                        :href="game.metacritic_url"
                        target="_blank"
                        class="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                        {{ game.metacritic || "-" }}
                        <ExternalLink size="14" />
                    </a>
                    <span v-else>{{ game.metacritic || "-" }}</span>
                </div>

                <!-- Platforms -->
                <div class="flex gap-1.5">
                    <template
                        v-for="(value, platform) in game.platforms"
                        :key="platform"
                    >
                        <span
                            v-if="isPlatformSupported(value, platform)"
                            :title="formatPlatformName(platform)"
                            class="text-gray-600"
                        >
                            <component
                                :is="platformIcon(platform)"
                                :size="18"
                            />
                        </span>
                    </template>
                </div>

                <!-- Links -->
                <div class="flex items-center gap-3">
                    <a
                        v-if="game.steam_id"
                        :href="
                            'https://store.steampowered.com/app/' +
                            game.steam_id
                        "
                        target="_blank"
                        class="text-gray-600 hover:text-blue-600"
                        title="View on Steam"
                    >
                        <Store size="18" />
                    </a>
                    <a
                        v-if="game.protondb_url"
                        :href="game.protondb_url"
                        target="_blank"
                        class="text-gray-600 hover:text-blue-600"
                        title="ProtonDB Compatibility"
                    >
                        <TestTube2 size="18" />
                    </a>
                    <a
                        v-if="game.reddit_url"
                        :href="game.reddit_url"
                        target="_blank"
                        class="text-gray-600 hover:text-blue-600"
                        title="Reddit Community"
                    >
                        <MessageCircle size="18" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Monitor,
    Apple,
    Github,
    Gamepad,
    Gamepad2,
    Store,
    TestTube2,
    MessageCircle,
    ExternalLink,
    ArrowUpDown as SortIcon,
} from "lucide-vue-next";

const props = defineProps({
    games: {
        type: Array,
        required: true,
    },
    sortBy: {
        type: String,
        required: true,
    },
    sortDirection: {
        type: String,
        default: "asc",
    },
});

const emit = defineEmits(["sort"]);

const handleSort = (column) => {
    if (props.sortBy === column) {
        // If already sorting by this column, toggle direction
        emit("sort", {
            column,
            direction: props.sortDirection === "asc" ? "desc" : "asc",
        });
    } else {
        // New column, start with ascending
        emit("sort", {
            column,
            direction: "asc",
        });
    }
};

const isPlatformSupported = (value, platform) => {
    if (platform === "steamdeck") {
        return value === "verified";
    }
    return value === true;
};

const platformIcon = (platform) => {
    const icons = {
        windows: Monitor,
        macos: Apple,
        linux: Github,
        steamdeck: Gamepad2,
        switch: Gamepad,
    };
    return icons[platform];
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

<style>
.grid-cols-list {
    grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr;
}
</style>
