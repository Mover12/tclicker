<script>
    export default {
        props: [
            'upgrade_id'
        ]
    }
</script>

<template>
    <div class="upgrade" :upgrade_id="upgrade_id">
        <div class="upgrade-name">
            <slot name="name"></slot>
        </div>
        <div class="description">
            <slot name="description"></slot>
        </div>
        <div class="upgrade-level">
            Уровень <slot name="level"></slot>
        </div>
        <div class="price">
            Цена <slot name="price"></slot>
        </div>
    </div>
</template>