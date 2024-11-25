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
            class="fixed inset-y-0 right-0 w-96 bg-white shadow-xl overflow-y-auto"
        >
            <div class="p-6">
                <button
                    @click="$emit('update:isOpen', false)"
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <XIcon size="24" />
                </button>

                <div v-if="game" class="space-y-6">
                    <img
                        :src="game.header_image"
                        :alt="game.title"
                        class="w-full h-48 object-cover rounded-lg"
                    />

                    <div>
                        <h2 class="text-2xl font-bold">{{ game.title }}</h2>
                        <p class="text-gray-600">
                            Released:
                            {{
                                new Date(game.release_date).toLocaleDateString()
                            }}
                        </p>
                    </div>

                    <div v-if="game.metacritic" class="flex items-center gap-2">
                        <span class="font-bold">Metacritic:</span>
                        <span
                            class="bg-green-100 text-green-800 px-2 py-1 rounded font-bold"
                        >
                            {{ game.metacritic }}
                        </span>
                    </div>

                    <!-- Platforms with icons -->
                    <div>
                        <h3 class="font-bold mb-2">Platforms</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="(value, platform) in supportedPlatforms"
                                :key="platform"
                                class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
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
                    <div>
                        <h3 class="font-bold mb-2">Rankings</h3>
                        <div class="space-y-2 bg-gray-50 rounded-lg p-3">
                            <div
                                v-for="(rank, source) in game.rankings"
                                :key="source"
                                class="flex justify-between items-center"
                            >
                                <span class="font-medium">{{ source }}</span>
                                <span class="font-bold text-primary-600"
                                    >#{{ rank }}</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Stores -->
                    <div v-if="game.stores && game.stores.length">
                        <h3 class="font-bold mb-2">Available on</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="store in game.stores"
                                :key="store"
                                class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                            >
                                {{ store }}
                            </span>
                        </div>
                    </div>

                    <!-- Links -->
                    <div class="space-y-2">
                        <h3 class="font-bold mb-2">Links</h3>

                        <div
                            v-if="game.steam_id"
                            class="flex items-center gap-2"
                        >
                            <Store class="text-gray-600" size="16" />
                            <a
                                :href="
                                    'https://store.steampowered.com/app/' +
                                    game.steam_id
                                "
                                target="_blank"
                                class="text-blue-600 hover:underline"
                            >
                                View on Steam
                            </a>
                        </div>

                        <div
                            v-if="game.protondb_url"
                            class="flex items-center gap-2"
                        >
                            <TestTube2 class="text-gray-600" size="16" />
                            <a
                                :href="game.protondb_url"
                                target="_blank"
                                class="text-blue-600 hover:underline"
                            >
                                ProtonDB Compatibility
                            </a>
                        </div>

                        <div
                            v-if="game.reddit_url"
                            class="flex items-center gap-2"
                        >
                            <MessageSquare class="text-gray-600" size="16" />
                            <a
                                :href="game.reddit_url"
                                target="_blank"
                                class="text-blue-600 hover:underline"
                            >
                                Reddit Community
                            </a>
                        </div>

                        <div
                            v-if="game.metacritic_url"
                            class="flex items-center gap-2"
                        >
                            <Star class="text-gray-600" size="16" />
                            <a
                                :href="game.metacritic_url"
                                target="_blank"
                                class="text-blue-600 hover:underline"
                            >
                                Metacritic Reviews
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
    MessageSquare,
    Star,
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
