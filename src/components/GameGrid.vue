<template>
    <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
        <GameCard
            v-for="game in games"
            :key="game.title"
            :game="game"
            @click="$emit('selectGame', game)"
        />
    </div>
</template>

<script setup>
import GameCard from "./GameCard.vue";

defineProps({
    games: {
        type: Array,
        required: true,
    },
});

defineEmits(["selectGame"]);
</script>
