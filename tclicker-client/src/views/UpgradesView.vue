<script setup>
    import Upgrade from '../components/Upgrade.vue'
    import clicker from '@/main'
    import { useUserStore } from '@/stores/user';

    const user_store = useUserStore();

    clicker.sync().then(async res => {
        if(res.status == '200') {
            const body = await res.json()
            user_store.user = body.user
            user_store.upgrades = await clicker.upgrades().then(res => res.json())
        }
    });
    
    async function buy_upgade(e) {
        Telegram.WebApp.HapticFeedback.impactOccurred('light')
        const upgrade_id = e.currentTarget.getAttribute('upgrade_id')
        user_store.user = (await clicker.buy(upgrade_id).then(res => res.json())).user
    }
</script>

<template>
    <div class="upgrades">
        <Upgrade @click="buy_upgade" v-for="upgrade of user_store.upgrades" :upgrade_id='upgrade.upgrade_id'>
            <template #name>{{upgrade.name}}</template>
            <template #description>{{upgrade.description}}</template>
            <template #level>{{user_store.user.upgrades[upgrade.upgrade_id]?.upgrade_level || 0}}</template>
            <template #price>{{upgrade.price}}</template>
        </Upgrade>
    </div>
</template>

<style>
    .upgrade {
        background: var(--tg-theme-button-color);

        width: 200px;
        height: 200px;

        margin-top: 10px;
    }
</style>