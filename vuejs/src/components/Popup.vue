<template>
    <transition name="popup-animation">
        <div v-show="popupActive" class="popup" @click="close">
            <transition name="popup-animation-inner">
                <div v-show="popupActive" class="popup-inner" @click.stop>
                    <slot />
                    <div class="button-container">
                        <button class="button" @click="close" type="button">Cancel</button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script lang="ts">
export default {
    props: ['popupActive'],
    setup(props, {emit}) {

        const close = () => {
            emit('close');
        }

        return { close }
    }
}
</script>