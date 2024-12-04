<template>
    <button
        class="card w-full cursor-pointer transition-opacity duration-200"
        :class="{ 'opacity-40': store.shouldBeOpaque(game) }"
        @click="$emit('click', game)"
    >
        <div class="relative">
            <img
                :src="game.header_image"
                :alt="game.title"
                loading="lazy"
                decoding="async"
                class="w-full h-48 object-cover"
            />
            <div
                v-if="game.harmony_score"
                class="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold"
            >
                {{ game.harmony_score }}
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg truncate">{{ game.title }}</h3>
            <div class="flex justify-between items-center mt-2">
                <span class="text-sm text-gray-600">
                    {{ new Date(game.release_date).getFullYear() }}
                </span>
                <div class="flex gap-1">
                    <span
                        v-for="(value, platform) in platformsToShow"
                        :key="platform"
                        class="w-4 h-4"
                    >
                        <component
                            :is="platformIcon(platform)"
                            class="text-gray-600"
                            :size="16"
                        />
                    </span>
                </div>
            </div>
        </div>
    </button>
</template>

<script setup>
import { computed } from "vue";
import { Monitor, Apple, Github, Gamepad, Gamepad2 } from "lucide-vue-next";
import { useGamesStore } from "../stores/games";

const props = defineProps({
    game: {
        type: Object,
        required: true,
    },
});

const store = useGamesStore();

const platformsToShow = computed(() => {
    const supported = {};
    if (props.game.platforms.windows === true) supported.windows = true;
    if (props.game.platforms.macos === true) supported.macos = true;
    if (props.game.platforms.linux === true) supported.linux = true;
    if (props.game.platforms.switch === true) supported.switch = true;
    if (props.game.platforms.steamdeck === "verified")
        supported.steamdeck = true;
    return supported;
});

defineEmits(["click"]);

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
</script>
