<!-- src/components/GameSidebar.vue -->
<template>
    <Transition
        enter-active-class="transform transition ease-in-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in-out duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
    >
        <div
            v-if="isOpen"
            class="fixed inset-y-0 right-0 w-96 bg-gray-50 shadow-xl overflow-y-auto border-l border-gray-200"
        >
            <div class="p-6">
                <button
                    @click="$emit('update:isOpen', false)"
                    class="close-sidebar absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-full transition-colors"
                >
                    <XIcon size="24" />
                </button>

                <div v-if="game" class="space-y-6">
                    <div class="relative">
                        <img
                            :src="game.header_image"
                            :alt="game.title"
                            class="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h2 class="text-2xl font-bold text-gray-900">
                            {{ game.title }}
                        </h2>
                        <p class="text-gray-600 mt-1">
                            Released:
                            {{
                                new Date(game.release_date).toLocaleDateString()
                            }}
                        </p>
                    </div>

                    <!-- Platforms with icons -->
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-3">Platforms</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="(value, platform) in supportedPlatforms"
                                :key="platform"
                                class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                            >
                                <component
                                    :is="platformIcon(platform)"
                                    class="text-gray-600"
                                    :size="14"
                                />
                                {{ formatPlatformName(platform) }}
                            </span>
                        </div>
                    </div>

                    <!-- Rankings -->
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-3">Rankings</h3>
                        <div class="divide-y divide-gray-100">
                            <div
                                v-for="(rank, source) in game.rankings"
                                :key="source"
                                class="flex justify-between items-center py-2 first:pt-0 last:pb-0"
                            >
                                <span class="text-gray-600">{{ source }}</span>
                                <span class="font-bold text-primary-600"
                                    >#{{ rank }}</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Stores -->
                    <div
                        v-if="game.stores?.length"
                        class="bg-white rounded-lg p-4 shadow-sm"
                    >
                        <h3 class="font-bold text-gray-900 mb-3">
                            Available on
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="store in game.stores"
                                :key="store"
                                class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                                {{ store }}
                            </span>
                        </div>
                    </div>

                    <!-- Links -->
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-3">Links</h3>
                        <div class="space-y-3">
                            <a
                                v-if="game.steam_id"
                                :href="
                                    'https://store.steampowered.com/app/' +
                                    game.steam_id
                                "
                                target="_blank"
                                class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <Store
                                    class="group-hover:text-blue-600"
                                    size="16"
                                />
                                <span class="group-hover:underline"
                                    >View on Steam</span
                                >
                            </a>

                            <a
                                v-if="game.protondb_url"
                                :href="game.protondb_url"
                                target="_blank"
                                class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <TestTube2
                                    class="group-hover:text-blue-600"
                                    size="16"
                                />
                                <span class="group-hover:underline"
                                    >ProtonDB Compatibility</span
                                >
                            </a>

                            <a
                                v-if="game.reddit_url"
                                :href="game.reddit_url"
                                target="_blank"
                                class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <MessageCircle
                                    class="group-hover:text-blue-600"
                                    size="16"
                                />
                                <span class="group-hover:underline"
                                    >Reddit Community</span
                                >
                            </a>

                            <a
                                v-if="game.metacritic_url"
                                :href="game.metacritic_url"
                                target="_blank"
                                class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <Award
                                    class="group-hover:text-blue-600"
                                    size="16"
                                />
                                <span class="group-hover:underline"
                                    >Metacritic Reviews</span
                                >
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed } from "vue";
import {
    XIcon,
    Monitor,
    Apple,
    Github,
    Gamepad2,
    Store,
    TestTube2,
    MessageCircle,
    Award,
} from "lucide-vue-next";

const props = defineProps({
    game: {
        type: Object,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
});

defineEmits(["update:isOpen"]);

const supportedPlatforms = computed(() => {
    const platforms = {};
    if (!props.game?.platforms) return platforms;

    if (props.game.platforms.windows === true) platforms.windows = true;
    if (props.game.platforms.macos === true) platforms.macos = true;
    if (props.game.platforms.linux === true) platforms.linux = true;
    if (props.game.platforms.steamdeck === "verified")
        platforms.steamdeck = true;
    if (props.game.platforms.switch === true) platforms.switch = true;

    return platforms;
});

const platformIcon = (platform) => {
    const icons = {
        windows: Monitor,
        macos: Apple,
        linux: Github,
        steamdeck: Gamepad2,
        switch: Gamepad2,
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
    return names[platform];
};
</script>
